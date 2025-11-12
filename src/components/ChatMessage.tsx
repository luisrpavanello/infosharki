import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  
  return (
    <div className={`flex gap-3 mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
          <video 
            src="/sharki.mp4" 
            alt="Shark Bot"
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={(e) => {
              // Quando o vídeo terminar, mostra o primeiro frame (ou último frame)
              e.currentTarget.pause();
            }}
          />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isBot 
          ? 'bg-white border border-gray-200 text-gray-800' 
          : 'bg-blue-600 text-white'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
        <span className={`text-xs mt-1 block ${
          isBot ? 'text-gray-500' : 'text-blue-100'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};