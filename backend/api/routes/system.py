from fastapi import APIRouter, status
from backend.core.config import settings
from backend.services.data_loader import data_loader_service
from backend.schemas.data_models import DatasetStats

router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint to verify system viability and data loading state."""
    stats = data_loader_service.get_stats()
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "data_loaded": stats.num_msmes > 0,
        "kpis": stats
    }

@router.get("/version")
async def get_version():
    """Returns the current application version details."""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": "production-mvp"
    }

@router.get("/stats", response_model=DatasetStats)
async def get_dataset_stats():
    """Returns general count statistics of loaded dataset entities."""
    return data_loader_service.get_stats()
