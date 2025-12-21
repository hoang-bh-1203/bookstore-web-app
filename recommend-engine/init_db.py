"""
Initialize database: Load data from CSV, generate embeddings, and store in Qdrant
"""

import pandas as pd
import os
from tqdm import tqdm
from qdrant_client.models import PointStruct
from src.config import Config
from src.core_engine import engine_instance


def load_and_process_data():
    """Load data from CSV, process, and store in Qdrant"""
    print("🚀 Starting database initialization...")

    # Load CSV data
    csv_path = os.path.join(Config.BASE_DIR, "data", "data_book_1.csv")
    print(f"📖 Loading data from: {csv_path}")

    if not os.path.exists(csv_path):
        print(f"❌ Error: CSV file not found at {csv_path}")
        return

    df = pd.read_csv(csv_path)
    print(f"✅ Loaded {len(df)} books")

    # Ensure Qdrant collection exists
    print("🔧 Ensuring Qdrant collection exists...")
    engine_instance.qdrant.ensure_collection()

    # Process each book
    points = []
    print("🔄 Processing books and generating embeddings...")

    for idx, row in tqdm(df.iterrows(), total=len(df), desc="Processing"):
        try:
            # Prepare input text (category + description)
            # Use processor from engine_instance to avoid JVM conflict
            input_text = engine_instance.processor.prepare_input(row)

            # Generate embedding
            vector = engine_instance.encode(input_text)

            # Create point with payload
            point = PointStruct(
                id=int(row["id"]),
                vector=vector,
                payload={
                    "isbn": str(row.get("isbn", "")),
                },
            )
            points.append(point)

            # Batch upsert every 100 points
            if len(points) >= 100:
                engine_instance.qdrant.upsert_batch(points)
                points = []

        except Exception as e:
            print(f"⚠️ Error processing book ID {row['id']}: {e}")
            continue

    # Upsert remaining points
    if points:
        engine_instance.qdrant.upsert_batch(points)

    print(f"✅ Database initialization completed! {len(df)} books processed.")


if __name__ == "__main__":
    load_and_process_data()
