import React from 'react';
import { ExternalLink, Clock, TrendingDown, Tag, Building2, Star, BarChart3 } from 'lucide-react';

const PromoCard = ({ promotion }) => {
  const formatPrice = (price) => {
    if (!price || price === "Sem preço") return "Consultar";
    const numericPrice = parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
    return numericPrice ? `R$ ${numericPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Consultar";
  };

  const formatDate = (date) => {
    const now = new Date();
    const scrapedDate = new Date(date);
    const diffInHours = Math.floor((now - scrapedDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return scrapedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStoreInfo = (store) => {
    const stores = {
      'Mercado Livre': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        rating: 4.5,
        verified: true
      },
      'Casas Bahia': { 
        color: 'bg-red-100 text-red-800 border-red-200',
        rating: 4.2,
        verified: true
      },
      'Magazine Luiza': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        rating: 4.3,
        verified: true
      }
    };
    return stores[store] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      rating: 4.0,
      verified: false
    };
  };

  const storeInfo = getStoreInfo(promotion.store);
  const price = parseFloat(promotion.price?.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const discountPercent = Math.floor(Math.random() * 30) + 10; // Simulado

  return (
    <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header with Store Info */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Building2 className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${storeInfo.color}`}>
                {promotion.store}
                {storeInfo.verified && (
                  <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-600">{storeInfo.rating}</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {promotion.title}
          </h3>
          
          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Tag className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(promotion.price)}
                </span>
              </div>
              
              {price > 0 && (
                <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <span className="text-xs font-semibold text-red-600">
                    -{discountPercent}%
                  </span>
                </div>
              )}
            </div>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group/btn">
              <BarChart3 className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-600" />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(promotion.scrapedAt)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs font-medium text-green-600">Em estoque</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={promotion.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 group/link"
          >
            <span>Analisar Oferta</span>
            <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
          </a>
          
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
              Comparar
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
              Monitorar
            </button>
          </div>
        </div>
      </div>

      {/* Opportunity Badge */}
      {price > 1000 && (
        <div className="absolute top-3 right-3">
          <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Alto valor
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCard;