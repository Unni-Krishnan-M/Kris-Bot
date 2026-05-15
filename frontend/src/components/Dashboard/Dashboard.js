import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import ModeSelector from './ModeSelector';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentMode, setCurrentMode] = useState('text');
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await axios.get('/api/chat');
      setChats(response.data);
      if (response.data.length > 0 && !currentChat) {
        setCurrentChat(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post('/api/chat', {
        title: `New ${currentMode} Chat`
      });
      const newChat = response.data;
      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const selectChat = async (chatId) => {
    try {
      const response = await axios.get(`/api/chat/${chatId}`);
      setCurrentChat(response.data);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`/api/chat/${chatId}`);
      setChats(chats.filter(chat => chat._id !== chatId));
      if (currentChat?._id === chatId) {
        setCurrentChat(chats.length > 1 ? chats[0] : null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        user={user}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Kris Bot
            </h1>
            <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />
          </div>
        </div>

        {/* Chat Area */}
        <ChatArea
          currentChat={currentChat}
          currentMode={currentMode}
          loading={loading}
          setLoading={setLoading}
          onChatUpdate={loadChats}
        />
      </div>
    </div>
  );
};

export default Dashboard;