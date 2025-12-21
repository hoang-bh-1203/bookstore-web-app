from apscheduler.schedulers.background import BackgroundScheduler
from qdrant_client import models
from .database import fetch_all_books_batch
from .qdrant_ops import QdrantHandler
from .core_engine import engine_instance
import datetime


def sync_data_job():
    print(f"[00:00] Starting Nightly Sync Job: {datetime.datetime.now()}")

    qdrant = QdrantHandler()
    qdrant.ensure_collection()

    total_synced = 0

    # Duyệt qua từng batch từ MySQL
    for batch in fetch_all_books_batch(batch_size=64):
        points = []
        for row in batch:
            try:
                # 1. Tạo input text
                text_input = engine_instance.processor.prepare_input(row)

                # 2. Vector hóa
                vector = engine_instance.encode(text_input)

                # 3. Tạo Payload
                payload = {
                    "title": str(row.get("title", "")),
                    "price": float(row.get("price", 0)),
                    "image_url": str(row.get("image_url", "")),
                    "author_names": str(row.get("author_names", "")),
                    "category_names": str(row.get("category_names", "")),
                }

                points.append(
                    models.PointStruct(
                        id=int(row["id"]), vector=vector, payload=payload
                    )
                )
            except Exception as e:
                print(f"❌ Error processing ID {row.get('id')}: {e}")

        # 4. Upsert vào Qdrant
        qdrant.upsert_batch(points)
        total_synced += len(points)
        print(f"   -> Synced batch {len(points)} items.")

    print(f"✅ Sync Job Completed! Total: {total_synced} items.")


def start_scheduler():
    scheduler = BackgroundScheduler()
    # Chạy vào 0 giờ 0 phút mỗi ngày
    scheduler.add_job(sync_data_job, "cron", hour=0, minute=0)
    scheduler.start()
    print("⏳ Scheduler started (Sync job set for 00:00 daily).")
