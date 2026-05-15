import React from 'react';
import { MessageSquare, Image, Video, Presentation, User, Search } from 'lucide-react';

const ModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'text', label: 'Text', icon: MessageSquare },
    { id: 'image', label: 'Image', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'ppt', label: 'PPT', icon: Presentation },
    { id: 'resume', label: 'Resume', icon: User },
    { id: 'resume-analyze', label: 'Analyze', icon: Search }
  ];

  return (
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 overflow-x-auto">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
              currentMode === mode.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Icon size={14} />
            <span className="text-xs font-medium">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;