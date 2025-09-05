import numpy as np
import tensorflow as tf
from app.core.models_loader import ml_models
from app import config

def predict_sentiment(text: str):
    model = ml_models.get("sentiment_model")
    tokenizer = ml_models.get("sentiment_tokenizer")
    inputs = tokenizer(text, return_tensors="tf", truncation=True, padding=True, max_length=128)
    logits = model(inputs).logits
    probs = tf.nn.softmax(logits, axis=1).numpy()[0]
    idx = np.argmax(probs)
    return config.SENTIMENT_CLASSES[idx], float(probs[idx])

def predict_ticket(text: str):
    model = ml_models.get("ticket_model")
    tokenizer = ml_models.get("ticket_tokenizer")
    inputs = tokenizer(text, return_tensors="tf", truncation=True, padding=True, max_length=128)
    logits = model(inputs).logits
    probs = tf.nn.softmax(logits, axis=1).numpy()[0]
    idx = np.argmax(probs)
    return config.TICKET_CLASSES[idx], float(probs[idx])
