import os
from fastapi import FastAPI
from contextlib import asynccontextmanager

from core.logging_config import logger

from engine.rag_engine import load_rag_models
from api.router import router

APP_VERSION = os.getenv("APP_VERSION", "1.0.0")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Loading models and initializing AI Engine...")
    

    # Load RAG Models
    load_rag_models()

    from engine.translation_engine import load_translation_models
    from engine.vision_engine import load_vision_models
    from engine.similarity_engine import load_similarity_models

    logger.info("Loading translation models...")
    load_translation_models()
    logger.info("Loading vision models...")
    load_vision_models()
    logger.info("Loading similarity models...")
    load_similarity_models()

    logger.info("System Ready.")
    
    yield  # Yield control to FastAPI app
    
    from core.globals import ml_models
    ml_models.clear()
    logger.info("🧹 Models cleared from memory. Shutting down...")


# Initialize FastAPI
app = FastAPI(
    title="AI CRM Monolithic API",
    description="Provides sentiment analysis, ticket classification, QA and text summarization in a single monolith.",
    version=APP_VERSION,
    lifespan=lifespan
)

# Include all API routes
app.include_router(router, prefix="/api")

@app.get("/", tags=["Health Check"])
def read_root():
    return {
        "status": "AI CRM API is running",
        "version": APP_VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
