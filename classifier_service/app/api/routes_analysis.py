from fastapi import APIRouter, HTTPException
from app.schemas.analysis import FeedbackRequest, AnalysisResponse
from app.services.analyzer_service import analyze_text
from app.core.models_loader import ml_models
router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_feedback(request: FeedbackRequest):
    try:
        return analyze_text(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))