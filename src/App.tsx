import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { StorageUnits } from './components/StorageUnits';
import { FleaTrips } from './components/FleaTrips';
import { Analytics } from './components/Analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'storage':
        return <StorageUnits />;
      case 'flea':
        return <FleaTrips />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
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
  );
}