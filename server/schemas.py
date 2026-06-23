from pydantic import BaseModel
from typing import Optional

# --- Classifier Schemas ---
class FeedbackRequest(BaseModel):
    text: str

class SentimentPrediction(BaseModel):
    prediction: str
    confidence: float

class TicketPrediction(BaseModel):
    prediction: str
    confidence: float

class AnalysisResponse(BaseModel):
    sentiment: SentimentPrediction
    ticket_category: TicketPrediction

# --- RAG Schemas ---
class RAGRequest(BaseModel):
    question: str

class RAGResponse(BaseModel):
    answer: str
    confidence_score: Optional[float] = None

class SummarizeRequest(BaseModel):
    text: str

class SummarizeResponse(BaseModel):
    summary: str
