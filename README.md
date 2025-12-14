# Kris Bot

A full-stack AI-powered chatbot application built with FastAPI (Python) backend and Next.js (TypeScript) frontend.

## Features

- 🤖 AI-powered chat interface
- 🔐 User authentication (register/login)
- 📁 File upload functionality
- 💬 Real-time chat interface
- 🎨 Modern UI with Tailwind CSS
- 🔒 JWT-based authentication
- 📊 SQLite database (easily configurable for PostgreSQL)

## Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- MongoDB 4.4 or higher (running on localhost:27017)

### Installation

1. **Clone and setup the project:**
   ```bash
   git clone <your-repo-url>
   cd kris-bot
   ```

2. **Run the setup script:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Configure environment variables:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your API keys and settings
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

### Manual Setup

If you prefer manual setup:

1. **Backend setup:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env file
   python main.py
   ```

2. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=kris_bot

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI API Keys (optional)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Server
PORT=8000
DEBUG=True
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/token` - Login and get access token
- `GET /api/auth/me` - Get current user info

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history/{id}` - Delete conversation

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/list` - List user files
- `DELETE /api/files/{filename}` - Delete file

## Project Structure

```
kris-bot/
├── backend/
│   ├── auth/
│   ├── models/
│   ├── routers/
│   ├── services/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   └── package.json
├── package.json
└── README.md
```

## Development

- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:3000
- API documentation available at http://localhost:8000/docs

## Troubleshooting

1. **Python virtual environment issues:**
   ```bash
   cd backend
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Node.js dependency issues:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **MongoDB connection issues:**
   ```bash
   # Make sure MongoDB is running
   sudo systemctl start mongod
   # Or on macOS with Homebrew
   brew services start mongodb-community
   
   # Check if MongoDB is accessible
   mongosh --eval "db.adminCommand('ismaster')"
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details