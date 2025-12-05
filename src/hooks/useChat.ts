import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { SearchService } from '../services/searchService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! Soy InfoSharki, tu asistente inteligente de la Universidad del Pacífico. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);

  // Inicializar o serviço de busca vetorial
  useState(() => {
    SearchService.initialize().catch(console.error);
  });

  const sendMessage = useCallback(async (content: string) => { // ← ADICIONAR async AQUI
    if (!content.trim()) return;

    // Mensagem do usuário
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // ADICIONAR await AQUI
      const response = await SearchService.processQuery(content.trim());

      // Mensagem do bot
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    const response = SearchService.processQuickAction(action);
    
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: '¡Hola! Soy InfoSharki, tu asistente inteligente de la Universidad del Pacífico. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    messages,
    sendMessage,
    handleQuickAction,
    resetChat,
  };
};