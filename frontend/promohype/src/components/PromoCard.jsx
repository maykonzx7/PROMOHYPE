import React, { useState } from 'react';
import { ExternalLink, Clock, TrendingDown, Tag, Building2, Star, BarChart3, ImageIcon, ZoomIn, X, Heart, Share2, AlertTriangle } from 'lucide-react';

const ImageModal = ({ src, alt, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
          <p className="text-white font-medium">{title}</p>
        </div>
      </div>
    </div>
  );
};

const PromoCard = ({ promotion }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

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
        verified: true,
        bgColor: 'bg-yellow-500'
      },
      'Casas Bahia': { 
        color: 'bg-red-100 text-red-800 border-red-200',
        rating: 4.2,
        verified: true,
        bgColor: 'bg-red-500'
      },
      'Magazine Luiza': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        rating: 4.3,
        verified: true,
        bgColor: 'bg-blue-500'
      }
    };
    return stores[store] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      rating: 4.0,
      verified: false,
      bgColor: 'bg-gray-500'
    };
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: promotion.title,
          text: `Confira esta oferta: ${formatPrice(promotion.price)}`,
          url: promotion.link
        });
      } catch (err) {
        console.log('Compartilhamento cancelado');
      }
    } else {
      // Fallback para copiar para clipboard
      navigator.clipboard.writeText(promotion.link);
      // Aqui você poderia mostrar uma notificação de sucesso
    }
  };

  const hasValidImage = promotion.image && 
                       promotion.image !== "Sem imagem" && 
                       promotion.image.startsWith('http') && 
                       !imageError;

  const storeInfo = getStoreInfo(promotion.store);
  const price = parseFloat(promotion.price?.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const discountPercent = Math.floor(Math.random() * 30) + 10; // Simulado
  const isExpensive = price > 1000;
  const isRecentlyScraped = new Date() - new Date(promotion.scrapedAt) < 3600000; // 1 hora

  return (
    <>
      <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {hasValidImage ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              <img
                src={promotion.image}
                alt={promotion.title}
                className={`w-full h-full object-contain transition-all duration-300 cursor-pointer ${
                  imageLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-110'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={() => setIsModalOpen(true)}
                loading="lazy"
              />
              {!imageLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">Imagem não disponível</p>
              </div>
            </div>
          )}
          
          {/* Top Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-blue-500 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Store Badge */}
          <div className="absolute top-3 left-3">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm bg-white/90 ${storeInfo.color}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${storeInfo.bgColor}`}></div>
              {promotion.store}
              {storeInfo.verified && (
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Bottom Badges */}
          <div className="absolute bottom-3 left-3 flex space-x-2">
            {/* Discount Badge */}
            {price > 0 && (
              <div className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full backdrop-blur-sm bg-opacity-95 shadow-lg">
                <TrendingDown className="w-3 h-3" />
                <span className="text-xs font-bold">
                  -{discountPercent}%
                </span>
              </div>
            )}
            
            {/* High Value Badge */}
            {isExpensive && (
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm bg-opacity-95 shadow-lg">
                Premium
              </div>
            )}
            
            {/* Recent Badge */}
            {isRecentlyScraped && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm bg-opacity-95 shadow-lg">
                Novo
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {promotion.title}
            </h3>
            
            {/* Store Info Row */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">{promotion.store}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-bold text-gray-700">{storeInfo.rating}</span>
              </div>
            </div>
            
            {/* Price Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-black text-green-600">
                  {formatPrice(promotion.price)}
                </span>
              </div>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group/btn">
                <BarChart3 className="w-5 h-5 text-gray-400 group-hover/btn:text-blue-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(promotion.scrapedAt)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Em estoque</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={promotion.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center space-x-2 group/link shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>Analisar Oferta</span>
              <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
            </a>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-semibold">
                Comparar
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-semibold">
                Monitorar
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicator */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <AlertTriangle className="w-3 h-3" />
            <span>Preços sujeitos a alteração</span>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        src={promotion.image}
        alt={promotion.title}
        title={promotion.title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PromoCard;