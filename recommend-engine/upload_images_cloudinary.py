import json
import os
import csv
import requests
import argparse
import logging
import threading
import cloudinary
import cloudinary.uploader
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# --- 1. CẤU HÌNH ---
load_dotenv()

# Setup Logging
logging.basicConfig(filename="error_log.txt", level=logging.ERROR, format="%(message)s")

# Cloudinary Config
CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
API_KEY = os.getenv("CLOUDINARY_API_KEY")
API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if not all([CLOUD_NAME, API_KEY, API_SECRET]):
    raise ValueError("❌ Thiếu cấu hình Cloudinary trong file .env")

cloudinary.config(cloud_name=CLOUD_NAME, api_key=API_KEY, api_secret=API_SECRET)

json_lock = threading.Lock()

# --- 2. CÁC HÀM XỬ LÝ ---


def create_session(workers):
    """Tạo Session tối ưu"""
    session = requests.Session()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.fahasa.com/",
    }
    session.headers.update(headers)
    retry = Retry(
        total=3, backoff_factor=1, status_forcelist=[403, 429, 500, 502, 503, 504]
    )
    adapter = HTTPAdapter(
        max_retries=retry, pool_connections=workers, pool_maxsize=workers
    )
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def safe_get_string(book, key):
    """Hàm lấy dữ liệu an toàn, chuyển None thành chuỗi rỗng"""
    val = book.get(key)
    return str(val).strip() if val is not None else ""


def check_cloudinary_exists(session, isbn):
    """Kiểm tra ảnh tồn tại bằng HTTP HEAD"""
    url = f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/v1/bookstore/book_{isbn}.jpg"
    try:
        res = session.head(url, timeout=5)
        if res.status_code == 200:
            return url
    except:
        pass
    return None


def download_image(session, url):
    """Tải ảnh từ source"""
    try:
        res = session.get(url, timeout=15)
        res.raise_for_status()
        img = Image.open(BytesIO(res.content))
        img.verify()
        return res.content
    except Exception:
        return None


def find_source_url(book):
    """Tìm link ảnh gốc"""
    raw = safe_get_string(book, "image_url")

    if raw.startswith("http"):
        return raw

    # Quét các trường khác
    for k, v in book.items():
        val = str(v).strip() if v is not None else ""
        if val.startswith("http") and len(val) > 10:
            return val
    return None


def process_book(book, session):
    """Luồng xử lý chính"""
    isbn = safe_get_string(book, "isbn")
    if not isbn:
        return "skipped_invalid_isbn", book

    current_url = safe_get_string(book, "image_url")

    # --- BƯỚC 1: Check Local ---
    if "cloudinary.com" in current_url:
        return "skipped_local", book

    # --- BƯỚC 2: Check Remote ---
    existing_cloud_url = check_cloudinary_exists(session, isbn)
    if existing_cloud_url:
        book["image_url"] = existing_cloud_url
        return "skipped_remote", book

    # --- BƯỚC 3: Download & Upload ---
    source_url = find_source_url(book)
    if not source_url:
        return "failed_no_url", book

    image_data = download_image(session, source_url)
    if not image_data:
        logging.error(f"Download Error ISBN {isbn}: {source_url}")
        return "failed_download", book

    try:
        public_id = f"book_{isbn}"
        cloudinary.uploader.upload(
            image_data,
            public_id=public_id,
            folder="bookstore",
            overwrite=True,
            resource_type="image",
            format="jpg",
        )

        new_url = f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/f_auto,q_auto/v1/bookstore/book_{isbn}.jpg"
        book["image_url"] = new_url
        return "success_upload", book

    except Exception as e:
        logging.error(f"Upload Error ISBN {isbn}: {e}")
        return "failed_upload", book


# --- 3. HÀM MAIN ---


def main(input_file, output_file, workers=20):
    print(f"🚀 Bắt đầu xử lý: {input_file} -> {output_file}")

    session = create_session(workers)

    try:
        with open(input_file, "r", encoding="utf-8") as f:
            books = json.load(f)
    except FileNotFoundError:
        print("❌ Không tìm thấy file input!")
        return
    except json.JSONDecodeError as e:
        print(f"❌ Lỗi đọc JSON: {e}")
        return

    if not isinstance(books, list):
        print("❌ File JSON phải là một mảng (list)")
        return

    stats = {
        "skipped_local": 0,
        "skipped_remote": 0,
        "success_upload": 0,
        "failed_download": 0,
        "failed_upload": 0,
        "failed_no_url": 0,
        "skipped_invalid_isbn": 0,
    }

    updated_books = []

    with ThreadPoolExecutor(max_workers=workers) as executor:
        future_to_book = {
            executor.submit(process_book, book, session): book for book in books
        }

        with tqdm(total=len(books), unit="book") as pbar:
            for future in as_completed(future_to_book):
                try:
                    status, updated_book = future.result()
                    stats[status] += 1
                    updated_books.append(updated_book)
                except Exception as e:
                    print(f"Lỗi không mong muốn: {e}")

                pbar.set_description(
                    f"Up:{stats['success_upload']} | Exists:{stats['skipped_remote']}"
                )
                pbar.update(1)

    # Write updated JSON
    with open(output_file, "w", encoding="utf-8") as f_out:
        json.dump(updated_books, f_out, ensure_ascii=False, indent=2)

    print("\n" + "=" * 40)
    print("✅ HOÀN THÀNH")
    print(f"1. Upload thành công:      {stats['success_upload']}")
    print(f"2. Có sẵn local:           {stats['skipped_local']}")
    print(f"3. Có sẵn remote:          {stats['skipped_remote']}")
    print(
        f"4. Lỗi/Không Link:         {stats['failed_download'] + stats['failed_no_url'] + stats['failed_upload']}"
    )
    print("=" * 40)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload ảnh sách lên Cloudinary")
    parser.add_argument(
        "--input", default="data/books_v3.json", help="File JSON đầu vào"
    )
    parser.add_argument(
        "--output", default="data/books_updated.json", help="File JSON kết quả"
    )
    parser.add_argument("--workers", type=int, default=20, help="Số luồng")
    args = parser.parse_args()

    main(args.input, args.output, args.workers)
