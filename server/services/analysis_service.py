from engine.classifier_engine import predict_sentiment, predict_ticket
from schemas import SentimentPrediction, TicketPrediction, AnalysisResponse

async def analyze_text(text: str) -> AnalysisResponse:
    sentiment, s_conf = await predict_sentiment(text)
    ticket, t_conf = await predict_ticket(text)

    return AnalysisResponse(
        sentiment=SentimentPrediction(prediction=sentiment, confidence=s_conf),
        ticket_category=TicketPrediction(prediction=ticket, confidence=t_conf)
    )
