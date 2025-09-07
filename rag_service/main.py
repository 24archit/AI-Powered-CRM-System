from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.router import router as api_router, ml_models
from app.services import create_rag_pipeline, create_summarization_chain
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Load version from environment or fallback
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage startup and shutdown events for the FastAPI application.
    On startup: load all AI models and chains into memory.
    On shutdown: release models from memory.
    """
    try:
        logger.info("🚀 Starting AI CRM RAG & Summarization Service (v%s)", APP_VERSION)

        # Load RAG pipeline
        retriever, document_chain = create_rag_pipeline()
        ml_models["retriever"] = retriever
        ml_models["document_chain"] = document_chain

        # Load summarization chain
        ml_models["summarization_chain"] = create_summarization_chain()

        logger.info("✅ Model loading complete. API is ready.")
    except Exception as e:
        logger.exception("❌ Failed to load AI models: %s", e)
        raise

    yield  # Application runs here

    # On shutdown
    ml_models.clear()
    logger.info("🧹 Models cleared from memory. Shutdown complete.")

# Create the FastAPI application instance
app = FastAPI(
    title="AI CRM RAG & Summarization Service",
    description="Provides question-answering and text summarization capabilities.",
    version=APP_VERSION,
    lifespan=lifespan
)

# Include API routers
app.include_router(api_router, prefix="/api")

@app.get("/", tags=["Health Check"])
def read_root():
    """
    Root health check endpoint.
    """
    return {
        "status": "RAG & Summarization Service is running",
        "version": APP_VERSION
    }
