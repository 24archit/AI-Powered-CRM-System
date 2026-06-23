from engine.classifier_engine import predict_sentiment, predict_ticket
from schemas import SentimentPrediction, TicketPrediction, AnalysisResponse

def analyze_text(text: str) -> AnalysisResponse:
    sentiment, s_conf = predict_sentiment(text)
    ticket, t_conf = predict_ticket(text)

    return AnalysisResponse(
        sentiment=SentimentPrediction(prediction=sentiment, confidence=s_conf),
        ticket_category=TicketPrediction(prediction=ticket, confidence=t_conf)
    )
