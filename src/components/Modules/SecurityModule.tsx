import React, { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Activity,
  Settings,
} from "lucide-react";

interface SecurityEvent {
  id: string;
  type: "blocked" | "warning" | "info";
  title: string;
  description: string;
  timestamp: Date;
}

const SecurityModule: React.FC = () => {
  const [securityStatus, setSecurityStatus] = useState({
    firewall: true,
    encryption: true,
    monitoring: true,
    autoDefense: true,
  });

  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: "1",
      type: "blocked",
      title: "Intento de acceso no autorizado bloqueado",
      description:
        "Se detectó un intento de acceso desde IP desconocida. Acceso denegado automáticamente.",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      type: "warning",
      title: "Patrón de consulta inusual detectado",
      description:
        "Se detectaron múltiples solicitudes de información sensible. Monitoreando actividad.",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      type: "info",
      title: "Backup de memoria completado",
      description:
        "Respaldo automático de la base de conocimiento local completado exitosamente.",
      timestamp: new Date(Date.now() - 86400000),
    },
  ]);

  const toggleSecurityFeature = (feature: keyof typeof securityStatus) => {
    setSecurityStatus((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "blocked":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "info":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getEventBg = (type: string) => {
    switch (type) {
      case "blocked":
        return "bg-red-500/10 border-red-500/30";
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "info":
        return "bg-green-500/10 border-green-500/30";
      default:
        return "bg-blue-500/10 border-blue-500/30";
    }
  };

  const securityScore =
    Object.values(securityStatus).filter(Boolean).length * 25;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Módulo de Seguridad
            </h1>
            <p className="text-blue-200">Protección y monitoreo de sistemas</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-lg font-semibold text-white">
                {securityScore}%
              </span>
            </div>
            <p className="text-sm text-green-300">Nivel de Seguridad</p>
          </div>
        </div>

        {/* Security Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-lg border ${securityStatus.firewall ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Shield
                className={`w-4 h-4 ${securityStatus.firewall ? "text-green-400" : "text-red-400"}`}
              />
              <span className="text-sm font-medium text-white">Firewall</span>
            </div>
            <p
              className={`text-xs ${securityStatus.firewall ? "text-green-300" : "text-red-300"}`}
            >
              {securityStatus.firewall ? "Activo" : "Desactivado"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${securityStatus.encryption ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Lock
                className={`w-4 h-4 ${securityStatus.encryption ? "text-green-400" : "text-red-400"}`}
              />
              <span className="text-sm font-medium text-white">Cifrado</span>
            </div>
            <p
              className={`text-xs ${securityStatus.encryption ? "text-green-300" : "text-red-300"}`}
            >
              {securityStatus.encryption ? "AES-256" : "Desactivado"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${securityStatus.monitoring ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Eye
                className={`w-4 h-4 ${securityStatus.monitoring ? "text-green-400" : "text-red-400"}`}
              />
              <span className="text-sm font-medium text-white">Monitoreo</span>
            </div>
            <p
              className={`text-xs ${securityStatus.monitoring ? "text-green-300" : "text-red-300"}`}
            >
              {securityStatus.monitoring ? "En línea" : "Desactivado"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg border ${securityStatus.autoDefense ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Activity
                className={`w-4 h-4 ${securityStatus.autoDefense ? "text-green-400" : "text-red-400"}`}
              />
              <span className="text-sm font-medium text-white">
                Auto-Defensa
              </span>
            </div>
            <p
              className={`text-xs ${securityStatus.autoDefense ? "text-green-300" : "text-red-300"}`}
            >
              {securityStatus.autoDefense ? "Habilitada" : "Desactivada"}
            </p>
          </div>
        </div>
      </div>

      {/* Security Controls */}
      <div className="glass-morphism rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Controles de Seguridad
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h3 className="font-medium text-white">Firewall Inteligente</h3>
              <p className="text-sm text-blue-200">
                Bloquea automáticamente conexiones sospechosas
              </p>
            </div>
            <button
              onClick={() => toggleSecurityFeature("firewall")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securityStatus.firewall ? "bg-green-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securityStatus.firewall ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h3 className="font-medium text-white">Cifrado de Memoria</h3>
              <p className="text-sm text-blue-200">
                Protege datos locales con cifrado AES-256
              </p>
            </div>
            <button
              onClick={() => toggleSecurityFeature("encryption")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securityStatus.encryption ? "bg-green-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securityStatus.encryption ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h3 className="font-medium text-white">Monitoreo Continuo</h3>
              <p className="text-sm text-blue-200">
                Supervisa actividad y detecta anomalías
              </p>
            </div>
            <button
              onClick={() => toggleSecurityFeature("monitoring")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securityStatus.monitoring ? "bg-green-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securityStatus.monitoring ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h3 className="font-medium text-white">Auto-Defensa</h3>
              <p className="text-sm text-blue-200">
                Respuesta automática ante intentos de hackeo
              </p>
            </div>
            <button
              onClick={() => toggleSecurityFeature("autoDefense")}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securityStatus.autoDefense ? "bg-green-500" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securityStatus.autoDefense ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security Events */}
      <div className="glass-morphism rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Eventos de Seguridad Recientes
        </h2>

        <div className="space-y-3">
          {securityEvents.map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 ${getEventBg(event.type)}`}
            >
              <div className="flex items-start space-x-3">
                {getEventIcon(event.type)}
                <div className="flex-1">
                  <h3 className="font-medium text-white">{event.title}</h3>
                  <p className="text-sm text-blue-200 mt-1">
                    {event.description}
                  </p>
                  <p className="text-xs text-blue-300 mt-2">
                    {event.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityModule;
