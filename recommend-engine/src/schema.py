from pydantic import BaseModel
from typing import List


# Sentence embedding request
class EmbedRequest(BaseModel):
    name: str
    category: str
    description: str


# Semantic recommendation request
class SearchRequest(BaseModel):
    input: str
    limit: int = 30


# Recommend books based on text query
class SimilarRequest(BaseModel):
    book_id: int
    limit: int = 8


# Response: Return list of IDs for Spring
class AiResponse(BaseModel):
    book_ids: List[int]
    scores: List[float]  # Similarity scores (for debugging or displaying match quality)
