import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { SearchService } from '../services/searchService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! Soy Info Sharki, tu asistente inteligente de la Universidad del Pacífico. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);

  const sendMessage = useCallback((content: string) => {
    // Mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    // Respuesta del bot
    const botResponse = SearchService.processQuery(content);
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
  }, []);

  const handleQuickAction = useCallback((actionId: string) => {
    // Mensaje del usuario para la acción rápida
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: getActionLabel(actionId),
      timestamp: new Date(),
    };

    // Respuesta del bot usando el nuevo método
    const botResponse = SearchService.processQuickAction(actionId);
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: '¡Hola! Soy Info Sharki, tu asistente inteligente de la Universidad del Pacífico. ¿En qué puedo ayudarte hoy?',
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

// Función auxiliar para obtener etiquetas de acciones
function getActionLabel(actionId: string): string {
  const actions: { [key: string]: string } = {
    'aulas': 'Mostrar todas las aulas disponibles',
    'correos': 'Mostrar correos de profesores',
    'horarios': 'Mostrar horarios de clases',
    'contactos': 'Mostrar información de contacto'
  };
  return actions[actionId] || actionId;
}