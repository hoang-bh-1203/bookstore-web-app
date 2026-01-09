from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from .core_engine import engine_instance
from .schema import EmbedRequest, SearchRequest, SimilarRequest, AiResponse

router = APIRouter()


@router.post("/embed")
async def embed_text(req: EmbedRequest):
    """
    Generate embedding vector for the given text

    :param req: Request containing the text to be embedded
    :type req: EmbedRequest
    """
    try:
        vector = engine_instance.process_input(req.name, req.category, req.description)
        return {"vector": vector}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommend")
async def recommend_books(req: SearchRequest):
    """Get top K book recommendations based on query text using cosine similarity"""
    try:
        if req.limit < 1 or req.limit > 30:
            raise HTTPException(
                status_code=400, detail="Limit must be between 1 and 30"
            )

        recommendations = engine_instance.recommend(req.query, top_k=req.limit)
        return {
            "query": req.query,
            "limit": req.limit,
            "recommendations": recommendations,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/similar", response_model=AiResponse)
async def get_similar(req: SimilarRequest):
    """Get top K similar books based on a given book ID"""
    try:
        if req.limit < 1 or req.limit > 8:
            raise HTTPException(status_code=400, detail="Limit must be between 1 and 8")

        recommendations = engine_instance.recommend_by_book(
            req.book_id, top_k=req.limit
        )

        if not recommendations:
            raise HTTPException(
                status_code=404, detail=f"Book with ID {req.book_id} not found"
            )

        # Extract book IDs and scores from recommendations
        book_ids = [book["book_id"] for book in recommendations]
        scores = [book["score"] for book in recommendations]

        return AiResponse(book_ids=book_ids, scores=scores)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/semantic-search", response_model=AiResponse)
async def semantic_search(req: SearchRequest):
    """Perform semantic search to find similar books based on text query"""
    try:
        if req.limit < 1 or req.limit > 30:
            raise HTTPException(
                status_code=400, detail="Limit must be between 1 and 30"
            )

        recommendations = engine_instance.recommend(req.input, top_k=req.limit)

        # Extract book IDs and scores from recommendations
        book_ids = [book["book_id"] for book in recommendations]
        scores = [book["score"] for book in recommendations]

        return AiResponse(book_ids=book_ids, scores=scores)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health_check():
    return {"status": "ok", "device": str(engine_instance.config.DEVICE)}
