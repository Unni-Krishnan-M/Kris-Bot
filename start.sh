#!/bin/bash

echo "🚀 Starting Kris Bot Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB:"
    echo "   sudo systemctl start mongod"
    echo "   or: brew services start mongodb-community"
    echo ""
fi

# Create virtual environment for backend if it doesn't exist
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment and install dependencies
echo "📦 Installing backend dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Test MongoDB connection
echo "🗄️ Testing MongoDB connection..."
python -c "
import asyncio
from services.database import connect_to_mongo, close_mongo_connection

async def test_connection():
    try:
        await connect_to_mongo()
        print('✅ MongoDB connection successful')
        await close_mongo_connection()
    except Exception as e:
        print(f'❌ MongoDB connection failed: {e}')
        print('Please make sure MongoDB is running on localhost:27017')

asyncio.run(test_connection())
"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
    echo "Please edit backend/.env with your API keys and database settings"
fi

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Edit backend/.env with your API keys"
echo "2. Run: npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"