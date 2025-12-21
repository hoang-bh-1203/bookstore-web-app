import torch
import torch.nn.functional as F
from transformers import AutoTokenizer
from .config import Config
from .model_loader import load_model
from .text_processor import TextProcessor
from .qdrant_ops import QdrantHandler


class Engine:
    def __init__(self):
        self.config = Config
        self.processor = TextProcessor()
        self.tokenizer = AutoTokenizer.from_pretrained(
            Config.MODEL_NAME, cache_dir=Config.CACHE_DIR
        )
        self.model = load_model(Config)
        self.qdrant = QdrantHandler()

    def encode(self, text):
        segmented = self.processor.segment(text)
        inputs = self.tokenizer(
            segmented,
            padding=True,
            truncation=True,
            max_length=Config.MAX_LEN,
            return_tensors="pt",
        ).to(Config.DEVICE)

        with torch.no_grad():
            vector = self.model(inputs["input_ids"], inputs["attention_mask"])
            vector = F.normalize(vector, p=2, dim=1)

        return vector.cpu().numpy()[0].tolist()

    def recommend(self, query_text, top_k=10):
        """Get top K similar books based on query text using cosine similarity"""
        # Encode query text to vector
        query_vector = self.encode(query_text)

        # Search in Qdrant using cosine similarity
        results = self.qdrant.search(query_vector, limit=top_k)

        # Format results
        recommendations = []
        for hit in results:
            recommendations.append(
                {
                    "book_id": hit.id,
                    "score": hit.score,
                    "category": hit.payload.get("category", ""),
                }
            )

        return recommendations

    def recommend_by_book(self, book_id, top_k=10):
        """Get top K similar books based on a given book ID"""
        # Get the vector of the given book
        book_vector = self.qdrant.get_book_vector(book_id)

        if book_vector is None:
            return []

        # Search in Qdrant using cosine similarity
        # top_k + 1 because the book itself will be in results
        results = self.qdrant.search(book_vector, limit=top_k + 1)

        # Filter out the input book and return only book IDs
        recommendations = []
        for hit in results:
            if hit.id != book_id:  # Exclude the input book
                recommendations.append(hit.id)
                if len(recommendations) >= top_k:
                    break

        return recommendations


engine_instance = Engine()
