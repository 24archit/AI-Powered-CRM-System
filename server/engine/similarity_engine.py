from sentence_transformers import SentenceTransformer, util
from core.globals import ml_models
from core.logging_config import logger

def load_similarity_models():
    try:
        model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        ml_models["sentence_transformer"] = model
        logger.info("✅ Sentence Transformer model loaded.")
    except Exception as e:
        logger.error(f"❌ Failed to load Sentence Transformer model: {e}")

async def check_duplicate(current_text: str, open_tickets_texts: list[str]) -> dict:
    model = ml_models.get("sentence_transformer")
    if not model or not open_tickets_texts:
        return {"is_duplicate": False, "max_similarity": 0.0}

    try:
        current_embedding = model.encode(current_text, convert_to_tensor=True)
        open_embeddings = model.encode(open_tickets_texts, convert_to_tensor=True)

        cosine_scores = util.cos_sim(current_embedding, open_embeddings)[0]
        max_score = float(cosine_scores.max().item())
        
        is_duplicate = max_score > 0.85 # threshold

        return {
            "is_duplicate": is_duplicate,
            "max_similarity": max_score
        }
    except Exception as e:
        logger.error(f"Duplicate check error: {e}")
        return {"is_duplicate": False, "max_similarity": 0.0}
