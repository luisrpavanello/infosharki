import React from 'react';
import { MapPin, Mail, Clock, Phone } from 'lucide-react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  const actions = [
    { 
      id: 'aulas', 
      label: 'Buscar Aulas', 
      icon: MapPin, 
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.9) 100%)',
      glow: 'rgba(59, 130, 246, 0.4)',
      border: 'rgba(96, 165, 250, 0.3)'
    },
    { 
      id: 'correos', 
      label: 'Correos de Profesores', 
      icon: Mail, 
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.9) 100%)',
      glow: 'rgba(34, 197, 94, 0.4)',
      border: 'rgba(74, 222, 128, 0.3)'
    },
    { 
      id: 'horarios', 
      label: 'Ver Horarios', 
      icon: Clock, 
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.8) 0%, rgba(234, 88, 12, 0.9) 100%)',
      glow: 'rgba(249, 115, 22, 0.4)',
      border: 'rgba(251, 146, 60, 0.3)'
    },
    { 
      id: 'contactos', 
      label: 'Información de Contacto', 
      icon: Phone, 
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.9) 100%)',
      glow: 'rgba(168, 85, 247, 0.4)',
      border: 'rgba(192, 132, 252, 0.3)'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onQuickAction(action.id)}
            className="relative p-4 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl group overflow-hidden"
            style={{
              background: action.gradient,
              border: `1px solid ${action.border}`,
              backdropFilter: 'blur(16px)',
              boxShadow: `0 8px 32px ${action.glow}`
            }}
          >
            {/* Efeito de brilho interno */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)`
              }}
            />
            
            {/* Efeito de borda luminosa no hover */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)`
              }}
            />

            {/* Conteúdo */}
            <div className="relative z-10 flex flex-col items-center">
              <div 
                className="p-3 rounded-2xl mb-2 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-bold text-center text-white drop-shadow-lg">
                {action.label}
              </span>
            </div>

            {/* Partículas de brilho */}
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/60 blur-[1px] group-hover:animate-pulse" />
            <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-white/40 blur-[1px] group-hover:animate-pulse" />
          </button>
        );
      })}
    </div>
  );
};