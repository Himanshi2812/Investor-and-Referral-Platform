import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TrendingUp } from 'lucide-react';

const MainContent = () => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div className="text-gray-400 text-xs font-mono">Initializing Nexachain AI Secure Session...</div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
  }

  return <DashboardPage />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
