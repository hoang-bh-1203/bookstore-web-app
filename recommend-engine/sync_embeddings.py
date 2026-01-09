"""
Utility script to manually trigger embedding sync from MySQL to Qdrant.
Run this script to sync all products without waiting for the scheduled job.

Usage:
    python sync_embeddings.py           # Sync all products
    python sync_embeddings.py test      # Test with 10 products only
    python sync_embeddings.py 50        # Sync first 50 products
"""

import sys
from src.scheduler import sync_data_job

if __name__ == "__main__":
    limit = None

    # Parse command line arguments
    if len(sys.argv) > 1:
        arg = sys.argv[1]
        if arg.lower() == "test":
            limit = 10
            print("🧪 TEST MODE: Syncing 10 products only\n")
        else:
            try:
                limit = int(arg)
                print(f"📊 LIMITED MODE: Syncing {limit} products only\n")
            except ValueError:
                print("❌ Invalid argument. Use 'test' or a number.")
                print("Usage: python sync_embeddings.py [test|<number>]")
                sys.exit(1)
    else:
        print("🚀 Starting full embedding sync...\n")

    sync_data_job(limit=limit)
    print("\n✅ Manual sync completed!")
