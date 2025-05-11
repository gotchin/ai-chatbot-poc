from pydantic import BaseModel, Field
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = Field(default=None, description="チャットセッションID")
    search_jira: bool = Field(default=False, description="JIRAイシューを検索するかどうか")

class ChatResponse(BaseModel):
    response: str
    session_id: str 