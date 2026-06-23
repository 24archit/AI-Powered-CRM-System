import json
from huggingface_hub import AsyncInferenceClient
from core import config
from core.globals import ml_models



async def predict_sentiment(text: str):
    client: AsyncInferenceClient = ml_models.get("llm_client")
    if not client:
        raise RuntimeError("LLM Client not loaded.")
        
    system_prompt = f"You are a strict classifier. Classify the user's text into one of these sentiments: {config.SENTIMENT_CLASSES}. Return ONLY a JSON object with 'prediction' (string) and 'confidence' (float between 0.0 and 1.0). Do not include any other text."
    user_prompt = text
    
    try:
        response = await client.chat_completion(
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            max_tokens=50, temperature=0.1
        )
        content = response.choices[0].message.content.strip()
        # Clean potential markdown wrapping
        if content.startswith("```json"): content = content[7:]
        if content.endswith("```"): content = content[:-3]
        data = json.loads(content)
        return data.get("prediction", "Neutral"), float(data.get("confidence", 0.0))
    except Exception as e:
        print(f"Sentiment classification failed: {e}")
        return "Neutral", 0.0

async def predict_ticket(text: str):
    client: AsyncInferenceClient = ml_models.get("llm_client")
    if not client:
        raise RuntimeError("LLM Client not loaded.")
        
    system_prompt = f"You are a strict classifier. Classify the user's text into one of these ticket categories: {config.TICKET_CLASSES}. Return ONLY a JSON object with 'prediction' (string) and 'confidence' (float between 0.0 and 1.0). Do not include any other text."
    user_prompt = text
    
    try:
        response = await client.chat_completion(
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            max_tokens=50, temperature=0.1
        )
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"): content = content[7:]
        if content.endswith("```"): content = content[:-3]
        data = json.loads(content)
        return data.get("prediction", "General Inquiry"), float(data.get("confidence", 0.0))
    except Exception as e:
        print(f"Ticket classification failed: {e}")
        return "General Inquiry", 0.0
