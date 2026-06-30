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
        return await analyze_text(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- RAG Routes ---
@router.post("/ask-rag", response_model=RAGResponse, tags=["RAG"])
async def ask_rag_endpoint(request: RAGRequest):
    if "vector_store" not in ml_models or "llm_client" not in ml_models:
        raise HTTPException(status_code=503, detail="RAG service is not available. Please check if Qdrant is loaded.")
    
    response = await get_rag_response(request.question)
    return response

@router.post("/summarize", response_model=SummarizeResponse, tags=["Summarization"])
async def summarize_endpoint(request: SummarizeRequest):
    if "llm_client" not in ml_models:
        raise HTTPException(status_code=503, detail="Summarization service is not available.")
        
    response = await get_summary_response(request.text)
    return response

from engine.translation_engine import translate_to_english
from engine.vision_engine import calculate_fraud_risk
from engine.similarity_engine import check_duplicate
from schemas import (
    TranslateRequest, TranslateResponse,
    VisionRequest, VisionResponse,
    DuplicateRequest, DuplicateResponse
)

# --- Multilingual Route ---
@router.post("/translate", response_model=TranslateResponse, tags=["Multilingual"])
async def translate_endpoint(request: TranslateRequest):
    translated = await translate_to_english(request.text)
    return {"translated_text": translated}

# --- Vision Route ---
@router.post("/vision-fraud", response_model=VisionResponse, tags=["Vision"])
async def vision_fraud_endpoint(request: VisionRequest):
    risk = await calculate_fraud_risk(request.uploaded_image_b64, request.product_image_b64)
    return {"fraud_risk": risk}

# --- Duplicate Check Route ---
@router.post("/duplicate-check", response_model=DuplicateResponse, tags=["Similarity"])
async def duplicate_check_endpoint(request: DuplicateRequest):
    result = await check_duplicate(request.current_text, request.open_tickets_texts)
    return result
