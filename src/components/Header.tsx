import React from 'react';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSettingsClick: () => void;
  children?: React.ReactNode;
}

export function Header({ title, onSettingsClick, children }: HeaderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-blue-400">Cycle</h1>
            <div className="w-px h-6 bg-gray-600"></div>
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>
          {/* Settings button - always visible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="text-gray-400 hover:text-white hover:bg-gray-800 ml-4"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        {children}
      </div>
      <div className="h-px bg-gray-700 mb-6"></div>
    </div>
  );
}