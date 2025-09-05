from pydantic import BaseModel

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
