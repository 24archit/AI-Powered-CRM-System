import os
from huggingface_hub import AsyncInferenceClient
from core import config
from core.globals import ml_models
from engine.vector_store import CRMVectorStore

def load_rag_models():
    """
    Initializes Qdrant vector store and the Hugging Face Inference client.
    """
    if not config.HF_TOKEN:
        print("⚠️ HF_TOKEN not set. RAG models will not be loaded.")
        return

    if not config.QDRANT_URL or not config.QDRANT_API_KEY:
        print("⚠️ QDRANT_URL or QDRANT_API_KEY not set. RAG models will not be loaded.")
        return

    try:
        store = CRMVectorStore()
        ml_models["vector_store"] = store
        print("✅ Qdrant vector store loaded.")
    except Exception as e:
        print(f"❌ Failed to initialize Qdrant vector store: {e}")
        return
    
    # Initialize the Serverless Inference API client
    try:
        client = AsyncInferenceClient(model=config.RAG_LLM_MODEL, token=config.HF_TOKEN)
        ml_models["llm_client"] = client
        print(f"✅ Hugging Face Inference Client created for {config.RAG_LLM_MODEL}")
    except Exception as e:
        print(f"❌ Failed to initialize HF Client: {e}")

async def get_rag_response(question: str):
    store: CRMVectorStore = ml_models.get("vector_store")
    client: AsyncInferenceClient = ml_models.get("llm_client")
    
    if not store or not client:
        raise RuntimeError("RAG models not loaded.")
    
    # Retrieve top 5 contexts
    hits = store.search(question, top_k=5)
    
    if hits:
        best_score = hits[0]["score"]
        confidence = round(best_score, 2)
        
        # Combine retrieved text
        context_text = "\n\n".join([hit["payload"].get("text", "") for hit in hits])
    else:
        confidence = 0.0
        context_text = "No relevant context found."

    # Construct the prompt for Llama 3
    system_prompt = "You are a helpful AI assistant. Answer the user's question based strictly on the provided context."
    user_prompt = f"""
<context>
{context_text}
</context>

Question: {question}

If the answer is not in the context, just say, "I am sorry, but I cannot find the answer in the provided documents."
Answer:
"""
    
    # Format messages for the Inference API Chat Completion
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    try:
        # Call the HF Inference API asynchronously
        response = await client.chat_completion(
            messages=messages,
            max_tokens=512,
            temperature=0.3
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        answer = f"Error generating response from LLM API: {str(e)}"

    return {"answer": answer, "confidence_score": confidence}

async def get_summary_response(text: str):
    """
    Generates a summary for the given text using the HF Inference API.
    """
    client: AsyncInferenceClient = ml_models.get("llm_client")
    if not client:
        raise RuntimeError("LLM Client not loaded.")
    
    system_prompt = "You are an expert at summarizing text concisely."
    user_prompt = f"Please summarize the following text:\n\n{text}\n\nSummary:"
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    try:
        response = await client.chat_completion(
            messages=messages,
            max_tokens=512,
            temperature=0.2
        )
        summary = response.choices[0].message.content.strip()
    except Exception as e:
        summary = f"Could not generate summary due to API error: {str(e)}"
        
    return {"summary": summary}
