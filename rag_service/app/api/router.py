from fastapi import APIRouter, HTTPException
from app.schemas.rag_engine import RAGRequest, RAGResponse, SummarizeRequest, SummarizeResponse
from app.services import get_rag_response, get_summary_response

# This is where we will store our loaded models/chains
ml_models = {}

router = APIRouter()

@router.post("/ask-rag", response_model=RAGResponse)
async def ask_rag_endpoint(request: RAGRequest):
    if "retriever" not in ml_models or "document_chain" not in ml_models:
        raise HTTPException(status_code=503, detail="RAG service is not available.")
    
    response = await get_rag_response(
        ml_models["retriever"],
        ml_models["document_chain"],
        request.question
    )
    return response

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_endpoint(request: SummarizeRequest):
    if "summarization_chain" not in ml_models:
        raise HTTPException(status_code=503, detail="Summarization service is not available.")
        
    response = await get_summary_response(
        ml_models["summarization_chain"],
        request.text
    )
    return response
