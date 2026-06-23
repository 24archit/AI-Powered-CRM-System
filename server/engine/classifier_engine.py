import numpy as np
import tensorflow as tf
from core.globals import ml_models
from core import config
from transformers import BertTokenizer, TFBertForSequenceClassification

def load_classifier_models():
    """
    Loads all AI classifier models.
    """
    try:
        ml_models["sentiment_model"] = TFBertForSequenceClassification.from_pretrained(config.SENTIMENT_MODEL_PATH)
        ml_models["sentiment_tokenizer"] = BertTokenizer.from_pretrained(config.SENTIMENT_MODEL_PATH)
        print("✅ Sentiment model loaded")
    except Exception as e:
        print(f"❌ Sentiment model load failed: {e}")

    try:
        ml_models["ticket_model"] = TFBertForSequenceClassification.from_pretrained(config.TICKET_MODEL_PATH)
        ml_models["ticket_tokenizer"] = BertTokenizer.from_pretrained("bert-base-uncased")
        print("✅ Ticket model loaded")
    except Exception as e:
        print(f"❌ Ticket model load failed: {e}")

def predict_sentiment(text: str):
    model = ml_models.get("sentiment_model")
    tokenizer = ml_models.get("sentiment_tokenizer")
    if not model or not tokenizer:
        raise RuntimeError("Sentiment model not loaded.")
    inputs = tokenizer(text, return_tensors="tf", truncation=True, padding=True, max_length=128)
    logits = model(inputs).logits
    probs = tf.nn.softmax(logits, axis=1).numpy()[0]
    idx = np.argmax(probs)
    return config.SENTIMENT_CLASSES[idx], float(probs[idx])

def predict_ticket(text: str):
    model = ml_models.get("ticket_model")
    tokenizer = ml_models.get("ticket_tokenizer")
    if not model or not tokenizer:
        raise RuntimeError("Ticket model not loaded.")
    inputs = tokenizer(text, return_tensors="tf", truncation=True, padding=True, max_length=128)
    logits = model(inputs).logits
    probs = tf.nn.softmax(logits, axis=1).numpy()[0]
    idx = np.argmax(probs)
    return config.TICKET_CLASSES[idx], float(probs[idx])
