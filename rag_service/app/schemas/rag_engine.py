from pydantic import BaseModel
from typing import Optional

class RAGRequest(BaseModel):
    question: str

class RAGResponse(BaseModel):
    answer: str
    confidence_score: Optional[float] = None


class SummarizeRequest(BaseModel):
    text: str

class SummarizeResponse(BaseModel):
    summary: str

