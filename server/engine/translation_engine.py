from transformers import pipeline
from core.globals import ml_models
from core.logging_config import logger

def load_translation_models():
    try:
        # For prototype speed, using a small multilingual translation pipeline
        # Helsinki-NLP/opus-mt-mul-en translates from many to English
        translator_to_en = pipeline("translation", model="Helsinki-NLP/opus-mt-mul-en")
        ml_models["translator_to_en"] = translator_to_en
        logger.info("✅ Translation model (mul->en) loaded.")
    except Exception as e:
        logger.error(f"❌ Failed to load translation model: {e}")

async def translate_to_english(text: str) -> str:
    translator = ml_models.get("translator_to_en")
    if not translator:
        return text # fallback to original
    try:
        result = translator(text)
        return result[0]['translation_text']
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return text
