from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.api import api_router
from backend.app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Type"],
)

app.include_router(api_router, prefix=settings.API_V1_STR) 