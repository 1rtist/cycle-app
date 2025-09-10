import React from 'react';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Building, 
  MapPin, 
  BarChart3,
  Settings
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'storage', label: 'Storage Units', icon: Building },
    { id: 'flea', label: 'Flea Market', icon: MapPin },
  ];

  const settingsTab = { id: 'settings', label: 'Settings', icon: Settings };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40">
        <div className="p-6">
          <h1 className="text-white text-xl font-semibold mb-8">Cycle</h1>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left ${
                    activeTab === tab.id 
                      ? "bg-gray-700 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </Button>
              );
            })}
            
            {/* Settings Button */}
            <div className="pt-4 border-t border-gray-700 mt-4">
              <Button
                variant={activeTab === 'settings' ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${
                  activeTab === 'settings' 
                    ? "bg-gray-700 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => onTabChange('settings')}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
            </div>
          </nav>

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex items-center justify-around py-3 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const shortLabel = tab.id === 'storage' ? 'Storage' : 
                              tab.id === 'flea' ? 'Flea' : 
                              tab.id === 'analytics' ? 'Analytics' :
                              tab.label;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center py-3 px-2 ${
                  activeTab === tab.id 
                    ? "text-blue-400" 
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{shortLabel}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}