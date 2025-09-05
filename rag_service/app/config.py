import os
from dotenv import load_dotenv
import google.generativeai as genai
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("❌ GOOGLE_API_KEY not found in .env file.")

# Configure the GenAI client
genai.configure(api_key=GOOGLE_API_KEY)
print("✅ Gemini API Key configured successfully.")

RAG_INDEX_PATH = "./faiss_index"
RAG_DOCS_PATH = "./rag_docs"    
RAG_EMBEDDING_MODEL = "models/embedding-001"
RAG_LLM_MODEL = "gemini-2.0-flash"
CHUNK_SIZE=1000
CHUNK_OVERLAP=100
VECTOR_STORE_PATH = "./faiss_index"
SUMMARIZE_LLM_MODEL = "gemini-2.0-flash"
SUMMARIZE_CHUNK_SIZE = 1000
SUMMARIZE_CHUNK_OVERLAP = 100
