import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatModule from "../Modules/ChatModule";
import BrowserModule from "../Modules/BrowserModule";
import MemoryModule from "../Modules/MemoryModule";
import SecurityModule from "../Modules/SecurityModule";
import SettingsModule from "../Modules/SettingsModule";
import DashboardHome from "./DashboardHome";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, User as UserIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("miia.sidebarCollapsed");
      return saved ? JSON.parse(saved) === true : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "miia.sidebarCollapsed",
        JSON.stringify(sidebarCollapsed),
      );
    } catch {
      // Ignorar errores de escritura en localStorage (p. ej., modo privado)
    }
  }, [sidebarCollapsed]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header superior con usuario y logout */}
        <div className="sticky top-0 z-10 backdrop-blur bg-slate-900/40 border-b border-blue-500/20">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="text-blue-200 text-sm">
              {sidebarCollapsed ? (
                <span className="font-semibold">MiiA</span>
              ) : (
                <>
                  <span className="font-semibold">MiiA</span>
                  <span className="opacity-70"> · Dashboard</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-blue-200">
                <UserIcon className="w-4 h-4" />
                <span className="text-sm">
                  {user ? user.name || user.username : "Usuario"}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/20 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-3 md:p-4">
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
