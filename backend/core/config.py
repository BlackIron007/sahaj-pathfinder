import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sahaj PathFinder"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    
    # Path settings
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    ROOT_DIR: Path = BASE_DIR.parent
    SAMPLE_DATA_DIR: Path = ROOT_DIR / "sample_data"
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4000",
        "http://127.0.0.1:4000",
    ]
    
    # Future AI configuration properties
    OPENAI_API_KEY: Optional[str] = None
    MODEL_NAME: Optional[str] = None
    BACKEND_URL: Optional[str] = "http://localhost:8000"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
