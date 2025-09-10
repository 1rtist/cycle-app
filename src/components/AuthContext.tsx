import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isDemo: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const savedUser = localStorage.getItem('cycle_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('cycle_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would call Firebase Auth and retrieve user data
      // For now, we'll simulate authentication and check if user exists in localStorage
      if (email && password) {
        // Check if there's already a registered user with this email
        const existingUsers = JSON.parse(localStorage.getItem('cycle_registered_users') || '[]');
        const existingUser = existingUsers.find((u: User) => u.email === email);
        
        const newUser: User = {
          id: existingUser?.id || Date.now().toString(),
          email,
          name: existingUser?.name || email.split('@')[0],
          isDemo: false,
        };
        
        setUser(newUser);
        localStorage.setItem('cycle_user', JSON.stringify(newUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would call Firebase Auth
      // For now, we'll simulate registration and save user data
      if (email && password && name) {
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          isDemo: false,
        };
        
        // Save to registered users list for future login lookups
        const existingUsers = JSON.parse(localStorage.getItem('cycle_registered_users') || '[]');
        const updatedUsers = [...existingUsers.filter((u: User) => u.email !== email), newUser];
        localStorage.setItem('cycle_registered_users', JSON.stringify(updatedUsers));
        
        setUser(newUser);
        localStorage.setItem('cycle_user', JSON.stringify(newUser));
      } else {
        throw new Error('All fields are required');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = () => {
    const demoUser: User = {
      id: 'demo',
      email: 'demo@cycle.app',
      name: 'Demo User',
      isDemo: true,
    };
    
    setUser(demoUser);
    localStorage.setItem('cycle_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cycle_user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    loginDemo,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}