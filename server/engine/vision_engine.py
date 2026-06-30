from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import io
import base64
from core.globals import ml_models
from core.logging_config import logger

def load_vision_models():
    try:
        model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        ml_models["clip_model"] = model
        ml_models["clip_processor"] = processor
        logger.info("✅ CLIP Vision model loaded.")
    except Exception as e:
        logger.error(f"❌ Failed to load CLIP model: {e}")

async def calculate_fraud_risk(uploaded_image_b64: str, product_image_b64: str) -> float:
    model = ml_models.get("clip_model")
    processor = ml_models.get("clip_processor")
    
    if not model or not processor:
        return 0.0

    try:
        # Decode base64 images
        uploaded_image = Image.open(io.BytesIO(base64.b64decode(uploaded_image_b64))).convert("RGB")
        product_image = Image.open(io.BytesIO(base64.b64decode(product_image_b64))).convert("RGB")

        # Process images
        inputs = processor(images=[uploaded_image, product_image], return_tensors="pt")
        
        # Get image embeddings
        with torch.no_grad():
            image_features = model.get_image_features(**inputs)
            
        # Normalize features
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
        
        # Calculate cosine similarity
        similarity = torch.nn.functional.cosine_similarity(image_features[0].unsqueeze(0), image_features[1].unsqueeze(0))
        similarity_score = similarity.item()
        
        # Fraud risk is inverse of similarity (0 similarity = 100% fraud risk)
        fraud_risk = max(0.0, 1.0 - similarity_score)
        return float(fraud_risk)
        
    except Exception as e:
        logger.error(f"Vision fraud calculation error: {e}")
        return 0.0
