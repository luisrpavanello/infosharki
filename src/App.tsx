import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickActions } from './components/QuickActions';
import { MenuButton } from './components/MenuButton';
import { SharkIcon } from './components/SharkIcon';
import { useChat } from './hooks/useChat';
import { GraduationCap, Sparkles } from 'lucide-react';

function App() {
  const { messages, sendMessage, handleQuickAction, resetChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Info Sharki
              </h1>
              <p className="text-sm text-gray-600">InfoSharki el Búscador Inteligente de la Universidad del Pacífico</p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              {messages.length > 1 && (
                <MenuButton onResetChat={resetChat} />
              )}
              <div className="flex items-center gap-2 text-blue-600">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Prototipo MVP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Desarrollado para el Concurso Universitario
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              ¡Bienvenido a Info Sharki!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Tu asistente inteligente para encontrar información de la Universidad del Pacífico
            </p>
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="max-w-md mx-auto">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Acciones Rápidas</h3>
              <QuickActions onQuickAction={handleQuickAction} />
            </div>
          )}

          {/* Chat Messages */}
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-2xl mx-auto">
            <ChatInput onSendMessage={sendMessage} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span>© 2025 Universidad del Pacífico</span>
            <span>•</span>
            <a href="https://upacifico.edu.py" target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:text-blue-700 transition-colors">
              upacifico.edu.py
            </a>
            <span>•</span>
            <span>Prototipo para Concurso</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;