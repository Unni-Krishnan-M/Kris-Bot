from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os

from models.user import User
from routers.auth import get_current_user
from services.ai_service import AIService

router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None

@router.post("/send", response_model=ChatResponse)
async def send_message(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        # Initialize AI service
        ai_service = AIService()
        
        # Prepare conversation context
        messages = []
        for msg in chat_request.conversation_history:
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user message
        messages.append({"role": "user", "content": chat_request.message})
        
        # Get AI response
        ai_response = await ai_service.get_response(messages)
        
        return ChatResponse(
            response=ai_response,
            conversation_id=f"conv_{str(current_user.id)}_{len(messages)}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@router.get("/history")
async def get_chat_history(
    current_user: User = Depends(get_current_user)
):
    # This would typically fetch from a database
    # For now, return empty history
    return {"conversations": []}

@router.delete("/history/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    # Implementation for deleting conversation history
    return {"message": "Conversation deleted successfully"}