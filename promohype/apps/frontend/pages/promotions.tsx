import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import MainTemplate from '@/components/templates/MainTemplate';
import PromotionList from '@/components/organisms/PromotionList';
import { fetchPromotions, Promotion } from '@/services/api';

export default function PromotionsPage() {
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
              <select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todas</option>
                <option value="eletronics">Eletrônicos</option>
                <option value="fashion">Moda</option>
                <option value="home">Casa</option>
                <option value="sports">Esportes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço Mínimo</label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loja</label>
              <select 
                name="store"
                value={filters.store}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todas</option>
                <option value="Loja A">Loja A</option>
                <option value="Loja B">Loja B</option>
                <option value="Loja C">Loja C</option>
                <option value="Loja D">Loja D</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="mr-2">Limpar Filtros</Button>
            <Button>Aplicar Filtros</Button>
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
            <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
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