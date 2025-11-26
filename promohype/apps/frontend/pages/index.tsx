import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import MainTemplate from '@/components/templates/MainTemplate';
import PromotionList from '@/components/organisms/PromotionList';
import { fetchPromotions, Promotion } from '@/services/api';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';

export default function Home() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getPromotions = async () => {
      try {
        console.log('🚀 Iniciando busca de promoções...');
        const data = await fetchPromotions();
        console.log('📦 Promoções recebidas no componente:', data.length);
        // Limitar a 12 promoções na página inicial para melhor performance
        const limitedPromotions = data.slice(0, 12);
        console.log('✅ Exibindo', limitedPromotions.length, 'promoções na página inicial');
        setPromotions(limitedPromotions);
      } catch (error) {
        console.error('❌ Erro ao buscar promoções:', error);
        // Em caso de erro, definir array vazio para evitar erros de renderização
        setPromotions([]);
      } finally {
        setLoading(false);
        console.log('🏁 Loading finalizado');
      }
    };

    getPromotions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/categories?category=${encodeURIComponent(category)}`);
  };

  return (
    <Layout>
      <Head>
        <title>Promohype - Encontre as melhores promoções</title>
        <meta name="description" content="Descubra as melhores promoções de produtos nas principais lojas" />
      </Head>
      
      <MainTemplate title="Promohype" description="Encontre as melhores promoções de produtos nas principais lojas">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Encontre as <span className="text-primary">melhores promoções</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            O Promohype rastreia automaticamente promoções nas principais lojas para você economizar tempo e dinheiro
          </p>
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="O que você está procurando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-24 rounded-full h-12"
              aria-label="Buscar promoções"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
              aria-label="Enviar busca"
            >
              Buscar
            </Button>
          </form>
        </div>

        {/* Featured Categories */}
        <section className="mb-16" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-2xl font-bold text-foreground mb-8 text-center">
            Categorias em Destaque
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Eletrônicos', 'Moda', 'Casa & Cozinha', 'Esportes'].map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-border hover:border-foreground/20"
                aria-label={`Ver promoções de ${category}`}
              >
                <div className="bg-muted border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-2xl">📦</span>
                </div>
                <h3 className="font-semibold text-foreground">{category}</h3>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Promotions */}
        <section className="mb-16" aria-labelledby="promotions-heading">
          <div className="flex justify-between items-center mb-8">
            <h2 id="promotions-heading" className="text-2xl font-bold text-foreground">
              Promoções em Destaque
            </h2>
            <Link 
              href="/promotions" 
              className="text-primary hover:underline font-medium transition-colors"
              aria-label="Ver todas as promoções"
            >
              Ver todas
            </Link>
          </div>
          <PromotionList promotions={promotions} loading={loading} />
        </section>

        {/* How It Works */}
        <section className="mb-16" aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading" className="text-2xl font-bold text-foreground mb-8 text-center">
            Como Funciona
          </h2>
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
                <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </MainTemplate>
    </Layout>
  );
}
