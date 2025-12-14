import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from dotenv import load_dotenv

load_dotenv()

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "kris_bot")

# Global variables
mongodb_client: AsyncIOMotorClient = None
database = None

async def connect_to_mongo():
    """Create database connection"""
    global mongodb_client, database
    mongodb_client = AsyncIOMotorClient(MONGODB_URL)
    database = mongodb_client[DATABASE_NAME]
    
    # Initialize beanie with all models
    from models.user import User
    from models.conversation import Conversation
    await init_beanie(database=database, document_models=[User, Conversation])
    
    print(f"Connected to MongoDB at {MONGODB_URL}")

async def close_mongo_connection():
    """Close database connection"""
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()
        print("Disconnected from MongoDB")

def get_database():
    """Get database instance"""
    return database

# For compatibility with existing code
async def get_db():
    """Async generator for database dependency"""
    yield database