import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- Classifier Config ---

SENTIMENT_CLASSES = ['Negative', 'Positive']
TICKET_CLASSES = [
    'Returns & Refunds', 'Delivery & Tracking', 'Billing & Payments',
    'Technical Support', 'Account Management', 'General Inquiry'
]

# --- RAG Config ---
HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    print("⚠️ HF_TOKEN not found in .env file. RAG functionality may fail.")

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
QDRANT_COLLECTION_NAME = "crm_rag_docs"

RAG_DOCS_PATH = os.path.join(BASE_DIR, "data", "knowledge_base")

RAG_EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"
RAG_RERANKER_MODEL = "BAAI/bge-reranker-base"
RAG_LLM_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct"
RAG_RETRIEVE_K = 15
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 100
