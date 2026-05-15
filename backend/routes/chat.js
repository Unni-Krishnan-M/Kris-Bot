const express = require('express');
const Chat = require('../models/Chat');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all chats for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt messages');
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get specific chat
router.get('/:chatId', authenticateToken, async (req, res) => {
  try {
    const chat = await Chat.findOne({ 
      _id: req.params.chatId, 
      userId: req.userId 
    });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new chat
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, message } = req.body;
    
    const chat = new Chat({
      userId: req.userId,
      title: title || 'New Chat',
      messages: message ? [{
        role: 'user',
        content: message,
        type: 'text'
      }] : []
    });
    
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add message to chat
router.post('/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    const { role, content, type, metadata } = req.body;
    
    const chat = await Chat.findOne({ 
      _id: req.params.chatId, 
      userId: req.userId 
    });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    chat.messages.push({
      role,
      content,
      type: type || 'text',
      metadata
    });
    
    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete chat
router.delete('/:chatId', authenticateToken, async (req, res) => {
  try {
    await Chat.findOneAndDelete({ 
      _id: req.params.chatId, 
      userId: req.userId 
    });
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;