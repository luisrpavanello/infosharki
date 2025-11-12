import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { SearchService } from '../services/searchService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! Soy el bot de búsqueda de la Universidad del Pacífico 🎓\n\n¿En qué puedo ayudarte hoy? Puedo encontrar información sobre:\n• Ubicación de aulas\n• Correos de profesores\n• Horarios de clases\n• Contactos de diferentes áreas',
      timestamp: new Date()
    }
  ]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: '¡Hola! Soy el bot de búsqueda de la Universidad del Pacífico 🎓\n\n¿En qué puedo ayudarte hoy? Puedo encontrar información sobre:\n• Ubicación de aulas\n• Correos de profesores\n• Horarios de clases\n• Contactos de diferentes áreas',
        timestamp: new Date()
      }
    ]);
  }, []);
  const addMessage = useCallback((content: string, type: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback((content: string) => {
    // Agregar mensaje del usuario
    addMessage(content, 'user');

    // Simular tiempo de procesamiento
    setTimeout(() => {
      const response = SearchService.processQuery(content);
      addMessage(response, 'bot');
    }, 500);
  }, [addMessage]);

  const handleQuickAction = useCallback((action: string) => {
    let query = '';
    switch (action) {
      case 'aulas':
        query = 'Mostrar todas las aulas disponibles';
        break;
      case 'correos':
        query = 'Mostrar correos de profesores';
        break;
      case 'horarios':
        query = 'Mostrar horarios de clases';
        break;
      case 'contactos':
        query = 'Mostrar información de contacto';
        break;
    }
    sendMessage(query);
  }, [sendMessage]);

  return {
    messages,
    sendMessage,
    handleQuickAction,
    resetChat
  };
};