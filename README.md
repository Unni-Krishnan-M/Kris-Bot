# Kris Bot - Multimodal AI Assistant

A professional multimodal AI assistant for smart conversations, stunning images, AI-generated videos, and PDF documents — all in one powerful platform.

## Project Structure

```
kris-bot/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth middleware
│   ├── uploads/            # Generated files
│   ├── package.json
│   └── index.js
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── App.js
│   ├── public/
│   └── package.json
└── package.json           # Root package.json
```

## Features

- **Text Chat**: ChatGPT-like conversations with AI
- **Image Generation**: Create stunning images with AI
- **Video Generation**: Generate AI videos and scenes
- **PPT Generation**: Create professional PowerPoint presentations ✨ NEW
- **Resume Creation**: Build professional resumes ✨ NEW
- **Resume Analysis**: Analyze resumes with AWS integration ✨ NEW
- **User Authentication**: Secure login and registration
- **Chat History**: Save and manage conversations
- **Dark/Light Mode**: Modern UI with theme support

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (localhost:27017)
- JWT Authentication
- PptxGenJS for PowerPoint generation
- Resume Analysis API integration

### Frontend
- React 18
- Tailwind CSS
- React Router
- Axios for API calls
- Lucide React icons

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd kris-bot
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Start MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

4. **Configure environment**
```bash
# Update backend/.env file with your API keys
```

5. **Start the application**
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Development Scripts

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend in development mode
npm run dev

# Start only backend
npm run backend

# Start only frontend
npm run frontend

# Build frontend for production
npm run build

# Start backend in production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Chat
- `GET /api/chat` - Get user's chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/:id` - Get specific chat
- `POST /api/chat/:id/messages` - Add message to chat
- `DELETE /api/chat/:id` - Delete chat

### Generation
- `POST /api/generate/text` - Generate text response
- `POST /api/generate/image` - Generate image
- `POST /api/generate/video` - Generate video
- `POST /api/generate/pdf` - Generate PDF
- `GET /api/generate/history` - Get generation history

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Chats Collection
```javascript
{
  userId: ObjectId,
  title: String,
  messages: [{
    role: 'user' | 'assistant',
    content: String,
    type: 'text' | 'image' | 'video' | 'pdf',
    timestamp: Date,
    metadata: Object
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### MediaGenerations Collection
```javascript
{
  userId: ObjectId,
  type: 'image' | 'video' | 'pdf',
  prompt: String,
  style: String,
  outputUrl: String,
  metadata: Object,
  createdAt: Date
}
```

## Configuration

### AI API Integration
Replace the mock functions in `backend/routes/generate.js` with actual AI service calls:

- **Text**: OpenAI GPT API
- **Image**: DALL-E, Midjourney, or Stability AI
- **Video**: Runway ML, Pika Labs, or similar
- **PDF**: Already implemented with PDFKit

### Environment Variables
Create `backend/.env` file:
```env
PORT=5000
JWT_SECRET=your-jwt-secret
MONGODB_URI=mongodb://localhost:27017/krisbot
OPENAI_API_KEY=your-openai-key
STABILITY_API_KEY=your-stability-key
RUNWAY_API_KEY=your-runway-key
```

## Usage

1. **Register/Login**: Create an account or login
2. **Select Mode**: Choose Text, Image, Video, or PDF mode
3. **Start Chatting**: Begin conversations or generate content
4. **View History**: Access previous chats and generations
5. **Download**: Save generated PDFs and media

## Welcome Message
"Hello, I'm Kris Bot. I can help you chat, generate images, and create AI videos. Tell me what you'd like to build today."

## License
MIT License