import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Mail, Lock, User } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setAlert(error.message);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      setAlert(error.message);
      return;
    }
    // Create profile row
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id, full_name: name, email }]);
    setLoading(false);
    if (profileError) setAlert(profileError.message);
  };

  const handleDemo = () => {
    setAlert("Demo mode is not implemented yet.");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* App Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-400 mb-8">Cycle</h1>
        </div>

        {/* Squiggly Circle */}
        <div className="flex justify-center mb-8">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="text-blue-400/20"
          >
            <path
              d="M100,20 
                 C140,25 175,45 185,85
                 C190,120 170,155 130,170
                 C90,180 50,165 25,125
                 C10,85 30,45 70,25
                 C80,22 90,20 100,20 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-30"
            />
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5,3"
              className="opacity-50"
            />
          </svg>
        </div>

        {/* Login/Register Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            {alert && (
              <div className="mb-4 p-2 rounded text-center bg-red-900 text-red-300">
                {alert}
              </div>
            )}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-gray-700 text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-gray-700 text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo Button */}
            <div className="mt-6 pt-6 border-t border-gray-600">
              <Button
                onClick={handleDemo}
                variant="outline"
                className="w-full border-gray-600 text-blue-400 hover:bg-gray-700"
              >
                Try Demo Mode
              </Button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Explore the app with sample data
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-gray-400 text-sm">
          <p>Business Sales Tracking & Analytics</p>
        </div>
      </div>
    </div>
  );
}