'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from '../contexts/AuthContext';
import NotificationManager from './NotificationManager';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // Safe pathname check
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  const isAuthPage = pathname.includes('/auth/');

  if (isAuthPage) {
      return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <AuthProvider>
      <NotificationManager />
      <div className="min-h-screen bg-gray-50">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
