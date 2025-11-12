import React from 'react';
import { Home } from 'lucide-react';

interface MenuButtonProps {
  onResetChat: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onResetChat }) => {
  return (
    <button
      onClick={onResetChat}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Home className="w-4 h-4" />
      <span className="text-sm font-medium">Menu Inicial</span>
    </button>
  );
};