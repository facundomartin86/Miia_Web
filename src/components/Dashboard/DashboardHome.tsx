import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Globe,
  Database,
  Shield,
  Settings,
  Activity,
  Zap,
} from "lucide-react";

const DashboardHome: React.FC = () => {
  const modules = [
    {
      icon: MessageSquare,
      title: "Chat Inteligente",
      description:
        "Comunícate conmigo por texto y voz. Resuelve dudas y automatiza tareas.",
      path: "/dashboard/chat",
      color: "from-cyan-500 to-teal-400",
    },
    {
      icon: Globe,
      title: "Navegador Integrado",
      description:
        "Navega conmigo por la web. Aprendo y extraigo información automáticamente.",
      path: "/dashboard/browser",
      color: "from-cyan-400 to-teal-400",
    },
    {
      icon: Database,
      title: "Memoria Local",
      description:
        "Mi base de conocimiento personal. Almaceno y reutilizo todo lo aprendido.",
      path: "/dashboard/memory",
      color: "from-teal-400 to-green-400",
    },
    {
      icon: Shield,
      title: "Seguridad",
      description:
        "Módulo de protección contra ataques y análisis de seguridad.",
      path: "/dashboard/security",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: Settings,
      title: "Configuración",
      description:
        "Personaliza mi comportamiento, voz y capacidades avanzadas.",
      path: "/dashboard/settings",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const stats = [
    { label: "Conversaciones", value: "0", icon: MessageSquare },
    { label: "Páginas Analizadas", value: "0", icon: Globe },
    { label: "Datos Almacenados", value: "0 MB", icon: Database },
    { label: "Tiempo Activa", value: "0h", icon: Activity },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <img
            src="/miia.png"
            alt="MiiA"
            className="mx-auto h-28 md:h-36 lg:h-44 w-auto rounded-2xl"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">
          ¡Hola! Soy <span className="gradient-text">MiiA</span>
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
          Tu inteligencia artificial personal especializada en desarrollo. Estoy
          aquí para ayudarte, aprender contigo y evolucionar constantemente.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-morphism rounded-xl p-6 text-center"
          >
            <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-blue-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Link
            key={index}
            to={module.path}
            className="module-card rounded-xl p-6 block hover:scale-105"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center mb-4`}
            >
              <module.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {module.title}
            </h3>
            <p className="text-blue-200 leading-relaxed">
              {module.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-morphism rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          Acciones Rápidas
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/chat"
            className="bg-gradient-to-r from-cyan-500 to-teal-400 text-white font-medium py-3 px-6 rounded-lg text-center hover:from-cyan-600 hover:to-teal-500 transition-all"
          >
            Empezar a Chatear
          </Link>
          <Link
            to="/dashboard/browser"
            className="bg-gradient-to-r from-cyan-400 to-teal-400 text-white font-medium py-3 px-6 rounded-lg text-center hover:from-cyan-500 hover:to-teal-500 transition-all"
          >
            Navegar Juntos
          </Link>
          <Link
            to="/dashboard/memory"
            className="bg-gradient-to-r from-teal-400 to-green-400 text-white font-medium py-3 px-6 rounded-lg text-center hover:from-teal-500 hover:to-green-500 transition-all"
          >
            Ver Mi Memoria
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
