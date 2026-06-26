import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.core.config import settings
from backend.api.routes.system import router as system_router
from backend.api.routes.opportunities import router as opportunities_router
from backend.api.routes.offers import router as offers_router
from backend.api.routes.impact import router as impact_router
from backend.services.data_loader import data_loader_service

# Configure professional logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # App startup logic
    logger.info("Initializing Sahaj PathFinder Backend...")
    try:
        data_loader_service.load_all_data()
        logger.info("Bootstrap data ingestion complete.")
    except Exception as e:
        logger.critical(f"Failed to load bootstrap data: {e}", exc_info=True)
    yield
    # App teardown logic
    logger.info("Shutting down Sahaj PathFinder Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler for clean enterprise response format
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled system error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please contact the administrator."},
    )

# Include routers
app.include_router(system_router, prefix=settings.API_V1_STR, tags=["System"])
app.include_router(opportunities_router, prefix=settings.API_V1_STR, tags=["Opportunities"])
app.include_router(offers_router, prefix=settings.API_V1_STR, tags=["Offers"])
app.include_router(impact_router, prefix=settings.API_V1_STR, tags=["Impact"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
