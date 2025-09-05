from app.core.inference import predict_sentiment, predict_ticket
from app.schemas.analysis import SentimentPrediction, TicketPrediction, AnalysisResponse

def analyze_text(text: str) -> AnalysisResponse:
    sentiment, s_conf = predict_sentiment(text)
    ticket, t_conf = predict_ticket(text)

    return AnalysisResponse(
        sentiment=SentimentPrediction(prediction=sentiment, confidence=s_conf),
        ticket_category=TicketPrediction(prediction=ticket, confidence=t_conf)
    )
# async def query_rag_engine(question: str, vector_store, document_chain):
#     """
#     Queries the RAG engine using older, compatible LangChain syntax.
#     """
#     # 1. Retrieve documents with their relevance scores
#     retrieved_docs_with_scores = await vector_store.asimilarity_search_with_relevance_scores(question)

#     if not retrieved_docs_with_scores:
#         return "I could not find relevant information in the knowledge base.", 0.0

#     # 2. Extract the confidence score from the most relevant document
#     confidence_score = retrieved_docs_with_scores[0][1]
    
#     # 3. Get just the documents to pass to the chain
#     retrieved_docs = [doc for doc, score in retrieved_docs_with_scores]

#     # 4. Use .acall() to invoke the older chain with a dictionary input
#     response_dict = await document_chain.acall({
#         "input_documents": retrieved_docs,
#         "question": question
#     })
    
#     # 5. The answer is inside the 'output_text' key in the response dictionary
#     answer = response_dict.get('output_text', "Could not generate an answer.")
    
#     return answer, confidence_score
