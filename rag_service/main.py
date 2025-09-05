from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.router import router as api_router, ml_models
from app.services import create_rag_pipeline, create_summarization_chain

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages the application's startup and shutdown events.
    On startup, it loads all necessary AI models and chains.
    On shutdown, it clears them from memory.
    """
    # This code runs on startup
    print("--- Loading AI Models for RAG Service ---")
    retriever, document_chain = create_rag_pipeline()
    ml_models["retriever"] = retriever
    ml_models["document_chain"] = document_chain
    
    summarization_chain = create_summarization_chain()
    ml_models["summarization_chain"] = summarization_chain
    print("--- Model loading complete. API is ready. ---")
    
    yield
    
    # This code runs on shutdown
    ml_models.clear()
    print("--- Models cleared from memory ---")

# Create the main FastAPI application instance
app = FastAPI(
    title="AI CRM RAG & Summarization Service",
    description="Provides question-answering and text summarization capabilities.",
    version="1.0.0",
    lifespan=lifespan
)

# API endpoints defined in the router.py file
app.include_router(api_router, prefix="/api")

@app.get("/", tags=["Health Check"])
def read_root():
    """
    Root endpoint for a basic health check.
    """
    return {"status": "RAG & Summarization Service is running."}

