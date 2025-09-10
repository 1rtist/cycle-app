import React, { useState } from 'react';
import { DataProvider } from './components/DataContext';
import { Login } from './components/Login';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { StorageUnits } from './components/StorageUnits';
import { FleaTrips } from './components/FleaTrips';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';

function AppContent() {
  const { user, isLoading } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onSettingsClick={handleSettingsClick} />;
      case 'inventory':
        return <Inventory onSettingsClick={handleSettingsClick} />;
      case 'storage':
        return <StorageUnits onSettingsClick={handleSettingsClick} />;
      case 'flea':
        return <FleaTrips onSettingsClick={handleSettingsClick} />;
      case 'analytics':
        return <Analytics onSettingsClick={handleSettingsClick} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onSettingsClick={handleSettingsClick} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Login />
    );
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-950">
        <Navigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {/* Main Content */}
        <div className="md:ml-64 min-h-screen">
          {renderActiveComponent()}
        </div>
      </div>
    </DataProvider>
  );
}

export default function App() {
  return <AppContent />;
}