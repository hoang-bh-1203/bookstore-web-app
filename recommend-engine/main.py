import uvicorn
from fastapi import FastAPI
from src.api import router


app = FastAPI(title="Book Recommender AI Engine")

# Register API Routes
app.include_router(router, prefix="/api")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
    )
