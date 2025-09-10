import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Settings as SettingsIcon, Link, LogOut, User, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Slot } from "@radix-ui/react-slot";

export function Settings() {
  const { user, logout } = useAuth();
  const [ebayApiKey, setEbayApiKey] = useState('');
  const [ebayConnected, setEbayConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('hourly');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleEbayConnect = () => {
    if (ebayApiKey.trim()) {
      setEbayConnected(true);
      // In a real app, this would validate the API key with eBay
    }
  };

  const handleEbayDisconnect = () => {
    setEbayConnected(false);
    setEbayApiKey('');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen text-white pb-20 md:pb-6">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-blue-400">Cycle</h1>
            <div className="w-px h-6 bg-gray-600"></div>
            <h2 className="text-2xl font-semibold">Settings</h2>
          </div>
        </div>
        <div className="h-px bg-gray-700 mb-6"></div>
      </div>

      {/* Account Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-300 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
            <div className="flex-1 mr-4">
              <div className="text-gray-200 font-medium">{user?.name}</div>
              <div className="text-gray-400 text-xs truncate">{user?.email}</div>
              {user?.isDemo && (
                <Badge variant="secondary" className="mt-1 bg-yellow-600 text-white">
                  Demo Mode
                </Badge>
              )}
            </div>
            <button
              onClick={handleLogout}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white flex-shrink-0"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </CardContent>
      </Card>

      {/* eBay Integration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-300 flex items-center">
            <Link className="w-5 h-5 mr-2" />
            eBay Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!ebayConnected ? (
            <>
              <Alert className="bg-blue-900/20 border-blue-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-blue-200">
                  Connect your eBay account to automatically import your listings, sales, and inventory data. 
                  This will sync all your eBay activity with Cycle for comprehensive tracking.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">eBay API Key</label>
                  <Input
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter your eBay API key"
                    value={ebayApiKey}
                    onChange={(e) => setEbayApiKey(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <div className="flex items-center mt-2">
                    <Switch
                      checked={showApiKey}
                      onCheckedChange={setShowApiKey}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-400">Show API key</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p className="mb-2">To get your eBay API key:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Visit the eBay Developers Program</li>
                    <li>Create or log into your developer account</li>
                    <li>Generate your production API keys</li>
                    <li>Copy your Client ID and paste it above</li>
                  </ol>
                </div>
                
                <button
                  onClick={handleEbayConnect}
                  disabled={!ebayApiKey.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Connect eBay Account
                </button>
              </div>
            </>
          ) : (
            <>
              <Alert className="bg-green-900/20 border-green-600">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-200">
                  eBay account successfully connected! Your listings and sales data will be automatically synced.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <div className="text-gray-200 font-medium">eBay Account Connected</div>
                    <div className="text-gray-400 text-sm">Last sync: 2 minutes ago</div>
                  </div>
                  <button
                    onClick={handleEbayDisconnect}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    Disconnect
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-200">Auto-sync enabled</div>
                      <div className="text-gray-400 text-sm">Automatically import new eBay data</div>
                    </div>
                    <Switch
                      checked={autoSync}
                      onCheckedChange={setAutoSync}
                    />
                  </div>
                  
                  {autoSync && (
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Sync Frequency</label>
                      <select
                        value={syncFrequency}
                        onChange={(e) => setSyncFrequency(e.target.value)}
                        className="w-full p-2 bg-gray-700 border-gray-600 rounded-md text-white"
                      >
                        <option value="15min">Every 15 minutes</option>
                        <option value="hourly">Every hour</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Sync Now
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-300 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="border-gray-600 text-black hover:bg-gray-700 hover:text-white">
              Export Data
            </button>
            <button variant="outline" className="border-gray-600 text-black hover:bg-gray-700 hover:text-white">
              Import Data
            </button>
          </div>
          
          {!user?.isDemo && (
            <div className="pt-4 border-t border-gray-600">
              <button
                variant="outline"
                className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Clear All Data
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                This action cannot be undone
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}