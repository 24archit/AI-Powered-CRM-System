from engine.rag_engine import get_rag_response as engine_get_rag_response, get_summary_response as engine_get_summary_response

async def get_rag_response(question: str):
    return await engine_get_rag_response(question)

async def get_summary_response(text: str):
    return await engine_get_summary_response(text)
