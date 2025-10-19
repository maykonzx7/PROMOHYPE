import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import MainTemplate from '@/components/templates/MainTemplate';
import PromotionList from '@/components/organisms/PromotionList';
import { fetchPromotions, Promotion } from '@/services/api';



interface Promotion {
  _id: string;
  title: string;
  price: string;
  link: string;
  image: string;
  store: string;
  scrapedAt: string;
}

export default function Home() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPromotions = async () => {
      try {
        const data = await fetchPromotions();
        setPromotions(data);
      } catch (error) {
        console.error('Erro ao buscar promoções:', error);
      } finally {
        setLoading(false);
      }
    };

    getPromotions();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Promohype - Encontre as melhores promoções</title>
        <meta name="description" content="Descubra as melhores promoções de produtos nas principais lojas" />
      </Head>
      
      <MainTemplate title="Promohype" description="Encontre as melhores promoções de produtos nas principais lojas">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Encontre as <span className="text-blue-600">melhores promoções</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            O Promohype rastreia automaticamente promoções nas principais lojas para você economizar tempo e dinheiro
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="O que você está procurando?"
              className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Categorias em Destaque</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Eletrônicos', 'Moda', 'Casa & Cozinha', 'Esportes'].map((category, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Promotions */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Promoções em Destaque</h2>
            <a href="/promotions" className="text-blue-600 dark:text-blue-400 hover:underline">Ver todas</a>
          </div>
          <PromotionList promotions={promotions} loading={loading} />
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Buscamos promoções", 
                description: "Rastreamos as principais lojas online em tempo real para encontrar as melhores promoções" 
              },
              { 
                title: "Agrupamos as ofertas", 
                description: "Organizamos todas as promoções em categorias para facilitar sua busca" 
              },
              { 
                title: "Você economiza", 
                description: "Encontre os melhores descontos e aproveite ofertas exclusivas" 
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </MainTemplate>
    </Layout>
  );
}
