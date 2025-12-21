from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from .core_engine import engine_instance

router = APIRouter()


class EmbedRequest(BaseModel):
    text: str


class RecommendRequest(BaseModel):
    query: str
    top_k: Optional[int] = 10


class RecommendByBookRequest(BaseModel):
    book_id: int
    top_k: Optional[int] = 10


class SemanticSearchRequest(BaseModel):
    text: str
    top_k: Optional[int] = 50


@router.post("/embed")
async def embed_text(req: EmbedRequest):
    """
    Generate embedding vector for the given text

    :param req: Request containing the text to be embedded
    :type req: EmbedRequest
    """
    try:
        vector = engine_instance.encode(req.text)
        return {"vector": vector}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommend")
async def recommend_books(req: RecommendRequest):
    """Get top K book recommendations based on query text using cosine similarity"""
    try:
        if req.top_k < 1 or req.top_k > 10:
            raise HTTPException(
                status_code=400, detail="top_k must be between 1 and 10"
            )

        recommendations = engine_instance.recommend(req.query, top_k=req.top_k)
        return {
            "query": req.query,
            "top_k": req.top_k,
            "recommendations": recommendations,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommend/by-book")
async def recommend_by_book(req: RecommendByBookRequest):
    """Get top K similar books based on a given book ID"""
    try:
        if req.top_k < 1 or req.top_k > 10:
            raise HTTPException(
                status_code=400, detail="top_k must be between 1 and 10"
            )

        recommendations = engine_instance.recommend_by_book(
            req.book_id, top_k=req.top_k
        )

        if not recommendations:
            raise HTTPException(
                status_code=404, detail=f"Book with ID {req.book_id} not found"
            )

        return {
            "book_id": req.book_id,
            "top_k": req.top_k,
            "recommendations": recommendations,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/semantic-search")
async def semantic_search(req: SemanticSearchRequest):
    """Perform semantic search to find similar books based on text query"""
    try:
        if req.top_k < 1 or req.top_k > 100:
            raise HTTPException(
                status_code=400, detail="top_k must be between 1 and 100"
            )

        recommendations = engine_instance.recommend(req.text, top_k=req.top_k)

        # Extract book IDs from recommendations
        book_ids = [book["book_id"] for book in recommendations]

        return {
            "query": req.text,
            "top_k": req.top_k,
            "book_ids": book_ids,
            "recommendations": recommendations,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health_check():
    return {"status": "ok", "device": str(engine_instance.config.DEVICE)}
