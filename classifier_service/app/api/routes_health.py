from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health_check():
    return {"status": "AI CRM API is running"}
