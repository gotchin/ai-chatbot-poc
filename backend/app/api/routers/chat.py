from fastapi import APIRouter, HTTPException
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from typing import Dict, Optional
import uuid

from backend.app.schemas.chat import ChatRequest, ChatResponse
from backend.app.core.config import settings

router = APIRouter()

# チャットセッションを保存するための辞書
chat_sessions: Dict[str, ConversationChain] = {}

# LLMの初期化
def get_llm():
    api_key = settings.OPENAI_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")
    
    return ChatOpenAI(
        openai_api_key=api_key,
        model_name="gpt-4o"
    )

# 有効なセッションIDかどうかチェック
def is_valid_session_id(session_id: Optional[str]) -> bool:
    if not session_id:
        return False
    if session_id == "":
        return False
    if session_id not in chat_sessions:
        return False
    return True

# 会話チェーンの作成
def create_conversation_chain(session_id: Optional[str] = None):
    # 既存のセッションがある場合
    if is_valid_session_id(session_id):
        return chat_sessions[session_id], session_id
    
    # 新しいセッションを作成
    new_session_id = str(uuid.uuid4())
    
    llm = get_llm()
    memory = ConversationBufferMemory()
    
    conversation = ConversationChain(
        llm=llm,
        memory=memory,
        verbose=False
    )
    
    chat_sessions[new_session_id] = conversation
    
    return conversation, new_session_id

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # セッションIDに基づいて会話チェーンを取得または作成
        conversation, session_id = create_conversation_chain(request.session_id)
        
        response = conversation.predict(input=request.message)
        
        # レスポンスを作成
        result = ChatResponse(
            response=response, 
            session_id=session_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 