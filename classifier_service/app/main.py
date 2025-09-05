from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.models_loader import load_models, clear_models
from app.api import routes_analysis, routes_health

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_models()
    yield
    clear_models()

app = FastAPI(
    title="AI-Powered CRM Analytics API",
    description="API for analyzing customer feedback using sentiment and ticket models.",
    version="1.0.0",
    lifespan=lifespan
)

# Register routers
app.include_router(routes_analysis.router)
app.include_router(routes_health.router)



