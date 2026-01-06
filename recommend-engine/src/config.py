import os
import torch
from dotenv import load_dotenv

load_dotenv()


class Config:
    # --- System ---
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # --- Model ---
    MODEL_NAME = os.getenv("MODEL_NAME", "VoVanPhuc/sup-SimCSE-VietNamese-phobert-base")
    CACHE_DIR = os.path.join(BASE_DIR, "cache")
    SEGMENTER_DIR = os.path.join(BASE_DIR, "vncorenlp")
    MAX_LEN = 160

    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "root")
    MYSQL_DB = os.getenv("MYSQL_DB", "book_shop")

    # --- Vector Store Qdrant ---
    QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")
    COLLECTION_NAME = "books"
