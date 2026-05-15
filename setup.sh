#!/bin/bash

echo "🚀 Setting up Kris Bot - Multimodal AI Assistant"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p backend/uploads

# Create environment file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "⚙️ Creating environment file..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please update with your actual API keys"
fi

echo "✅ Setup complete!"
echo ""
echo "🔧 To start the application:"
echo "   npm run dev        # Start both frontend and backend"
echo "   npm run backend    # Start only backend"
echo "   npm run frontend   # Start only frontend"
echo ""
echo "📝 Make sure to:"
echo "   1. Start MongoDB: mongod"
echo "   2. Update backend/.env with your API keys"
echo "   3. Run: npm run dev"