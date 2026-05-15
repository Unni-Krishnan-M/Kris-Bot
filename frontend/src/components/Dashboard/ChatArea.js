import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, Image, Video, Presentation, FileText, Search, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ChatArea = ({ currentChat, currentMode, loading, setLoading, onChatUpdate }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages || []);
    }
  }, [currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading || !currentChat) return;

    const userMessage = {
      role: 'user',
      content: message,
      type: currentMode,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      // Add user message to chat
      await axios.post(`/api/chat/${currentChat._id}/messages`, userMessage);

      let response;
      let assistantMessage;

      switch (currentMode) {
        case 'text':
          response = await axios.post('/api/generate/text', {
            prompt: message,
            context: messages.slice(-5) // Last 5 messages for context
          });
          assistantMessage = {
            role: 'assistant',
            content: response.data.content,
            type: 'text',
            timestamp: new Date()
          };
          break;

        case 'image':
          response = await axios.post('/api/generate/image', {
            prompt: message,
            style: 'realistic'
          });
          assistantMessage = {
            role: 'assistant',
            content: `Generated image: ${response.data.title}`,
            type: 'image',
            timestamp: new Date(),
            metadata: {
              imageUrl: response.data.imageUrl,
              prompt: response.data.prompt,
              style: response.data.style
            }
          };
          break;

        case 'video':
          response = await axios.post('/api/generate/video', {
            prompt: message,
            style: 'cinematic',
            duration: '5s'
          });
          assistantMessage = {
            role: 'assistant',
            content: `Generated video: ${response.data.title}`,
            type: 'video',
            timestamp: new Date(),
            metadata: {
              videoUrl: response.data.videoUrl,
              prompt: response.data.prompt,
              style: response.data.style,
              duration: response.data.duration
            }
          };
          break;

        case 'ppt':
          response = await axios.post('/api/generate/ppt', {
            content: message,
            title: 'Generated Presentation'
          });
          assistantMessage = {
            role: 'assistant',
            content: `Generated PPT: ${response.data.title}`,
            type: 'ppt',
            timestamp: new Date(),
            metadata: {
              pptUrl: response.data.pptUrl,
              filename: response.data.filename,
              title: response.data.title
            }
          };
          break;

        case 'resume':
          // Parse resume data from message
          const resumeData = parseResumeInput(message);
          response = await axios.post('/api/generate/resume', resumeData);
          assistantMessage = {
            role: 'assistant',
            content: `Generated Resume: ${response.data.title}`,
            type: 'resume',
            timestamp: new Date(),
            metadata: {
              resumeUrl: response.data.resumeUrl,
              filename: response.data.filename,
              title: response.data.title
            }
          };
          break;

        case 'resume-analyze':
          response = await axios.post('/api/generate/resume-analyze', {
            resumeText: message,
            jobDescription: ''
          });
          assistantMessage = {
            role: 'assistant',
            content: `Resume Analysis: ${response.data.title}`,
            type: 'resume-analyze',
            timestamp: new Date(),
            metadata: {
              analysis: response.data.analysis
            }
          };
          break;

        default:
          throw new Error('Invalid mode');
      }

      setMessages(prev => [...prev, assistantMessage]);
      
      // Add assistant message to chat
      await axios.post(`/api/chat/${currentChat._id}/messages`, assistantMessage);
      
      onChatUpdate();
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'text',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (currentMode) {
      case 'text':
        return 'Type your message...';
      case 'image':
        return 'Describe the image you want to generate...';
      case 'video':
        return 'Describe the video you want to create...';
      case 'ppt':
        return 'Enter content for your PowerPoint presentation...';
      case 'resume':
        return 'Enter your resume details (Name, Experience, Skills, etc.)...';
      case 'resume-analyze':
        return 'Paste your resume text here for analysis...';
      default:
        return 'Type your message...';
    }
  };

  // Helper function to parse resume input
  const parseResumeInput = (input) => {
    const lines = input.split('\n');
    const resumeData = {
      personalInfo: {},
      experience: [],
      education: [],
      skills: []
    };

    let currentSection = 'personal';
    let currentExp = {};

    lines.forEach(line => {
      const lowerLine = line.toLowerCase().trim();
      
      if (lowerLine.includes('name:')) {
        resumeData.personalInfo.name = line.split(':')[1]?.trim();
      } else if (lowerLine.includes('email:')) {
        resumeData.personalInfo.email = line.split(':')[1]?.trim();
      } else if (lowerLine.includes('phone:')) {
        resumeData.personalInfo.phone = line.split(':')[1]?.trim();
      } else if (lowerLine.includes('summary:')) {
        resumeData.personalInfo.summary = line.split(':')[1]?.trim();
      } else if (lowerLine.includes('skills:')) {
        const skillsText = line.split(':')[1]?.trim();
        resumeData.skills = skillsText ? skillsText.split(',').map(s => s.trim()) : [];
      } else if (lowerLine.includes('experience:') || lowerLine.includes('work:')) {
        currentSection = 'experience';
      } else if (currentSection === 'experience' && line.trim()) {
        if (lowerLine.includes('position:') || lowerLine.includes('title:')) {
          if (currentExp.position) {
            resumeData.experience.push(currentExp);
            currentExp = {};
          }
          currentExp.position = line.split(':')[1]?.trim();
        } else if (lowerLine.includes('company:')) {
          currentExp.company = line.split(':')[1]?.trim();
        } else if (lowerLine.includes('duration:') || lowerLine.includes('period:')) {
          currentExp.duration = line.split(':')[1]?.trim();
        } else if (lowerLine.includes('description:')) {
          currentExp.description = line.split(':')[1]?.trim();
        }
      }
    });

    if (currentExp.position) {
      resumeData.experience.push(currentExp);
    }

    return resumeData;
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    
    return (
      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-600' : 'bg-gray-600'
            }`}>
              {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-lg ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}>
            <p className="text-sm">{msg.content}</p>
            
            {/* Render media content */}
            {msg.type === 'image' && msg.metadata?.imageUrl && (
              <div className="mt-2">
                <img 
                  src={msg.metadata.imageUrl} 
                  alt="Generated" 
                  className="max-w-full h-auto rounded-md"
                />
                <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                  <span>Style: {msg.metadata.style}</span>
                  <Image size={12} />
                </div>
              </div>
            )}
            
            {msg.type === 'video' && msg.metadata?.videoUrl && (
              <div className="mt-2">
                <video 
                  src={msg.metadata.videoUrl} 
                  controls 
                  className="max-w-full h-auto rounded-md"
                />
                <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                  <span>Duration: {msg.metadata.duration}</span>
                  <Video size={12} />
                </div>
              </div>
            )}
            
            {msg.type === 'ppt' && msg.metadata?.pptUrl && (
              <div className="mt-2">
                <a 
                  href={msg.metadata.pptUrl}
                  download={msg.metadata.filename}
                  className="flex items-center space-x-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors"
                >
                  <Presentation size={12} />
                  <span>Download PPT</span>
                  <Download size={12} />
                </a>
              </div>
            )}

            {msg.type === 'resume' && msg.metadata?.resumeUrl && (
              <div className="mt-2">
                <a 
                  href={msg.metadata.resumeUrl}
                  download={msg.metadata.filename}
                  className="flex items-center space-x-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30 transition-colors"
                >
                  <FileText size={12} />
                  <span>Download Resume</span>
                  <Download size={12} />
                </a>
              </div>
            )}

            {msg.type === 'resume-analyze' && msg.metadata?.analysis && (
              <div className="mt-2 space-y-2">
                <div className="bg-white bg-opacity-10 p-3 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs font-semibold">Analysis Results</span>
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div><strong>Score:</strong> {msg.metadata.analysis.score}/100</div>
                    <div><strong>Name:</strong> {msg.metadata.analysis.personalInfo?.name}</div>
                    <div><strong>Skills Found:</strong> {msg.metadata.analysis.skills?.slice(0, 3).join(', ')}</div>
                  </div>
                  
                  {msg.metadata.analysis.recommendations && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold mb-1">Recommendations:</div>
                      <ul className="text-xs space-y-1">
                        {msg.metadata.analysis.recommendations.slice(0, 3).map((rec, idx) => (
                          <li key={idx} className="flex items-start space-x-1">
                            <span>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="text-xs opacity-50 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Welcome to Kris Bot
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Hello, I'm Kris Bot. I can help you chat, generate images, create videos, build presentations, 
            create professional resumes, and analyze existing resumes. Tell me what you'd like to build today.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {messages.map((msg, index) => renderMessage(msg, index))}
        
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;