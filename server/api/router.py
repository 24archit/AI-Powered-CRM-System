from fastapi import APIRouter, HTTPException
from schemas import (
    FeedbackRequest, AnalysisResponse,
    RAGRequest, RAGResponse,
    SummarizeRequest, SummarizeResponse
)
from services.analysis_service import analyze_text
from services.rag_service import get_rag_response, get_summary_response
from core.globals import ml_models

router = APIRouter()

# --- Health Route ---
@router.get("/health", tags=["Health"])
def health_check():
    return {"status": "AI CRM API components are running"}

# --- Classifier Routes ---
@router.post("/analyze", response_model=AnalysisResponse, tags=["Classifier"])
async def analyze_feedback(request: FeedbackRequest):
    try:
        return analyze_text(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- RAG Routes ---
@router.post("/ask-rag", response_model=RAGResponse, tags=["RAG"])
async def ask_rag_endpoint(request: RAGRequest):
    if "retriever" not in ml_models or "document_chain" not in ml_models:
        raise HTTPException(status_code=503, detail="RAG service is not available. Please check if FAISS index is loaded.")
    
    response = await get_rag_response(request.question)
    return response

@router.post("/summarize", response_model=SummarizeResponse, tags=["Summarization"])
async def summarize_endpoint(request: SummarizeRequest):
    if "summarization_chain" not in ml_models:
        raise HTTPException(status_code=503, detail="Summarization service is not available.")
        
    response = await get_summary_response(request.text)
    return response
