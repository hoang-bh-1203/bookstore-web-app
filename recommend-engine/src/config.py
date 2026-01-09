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

    # --- Vector Store Qdrant ---
    QDRANT_HOST = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")
    COLLECTION_NAME = "book_shop"
