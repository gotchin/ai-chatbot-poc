from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Optional
import os
import uuid
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# 環境変数をロード
load_dotenv()

app = FastAPI()

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切に設定すること
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Type"],
)

# チャットセッションを保存するための辞書
chat_sessions: Dict[str, ConversationChain] = {}

# リクエストとレスポンスのモデル
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = Field(default=None, description="チャットセッションID")

class ChatResponse(BaseModel):
    response: str
    session_id: str

# LLMの初期化
def get_llm():
    api_key = os.getenv("OPENAI_API_KEY")
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
        verbose=False  # verboseをFalseに変更
    )
    
    chat_sessions[new_session_id] = conversation
    
    return conversation, new_session_id

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # セッションIDに基づいて会話チェーンを取得または作成
        conversation, session_id = create_conversation_chain(request.session_id)
        
        # メッセージを処理
        response = conversation.predict(input=request.message)
        
        # シンプルなレスポンスを返す
        result = ChatResponse(response=response, session_id=session_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 