import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/atoms/card';
import PromotionDetailTemplate from '@/components/templates/PromotionDetailTemplate';
import PromotionList from '@/components/organisms/PromotionList';
import { fetchPromotionById, fetchPromotions, Promotion } from '@/services/api';

export default function PromotionDetailPage() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [relatedPromotions, setRelatedPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPromotionData = async () => {
      try {
        // In a real implementation, we would get the promotion ID from the URL
        // For now, we'll mock with a promotion ID
        // Assuming the promotion ID comes from the URL params in a real app
        const promotionData = await fetchPromotionById('1');
        
        setPromotion(promotionData);
        
        // Get related promotions
        const promotionsData = await fetchPromotions();
        // Filter out the current promotion and get a few related ones
        const filteredPromotions = promotionsData
          .filter(p => p._id !== promotionData._id)
          .slice(0, 3);
          
        setRelatedPromotions(filteredPromotions);
      } catch (error) {
        console.error('Erro ao buscar dados da promoção:', error);
      } finally {
        setLoading(false);
      }
    };

    getPromotionData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl w-full h-96" />
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!promotion) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">Promoção não encontrada</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{promotion.title} - Promohype</title>
        <meta name="description" content={promotion.description} />
      </Head>
      
      <PromotionDetailTemplate title={promotion.title} description={promotion.description}>
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{promotion.title}</h1>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold px-3 py-1 rounded">
                {promotion.store}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Atualizado em: {new Date(promotion.scrapedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            <div className="flex justify-center mb-6">
              {promotion.image ? (
                <img 
                  src={promotion.image} 
                  alt={promotion.title} 
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">Imagem do produto</span>
                </div>
              )}
            </div>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Descrição</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {promotion.description}
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Características</h2>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                <li>Processador Intel Core i7 de 11ª geração</li>
                <li>16GB de RAM DDR4</li>
                <li>512GB de armazenamento SSD</li>
                <li>Tela de 15.6 polegadas Full HD</li>
                <li>Placa de vídeo integrada Intel Iris Xe</li>
                <li>Conexões USB-C, USB-A, HDMI e leitor de cartões</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Promoções Relacionadas</h2>
            <PromotionList 
              promotions={relatedPromotions} 
            />
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {promotion.currentPrice}
              </div>
              <div className="line-through text-gray-500 dark:text-gray-400 mb-1">
                {promotion.originalPrice}
              </div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {promotion.discount} OFF
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Preço Original:</span>
                <span className="line-through text-gray-500 dark:text-gray-400">{promotion.originalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Preço Atual:</span>
                <span className="text-green-600 dark:text-green-400 font-bold">{promotion.currentPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Desconto:</span>
                <span className="text-green-600 dark:text-green-400 font-bold">{promotion.discount}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className={`text-center py-2 px-4 rounded-lg font-medium ${
                promotion.availability 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                {promotion.availability ? 'Disponível' : 'Indisponível'}
              </div>
            </div>
            
            <a 
              href={promotion.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors duration-300 font-semibold mb-4"
            >
              Comprar Agora
            </a>
            
            <Button variant="outline" className="w-full">
              Adicionar aos Favoritos
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Histórico de Preços</h3>
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Gráfico de histórico de preços</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              O preço mais baixo registrado foi R$ 3.299,99 em 10/05/2023
            </p>
          </div>
        </div>
      </PromotionDetailTemplate>
    </Layout>
  );
}