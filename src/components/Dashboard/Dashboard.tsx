import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatModule from '../Modules/ChatModule';
import BrowserModule from '../Modules/BrowserModule';
import MemoryModule from '../Modules/MemoryModule';
import SecurityModule from '../Modules/SecurityModule';
import SettingsModule from '../Modules/SettingsModule';
import DashboardHome from './DashboardHome';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('miia.sidebarCollapsed');
      return saved ? JSON.parse(saved) === true : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('miia.sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    } catch {}
  }, [sidebarCollapsed]);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/chat" element={<ChatModule />} />
            <Route path="/browser" element={<BrowserModule />} />
            <Route path="/memory" element={<MemoryModule />} />
            <Route path="/security" element={<SecurityModule />} />
            <Route path="/settings" element={<SettingsModule />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;