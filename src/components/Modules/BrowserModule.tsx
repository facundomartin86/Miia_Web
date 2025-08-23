import React, { useState } from "react";
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Search,
  BookOpen,
  Download,
  Eye,
} from "lucide-react";

const BrowserModule: React.FC = () => {
  const [url, setUrl] = useState("https://example.com");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(false);

  const handleNavigate = (newUrl: string) => {
    setIsLoading(true);
    setUrl(newUrl);
    // Simular carga
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleAnalyze = () => {
    setAnalysisMode(true);
    // Aquí se implementaría el análisis automático de la página
  };

  const handleLearnFromPage = () => {
    // Aquí se implementaría la extracción y almacenamiento de información
    alert("Información extraída y guardada en mi memoria local");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4">
      {/* Header */}
      <div className="glass-morphism rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Navegador Integrado
            </h1>
            <p className="text-blue-200">Navega y aprende automáticamente</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAnalyze}
              className={`px-4 py-2 rounded-lg transition-all ${
                analysisMode
                  ? "bg-green-500 text-white"
                  : "bg-slate-700 text-blue-300 hover:bg-slate-600"
              }`}
            >
              <Eye className="w-4 h-4 mr-2 inline" />
              {analysisMode ? "Analizando..." : "Modo Análisis"}
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <button className="p-2 text-blue-300 hover:text-blue-200 hover:bg-slate-700 rounded-lg transition-all">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-blue-300 hover:text-blue-200 hover:bg-slate-700 rounded-lg transition-all">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="p-2 text-blue-300 hover:text-blue-200 hover:bg-slate-700 rounded-lg transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNavigate(url);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Ingresa una URL o busca algo..."
            />
          </div>

          <button
            onClick={() => handleNavigate(url)}
            className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 flex space-x-4">
        {/* Main Browser View */}
        <div className="flex-1 glass-morphism rounded-xl p-4">
          <div className="h-full bg-slate-800/30 rounded-lg border border-blue-500/20 flex items-center justify-center">
            {isLoading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-200">Cargando página...</p>
              </div>
            ) : (
              <div className="text-center text-blue-200">
                <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Navegador Web Integrado</p>
                <p className="text-sm opacity-70 mt-2">
                  En la implementación completa aquí se mostraría el contenido
                  web real
                </p>
                <div className="mt-6 space-y-2">
                  <button
                    onClick={handleLearnFromPage}
                    className="block w-full bg-gradient-to-r from-teal-500 to-green-400 text-white font-medium py-2 px-4 rounded-lg hover:from-teal-600 hover:to-green-500 transition-all"
                  >
                    <BookOpen className="w-4 h-4 mr-2 inline" />
                    Aprender de esta página
                  </button>
                  <button className="block w-full bg-slate-700 text-blue-300 font-medium py-2 px-4 rounded-lg hover:bg-slate-600 transition-all">
                    <Download className="w-4 h-4 mr-2 inline" />
                    Extraer información
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Panel */}
        {analysisMode && (
          <div className="w-80 glass-morphism rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Análisis Automático
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-300 mb-2">
                  Elementos Detectados
                </h4>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Títulos: 3</li>
                  <li>• Párrafos: 12</li>
                  <li>• Enlaces: 8</li>
                  <li>• Imágenes: 5</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-green-300 mb-2">
                  Información Extraída
                </h4>
                <ul className="text-sm text-green-200 space-y-1">
                  <li>• Tema principal identificado</li>
                  <li>• Conceptos clave guardados</li>
                  <li>• Enlaces útiles marcados</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-yellow-300 mb-2">
                  Acciones Sugeridas
                </h4>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-yellow-200 hover:text-yellow-100 transition-colors">
                    → Guardar en memoria permanente
                  </button>
                  <button className="w-full text-left text-sm text-yellow-200 hover:text-yellow-100 transition-colors">
                    → Crear resumen automático
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserModule;
