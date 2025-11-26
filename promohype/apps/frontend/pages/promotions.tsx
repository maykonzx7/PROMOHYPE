import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import MainTemplate from '@/components/templates/MainTemplate';
import PromotionList from '@/components/organisms/PromotionList';
import { fetchPromotions, Promotion } from '@/services/api';

export default function PromotionsPage() {
  const [allPromotions, setAllPromotions] = useState<Promotion[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    store: '',
  });

  useEffect(() => {
    const getPromotions = async () => {
      try {
        setLoading(true);
        const data = await fetchPromotions();
        setAllPromotions(data);
        setPromotions(data);
      } catch (error) {
        console.error('Erro ao buscar promoções:', error);
      } finally {
        setLoading(false);
      }
    };

    getPromotions();
  }, []);

  const applyFilters = () => {
    let filtered = [...allPromotions];

    // Filtro por categoria
    if (filters.category) {
      filtered = filtered.filter(promo => 
        promo.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Filtro por loja
    if (filters.store) {
      filtered = filtered.filter(promo => promo.store === filters.store);
    }

    // Filtro por preço mínimo
    if (filters.minPrice) {
      const minPriceValue = parseFloat(filters.minPrice);
      filtered = filtered.filter(promo => {
        const priceValue = parseFloat(promo.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
        return !isNaN(priceValue) && priceValue >= minPriceValue;
      });
    }

    // Filtro por preço máximo
    if (filters.maxPrice) {
      const maxPriceValue = parseFloat(filters.maxPrice);
      filtered = filtered.filter(promo => {
        const priceValue = parseFloat(promo.price.replace(/[^\d,.-]/g, '').replace(',', '.'));
        return !isNaN(priceValue) && priceValue <= maxPriceValue;
      });
    }

    setPromotions(filtered);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      store: '',
    });
    setPromotions(allPromotions);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <Head>
        <title>Todas as Promoções - Promohype</title>
        <meta name="description" content="Descubra todas as promoções nas principais lojas" />
      </Head>
      
      <MainTemplate title="Todas as Promoções">
        {/* Filtros */}
        <div className="bg-card rounded-xl shadow-md p-6 mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
              <select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Todas</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Geral">Geral</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Preço Mínimo</label>
              <Input 
                name="minPrice"
                type="number" 
                placeholder="R$ 0,00"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço Máximo</label>
              <Input 
                name="maxPrice"
                type="number" 
                placeholder="R$ 9999,99"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Loja</label>
              <select 
                name="store"
                value={filters.store}
                onChange={handleFilterChange}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Todas</option>
                <option value="Mercado Livre">Mercado Livre</option>
                <option value="Casas Bahia">Casas Bahia</option>
                <option value="Magazine Luiza">Magazine Luiza</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="mr-2" onClick={clearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={applyFilters}>Aplicar Filtros</Button>
          </div>
        </div>
        
        {/* Lista de promoções */}
        <PromotionList promotions={promotions} loading={loading} />
        
        {/* Paginação */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              ...
            </Button>
            <Button variant="outline" size="sm">
              10
            </Button>
            <Button variant="outline" size="sm">
              Próxima
            </Button>
          </nav>
        </div>
      </MainTemplate>
    </Layout>
  );
}