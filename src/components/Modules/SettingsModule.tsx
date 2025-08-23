import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Volume2, 
  Mic, 
  Brain, 
  Database,
  Palette,
  Shield,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';

const SettingsModule: React.FC = () => {
  const DEFAULT_SETTINGS = {
    voice: {
      outputVolume: 75,
      inputSensitivity: 60,
      voiceModel: 'natural-female',
      speechRate: 1.0,
      enabled: true
    },
    ai: {
      model: 'local-llm',
      temperature: 0.7,
      maxTokens: 2048,
      memoryRetention: 90,
      learningMode: true
    },
    security: {
      sessionTimeout: 30,
      autoBackup: true,
      backupInterval: 24,
      encryptionLevel: 'high'
    },
    interface: {
      theme: 'futuristic',
      fontSize: 'medium',
      animations: true,
      compactMode: false
    }
  };

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('miia.settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('miia.settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'miia-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const resetSettings = () => {
    if (confirm('¿Estás seguro de que quieres restablecer todas las configuraciones?')) {
      try {
        localStorage.removeItem('miia.settings');
      } catch {}
      setSettings(DEFAULT_SETTINGS);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Configuración de MiiA</h1>
            <p className="text-blue-200">Personaliza mi comportamiento y capacidades</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportSettings}
              className="flex items-center px-4 py-2 bg-slate-700 text-blue-300 rounded-lg hover:bg-slate-600 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button
              onClick={resetSettings}
              className="flex items-center px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer
            </button>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="glass-morphism rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Volume2 className="w-5 h-5 mr-2" />
          Configuración de Voz
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Volumen de Salida
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.voice.outputVolume}
              onChange={(e) => updateSetting('voice', 'outputVolume', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-right text-sm text-blue-300 mt-1">
              {settings.voice.outputVolume}%
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Sensibilidad del Micrófono
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.voice.inputSensitivity}
              onChange={(e) => updateSetting('voice', 'inputSensitivity', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-right text-sm text-blue-300 mt-1">
              {settings.voice.inputSensitivity}%
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Modelo de Voz
            </label>
            <select
              value={settings.voice.voiceModel}
              onChange={(e) => updateSetting('voice', 'voiceModel', e.target.value)}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="natural-female">Femenina Natural</option>
              <option value="natural-male">Masculina Natural</option>
              <option value="robotic">Robótica</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Velocidad de Habla
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.voice.speechRate}
              onChange={(e) => updateSetting('voice', 'speechRate', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-right text-sm text-blue-300 mt-1">
              {settings.voice.speechRate}x
            </div>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="glass-morphism rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Configuración de IA
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Modelo de IA
            </label>
            <select
              value={settings.ai.model}
              onChange={(e) => updateSetting('ai', 'model', e.target.value)}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="local-llm">Modelo Local (Recomendado)</option>
              <option value="openai-gpt4">OpenAI GPT-4</option>
              <option value="anthropic-claude">Anthropic Claude</option>
              <option value="huggingface">HuggingFace</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Creatividad (Temperature)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.ai.temperature}
              onChange={(e) => updateSetting('ai', 'temperature', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-right text-sm text-blue-300 mt-1">
              {settings.ai.temperature}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Máximo de Tokens
            </label>
            <input
              type="number"
              min="256"
              max="4096"
              value={settings.ai.maxTokens}
              onChange={(e) => updateSetting('ai', 'maxTokens', parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Retención de Memoria (días)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={settings.ai.memoryRetention}
              onChange={(e) => updateSetting('ai', 'memoryRetention', parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.ai.learningMode}
              onChange={(e) => updateSetting('ai', 'learningMode', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-blue-200">Modo de aprendizaje continuo</span>
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="glass-morphism rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Configuración de Seguridad
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Tiempo de sesión (minutos)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Intervalo de backup (horas)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={settings.security.backupInterval}
              onChange={(e) => updateSetting('security', 'backupInterval', parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Nivel de Cifrado
            </label>
            <select
              value={settings.security.encryptionLevel}
              onChange={(e) => updateSetting('security', 'encryptionLevel', e.target.value)}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Básico</option>
              <option value="standard">Estándar</option>
              <option value="high">Alto (Recomendado)</option>
              <option value="military">Militar</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.security.autoBackup}
                onChange={(e) => updateSetting('security', 'autoBackup', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-blue-200">Backup automático</span>
            </label>
          </div>
        </div>
      </div>

      {/* Interface Settings */}
      <div className="glass-morphism rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Configuración de Interfaz
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Tema Visual
            </label>
            <select
              value={settings.interface.theme}
              onChange={(e) => updateSetting('interface', 'theme', e.target.value)}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="futuristic">Futurista (Actual)</option>
              <option value="minimal">Minimalista</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="classic">Clásico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">
              Tamaño de Fuente
            </label>
            <select
              value={settings.interface.fontSize}
              onChange={(e) => updateSetting('interface', 'fontSize', e.target.value)}
              className="w-full bg-slate-800 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Pequeña</option>
              <option value="medium">Media</option>
              <option value="large">Grande</option>
              <option value="xlarge">Extra Grande</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.interface.animations}
                onChange={(e) => updateSetting('interface', 'animations', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-blue-200">Animaciones suaves</span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.interface.compactMode}
                onChange={(e) => updateSetting('interface', 'compactMode', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-blue-200">Modo compacto</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;