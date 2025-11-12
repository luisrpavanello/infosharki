import React from 'react';
import { MapPin, Mail, Clock, Phone } from 'lucide-react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onQuickAction }) => {
  const actions = [
    { id: 'aulas', label: 'Buscar Aulas', icon: MapPin, color: 'bg-blue-500' },
    { id: 'correos', label: 'Correos de Profesores', icon: Mail, color: 'bg-green-500' },
    { id: 'horarios', label: 'Ver Horarios', icon: Clock, color: 'bg-orange-500' },
    { id: 'contactos', label: 'Información de Contacto', icon: Phone, color: 'bg-purple-500' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => onQuickAction(action.id)}
            className={`${action.color} text-white p-3 rounded-xl flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium text-center">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};