import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# 環境変数をロード
load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "LangChain POC"
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS設定
    BACKEND_CORS_ORIGINS: list[str] = ["*"]  # 本番環境では適切に設定すること

settings = Settings() 