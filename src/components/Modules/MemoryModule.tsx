import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Calendar, 
  Tag,
  FileText,
  Brain,
  Trash2,
  Download
} from 'lucide-react';

interface MemoryItem {
  id: string;
  type: 'conversation' | 'web_data' | 'learning' | 'code';
  title: string;
  content: string;
  tags: string[];
  timestamp: Date;
  size: string;
}

const MemoryModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [memoryItems] = useState<MemoryItem[]>([
    {
      id: '1',
      type: 'conversation',
      title: 'Conversación sobre React',
      content: 'Discusión sobre mejores prácticas en React, hooks y optimización de rendimiento...',
      tags: ['react', 'javascript', 'desarrollo'],
      timestamp: new Date(Date.now() - 86400000),
      size: '2.3 KB'
    },
    {
      id: '2',
      type: 'web_data',
      title: 'Documentación de Tailwind CSS',
      content: 'Información extraída sobre utilidades de Tailwind, configuración y personalización...',
      tags: ['css', 'tailwind', 'diseño'],
      timestamp: new Date(Date.now() - 172800000),
      size: '5.7 KB'
    },
    {
      id: '3',
      type: 'learning',
      title: 'Patrones de Diseño en TypeScript',
      content: 'Aprendizaje sobre singleton, factory, observer y otros patrones implementados en TS...',
      tags: ['typescript', 'patrones', 'arquitectura'],
      timestamp: new Date(Date.now() - 259200000),
      size: '8.1 KB'
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation': return <Brain className="w-4 h-4" />;
      case 'web_data': return <Database className="w-4 h-4" />;
      case 'learning': return <FileText className="w-4 h-4" />;
      case 'code': return <Tag className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conversation': return 'text-blue-400 bg-blue-500/20';
      case 'web_data': return 'text-cyan-400 bg-cyan-500/20';
      case 'learning': return 'text-green-400 bg-green-500/20';
      case 'code': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-blue-400 bg-blue-500/20';
    }
  };

  const filteredItems = memoryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const totalSize = memoryItems.reduce((acc, item) => {
    const sizeNum = parseFloat(item.size);
    return acc + sizeNum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Mi Memoria Local</h1>
            <p className="text-blue-200">Base de conocimiento personal y persistente</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-blue-300">Datos almacenados</p>
              <p className="text-lg font-semibold text-white">{totalSize.toFixed(1)} KB</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-300">Elementos</p>
              <p className="text-lg font-semibold text-white">{memoryItems.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar en mi memoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-blue-300 w-4 h-4" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-slate-800/50 border border-blue-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="conversation">Conversaciones</option>
              <option value="web_data">Datos Web</option>
              <option value="learning">Aprendizaje</option>
              <option value="code">Código</option>
            </select>
          </div>
        </div>
      </div>

      {/* Memory Items */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass-morphism rounded-xl p-6 hover:bg-slate-800/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-blue-300 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.timestamp.toLocaleDateString()}
                    </span>
                    <span className="text-sm text-blue-300">{item.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-blue-300 hover:text-blue-200 hover:bg-slate-700 rounded-lg transition-all">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-blue-200 mb-3 leading-relaxed">{item.content}</p>
            
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-slate-700 text-blue-300 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="glass-morphism rounded-xl p-12 text-center">
          <Database className="w-16 h-16 text-blue-400 opacity-50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No se encontraron resultados</h3>
          <p className="text-blue-200">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Aún no hay datos almacenados en mi memoria'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MemoryModule;