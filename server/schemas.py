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

# --- Translation Schemas ---
class TranslateRequest(BaseModel):
    text: str

class TranslateResponse(BaseModel):
    translated_text: str

# --- Vision Schemas ---
class VisionRequest(BaseModel):
    uploaded_image_b64: str
    product_image_b64: str

class VisionResponse(BaseModel):
    fraud_risk: float

# --- Similarity Schemas ---
class DuplicateRequest(BaseModel):
    current_text: str
    open_tickets_texts: list[str]

class DuplicateResponse(BaseModel):
    is_duplicate: bool
    max_similarity: float
