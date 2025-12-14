from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Conversation(Document):
    user_id: ObjectId
    title: Optional[str] = None
    messages: List[Message] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    class Settings:
        name = "conversations"

# Pydantic models for API
class ConversationResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    title: Optional[str]
    messages: List[Message]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        populate_by_name = True

class ConversationCreate(BaseModel):
    title: Optional[str] = None
    messages: List[Message] = []