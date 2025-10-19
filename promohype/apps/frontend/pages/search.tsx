import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import MainTemplate from '@/components/templates/MainTemplate';
import PromotionList from '@/components/organisms/PromotionList';
import { fetchPromotions, Promotion } from '@/services/api';

interface SearchSuggestion {
  id: string;
  term: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Simulação de sugestões de busca
  const allSuggestions: SearchSuggestion[] = [
    { id: '1', term: 'notebook' },
    { id: '2', term: 'smartphone' },
    { id: '3', term: 'smart tv' },
    { id: '4', term: 'fone de ouvido' },
    { id: '5', term: 'relógio inteligente' },
    { id: '6', term: 'câmera digital' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 0) {
      const filtered = allSuggestions.filter(suggestion => 
        suggestion.term.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setShowSuggestions(false);
    
    // Simulação de resultados de busca
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          _id: '1',
          title: `Notebook Ultrafino com Intel Core i7, 16GB RAM, 512GB SSD - ${query}`,
          price: 'R$ 3.499,99',
          link: '#',
          image: '',
          store: 'Loja A',
          relevance: 1
        },
        {
          _id: '2',
          title: `Smartphone Android com Tela de 6.7", 128GB, Câm. Tripla - ${query}`,
          price: 'R$ 1.899,99',
          link: '#',
          image: '',
          store: 'Loja B',
          relevance: 2
        },
        {
          _id: '3',
          title: `Smart TV 55" 4K UHD LED com Wi-Fi e Controle - ${query}`,
          price: 'R$ 2.499,99',
          link: '#',
          image: '',
          store: 'Loja C',
          relevance: 3
        },
        {
          _id: '4',
          title: `Fone de Ouvido Bluetooth com Cancelamento de Ruído - ${query}`,
          price: 'R$ 599,99',
          link: '#',
          image: '',
          store: 'Loja A',
          relevance: 4
        }
      ];
      setResults(mockResults);
      setLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Buscar - Promohype</title>
          <meta name="description" content="Busque promoções no Promohype" />
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Buscar Promoções</h1>
            
            <div className="relative">
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="O que você está procurando?"
                  className="w-full px-4 py-4 text-lg rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-5 rounded-full"
                  onClick={() => handleSearch()}
                >
                  Buscar
                </Button>
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleSuggestionClick(suggestion.term)}
                    >
                      {suggestion.term}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {results.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Resultados para "{searchQuery}"
                </h2>
                <span className="text-gray-600 dark:text-gray-400">
                  {results.length} resultados encontrados
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((result) => (
                  <Card key={result._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-5">
                      <div className="flex justify-center mb-4">
                        {result.image ? (
                          <img 
                            src={result.image} 
                            alt={result.title} 
                            className="w-full h-48 object-contain"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                            <span className="text-gray-500 dark:text-gray-400">Sem imagem</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 h-14">
                        {result.title}
                      </h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          {result.price}
                        </span>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {result.store}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <a 
                        href={result.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors duration-300 block"
                      >
                        Ver promoção
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                  <CardContent className="p-5">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-full h-48 mb-4" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                    <div className="mt-4">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!loading && results.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Nenhuma promoção encontrada para "{searchQuery}"
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Tente usar palavras-chave diferentes ou verifique a ortografia
              </p>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}