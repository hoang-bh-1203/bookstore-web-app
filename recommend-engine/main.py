import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.api import router
from src.scheduler import start_scheduler
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Recommendation Engine...")
    start_scheduler()
    # (Tùy chọn) Chạy sync ngay khi start nếu muốn test (comment lại khi prod)
    # sync_data_job()
    yield
    # Shutdown
    print("👋 Shutting down Recommendation Engine...")


app = FastAPI(title="Book Recommender AI Engine", lifespan=lifespan)

# Register API Routes
app.include_router(router)


if __name__ == "__main__":
    # Chạy server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=False,  # reload=False để tránh duplicate scheduler
    )
