import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  MessageSquare,
  Globe,
  Database,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { logout, user } = useAuth();
  type ImportMetaEnv = { VITE_APP_VERSION?: string };
  type ImportMetaWithEnv = { env?: ImportMetaEnv };
  const APP_VERSION: string =
    (import.meta as unknown as ImportMetaWithEnv).env?.VITE_APP_VERSION ||
    "v1.0.0";

  const navItems = [
    { icon: Home, label: "Inicio", path: "/dashboard" },
    { icon: MessageSquare, label: "Chat", path: "/dashboard/chat" },
    { icon: Globe, label: "Navegador", path: "/dashboard/browser" },
    { icon: Database, label: "Memoria", path: "/dashboard/memory" },
    { icon: Shield, label: "Seguridad", path: "/dashboard/security" },
    { icon: Settings, label: "Configuración", path: "/dashboard/settings" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-900/80 backdrop-blur-lg border-r border-blue-500/20 transition-all duration-300 z-50 ${
        collapsed ? "w-20" : "w-64"
      } flex flex-col pb-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 p-1 rounded-xl overflow-hidden bg-slate-800/60 flex items-center justify-center">
              <img
                src="/miia_originalcyan.png"
                alt="MiiA"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">MiiA</h1>
              <p className="text-xs text-blue-300">{APP_VERSION}</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-blue-300 hover:text-blue-200 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `sidebar-nav-item flex ${collapsed ? "items-center justify-center p-4" : "items-center p-3"} rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/20 text-blue-200 border-l-4 border-blue-400"
                  : "text-blue-300 hover:text-blue-200"
              }`
            }
          >
            <item.icon
              className={`${collapsed ? "w-8 h-8" : "w-5 h-5 mr-3"}`}
            />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="mt-auto p-4 pb-6 border-t border-blue-500/20">
        {!collapsed && user && (
          <div className="mb-3 p-2 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-blue-200 font-medium">{user.name}</p>
            <p className="text-xs text-blue-400">@{user.username}</p>
          </div>
        )}
        <button
          onClick={logout}
          className={`sidebar-nav-item flex ${collapsed ? "items-center justify-center p-4" : "items-center p-3"} w-full text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all`}
        >
          <LogOut className={`${collapsed ? "w-8 h-8" : "w-5 h-5 mr-3"}`} />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
