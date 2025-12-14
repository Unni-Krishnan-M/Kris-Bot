import os
from typing import List, Dict
import asyncio

class AIService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
    
    async def get_response(self, messages: List[Dict[str, str]]) -> str:
        """Get AI response from available service."""
        
        if self.openai_api_key:
            return await self._get_openai_response(messages)
        elif self.anthropic_api_key:
            return await self._get_anthropic_response(messages)
        else:
            # Fallback response when no API keys are configured
            return self._get_fallback_response(messages[-1]["content"])
    
    async def _get_openai_response(self, messages: List[Dict[str, str]]) -> str:
        """Get response from OpenAI GPT."""
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.openai_api_key)
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=1000,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error with OpenAI API: {str(e)}"
    
    async def _get_anthropic_response(self, messages: List[Dict[str, str]]) -> str:
        """Get response from Anthropic Claude."""
        # This would require the anthropic library
        # For now, return a placeholder
        return "Anthropic integration not yet implemented. Please configure OpenAI API key."
    
    def _get_fallback_response(self, user_message: str) -> str:
        """Provide a fallback response when no AI service is available."""
        responses = {
            "hello": "Hello! I'm Kris Bot. How can I help you today?",
            "hi": "Hi there! What can I do for you?",
            "help": "I'm here to help! You can ask me questions, have conversations, or upload files for analysis.",
            "how are you": "I'm doing well, thank you for asking! How are you?",
            "what can you do": "I can chat with you, help answer questions, and process uploaded files. However, I need API keys configured to provide AI-powered responses.",
        }
        
        user_lower = user_message.lower().strip()
        
        for key, response in responses.items():
            if key in user_lower:
                return response
        
        return f"I received your message: '{user_message}'. To provide intelligent responses, please configure OpenAI or Anthropic API keys in the environment variables."