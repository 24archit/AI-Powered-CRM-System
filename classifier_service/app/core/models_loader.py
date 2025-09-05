
from transformers import BertTokenizer, TFBertForSequenceClassification

from .. import config

ml_models = {}


def load_models():
    """
    Loads all AI models (classifiers and RAG) into the global ml_models dictionary.
    """
    print("--- Loading AI Models ---")
    
    # Load Sentiment Model
    try:
        ml_models["sentiment_model"] = TFBertForSequenceClassification.from_pretrained(config.SENTIMENT_MODEL_PATH)
        ml_models["sentiment_tokenizer"] = BertTokenizer.from_pretrained(config.SENTIMENT_MODEL_PATH)
        print("✅ Sentiment model loaded")
    except Exception as e:
        print(f"❌ Sentiment model load failed: {e}")

    # Load Ticket Classifier Model
    try:
        ml_models["ticket_model"] = TFBertForSequenceClassification.from_pretrained(config.TICKET_MODEL_PATH)
        ml_models["ticket_tokenizer"] = BertTokenizer.from_pretrained("bert-base-uncased")
        print("✅ Ticket model loaded")
    except Exception as e:
        print(f"❌ Ticket model load failed: {e}")


def clear_models():
    """
    Clears all models from the ml_models dictionary to free up memory.
    """
    ml_models.clear()
    print("🧹 Cleared models from memory.")

