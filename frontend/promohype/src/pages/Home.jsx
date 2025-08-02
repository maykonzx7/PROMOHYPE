import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, TrendingUp, TrendingDown, BarChart3, Target, AlertCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import PromoCard from '../components/PromoCard';

const MetricCard = ({ title, value, change, trend, icon: Icon, color = "blue" }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-green-600 bg-green-50 border-green-200",
    orange: "text-orange-600 bg-orange-50 border-orange-200",
    red: "text-red-600 bg-red-50 border-red-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200"
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const LoadingCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
          <div className="bg-gray-200 h-5 w-24 rounded"></div>
        </div>
        <div className="bg-gray-200 w-6 h-6 rounded"></div>
      </div>
      <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
      <div className="bg-gray-200 h-4 w-3/4 mb-4 rounded"></div>
      <div className="bg-gray-200 h-6 w-32 mb-4 rounded"></div>
      <div className="bg-gray-200 h-10 w-full rounded-lg"></div>
    </div>
  </div>
);

const Home = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [filterStore, setFilterStore] = useState('all');

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/promotions');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados da plataforma');
      }
      
      const data = await response.json();
      setPromotions(data);
      setFilteredPromotions(data);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    let filtered = promotions.filter(promo =>
      promo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filterStore !== 'all') {
      filtered = filtered.filter(promo => promo.store === filterStore);
    }
    
    setFilteredPromotions(filtered);
  }, [searchTerm, filterStore, promotions]);

  const stores = [...new Set(promotions.map(p => p.store))];
  const totalValue = filteredPromotions.reduce((acc, promo) => {
    const price = parseFloat(promo.price?.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    return acc + price;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Análise de Mercado
          </h1>
          <p className="text-gray-600">
            Dashboard executivo com insights em tempo real sobre oportunidades de mercado
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchPromotions}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Oportunidades Ativas"
          value={filteredPromotions.length.toLocaleString()}
          change="+12%"
          trend="up"
          icon={Target}
          color="blue"
        />
        <MetricCard
          title="Valor Total do Mercado"
          value={`R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
          change="+8.5%"
          trend="up"
          icon={BarChart3}
          color="green"
        />
        <MetricCard
          title="Canais Monitorados"
          value={stores.length.toString()}
          change="+2"
          trend="up"
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Última Atualização"
          value="2 min"
          change="Tempo real"
          trend="up"
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-end">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Produtos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Digite o nome do produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Store Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canal
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={filterStore}
                onChange={(e) => setFilterStore(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Canais</option>
                {stores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Erro no Sistema de Monitoramento
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchPromotions}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Reconectar Sistema
              </button>
            </div>
          </div>
        </div>
      )}

      {!error && !loading && filteredPromotions.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">
                Sistema Operacional
              </h3>
              <p className="text-green-700">
                Monitoramento ativo em {stores.length} canais • {filteredPromotions.length} oportunidades identificadas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Oportunidades de Mercado
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Exibindo {filteredPromotions.length} de {promotions.length} resultados</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchTerm || filterStore !== 'all' ? 'Nenhum resultado encontrado' : 'Aguardando dados'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterStore !== 'all' 
                ? 'Ajuste os filtros de busca para encontrar outras oportunidades'
                : 'Execute o sistema de coleta para identificar novas oportunidades de mercado'
              }
            </p>
            {(searchTerm || filterStore !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStore('all');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPromotions.map((promotion) => (
                <PromoCard key={promotion._id} promotion={promotion} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Center */}
      {!loading && filteredPromotions.length > 0 && (
        <div className="bg-slate-900 text-white rounded-xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Central de Inteligência Comercial
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Dados atualizados em tempo real para decisões estratégicas. Nosso sistema monitora continuamente o mercado para identificar as melhores oportunidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={fetchPromotions}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Atualizar Dados</span>
              </button>
              <button className="border border-slate-600 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                <ExternalLink className="w-5 h-5" />
                <span>API Documentation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;