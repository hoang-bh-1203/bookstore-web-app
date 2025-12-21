from qdrant_client import QdrantClient, models
from .config import Config


class QdrantHandler:
    def __init__(self):
        self.client = QdrantClient(
            url=Config.QDRANT_HOST, api_key=Config.QDRANT_API_KEY
        )
        self.collection = Config.COLLECTION_NAME

    def ensure_collection(self):
        if not self.client.collection_exists(self.collection):
            print(f"🛠️ Creating Qdrant collection: {self.collection}")
            self.client.create_collection(
                collection_name=self.collection,
                vectors_config=models.VectorParams(
                    size=768, distance=models.Distance.COSINE
                ),
            )

    def upsert_batch(self, points):
        if points:
            self.client.upsert(collection_name=self.collection, points=points)

    def search(self, query_vector, limit=10):
        """Search for similar books using cosine similarity"""
        results = self.client.query_points(
            collection_name=self.collection,
            query=query_vector,
            limit=limit,
        )
        return results.points

    def get_book_vector(self, book_id):
        """Retrieve a book's vector by its ID"""
        try:
            point = self.client.retrieve(
                collection_name=self.collection,
                ids=[book_id],
                with_vectors=True,
            )
            if point:
                return point[0].vector
            return None
        except Exception:
            return None
