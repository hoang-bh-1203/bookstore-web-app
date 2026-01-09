"""
Initialize database: Load data from MySQL, generate embeddings, and store in Qdrant
"""

import mysql.connector
import os
from tqdm import tqdm
from qdrant_client.models import PointStruct
from src.config import Config
from src.core_engine import engine_instance


def get_mysql_connection():
    """Create MySQL connection"""
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", ""),
        database=os.getenv("MYSQL_DB", "bookstore"),
    )


def fetch_books_from_mysql():
    """Fetch books data from MySQL with category information"""
    print("📊 Connecting to MySQL...")

    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
        SELECT p.id, p.isbn, p.name, p.description, c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        """

        print(f"🔍 Executing query: {query}")
        cursor.execute(query)
        books = cursor.fetchall()

        print(f"✅ Fetched {len(books)} books from MySQL")
        return books

    except Exception as e:
        print(f"❌ Error fetching data from MySQL: {e}")
        raise
    finally:
        cursor.close()
        conn.close()


def prepare_book_text(book):
    """
    Prepare text for embedding: name + category (name) + description

    Args:
        book: Dictionary with keys: id, isbn, name, description, category_name

    Returns:
        Processed and segmented text string
    """
    processor = engine_instance.processor

    # Get book details
    name = str(book.get("name") or "")
    category = str(book.get("category_name") or "")
    description = str(book.get("description") or "")

    # Clean each component
    name = processor.clean_text(name)
    category = processor.clean_text(category)
    description = processor.clean_text(description)

    # Truncate description to 200 words
    description = " ".join(description.split()[:200])

    # Format: name + category + description
    formatted_text = f"Tiêu đề: {name}. Thể loại: {category}. Mô tả: {description}"

    # Segment the entire text using RDRSegmenter
    segmented_text = processor.segment(formatted_text)

    return segmented_text


def load_and_process_data():
    """Load data from MySQL, process, and store in Qdrant"""
    print("🚀 Starting database initialization...")

    # Fetch data from MySQL
    books = fetch_books_from_mysql()

    if not books:
        print("❌ No books found in MySQL")
        return

    # Ensure Qdrant collection exists
    print("🔧 Ensuring Qdrant collection exists...")
    engine_instance.qdrant.ensure_collection()

    # Process each book
    points = []
    print("🔄 Processing books and generating embeddings...")

    for book in tqdm(books, desc="Processing"):
        try:
            # Prepare input text (name + category + description)
            input_text = prepare_book_text(book)

            # Generate embedding
            vector = engine_instance.encode(input_text)

            # Create point with payload
            point = PointStruct(
                id=int(book["id"]),
                vector=vector,
                payload={
                    "isbn": str(book.get("isbn", "")),
                    "name": str(book.get("name", "")),
                    "category_name": str(book.get("category_name", "")),
                },
            )
            points.append(point)

            # Batch upsert every 100 points
            if len(points) >= 100:
                engine_instance.qdrant.upsert_batch(points)
                points = []

        except Exception as e:
            print(f"⚠️ Error processing book ID {book['id']}: {e}")
            continue

    # Upsert remaining points
    if points:
        engine_instance.qdrant.upsert_batch(points)

    print(
        f"✅ Database initialization completed! {len(books)} books processed and pushed to Qdrant."
    )


if __name__ == "__main__":
    load_and_process_data()
