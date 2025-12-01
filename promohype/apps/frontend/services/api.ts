// services/api.ts
export interface Promotion {
  _id: string;
  title: string;
  price: string;
  link: string;
  image: string;
  store: string;
  scrapedAt: string;
  description?: string;
  originalPrice?: string;
  currentPrice?: string;
  discount?: string;
  availability?: boolean;
  installments?: number;
  installmentValue?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
}

// Base API URL - usando variável de ambiente ou default local
// Em produção (Vercel), configure NEXT_PUBLIC_API_BASE_URL, ex:
// https://promohype-backend.vercel.app
// Em desenvolvimento, o default aponta para o backend local na porta 5000
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Fetch all promotions
export const fetchPromotions = async (): Promise<Promotion[]> => {
  try {
    const url = `${API_BASE_URL}/api/promotions`;
    console.log('🔍 Buscando promoções em:', url);
    const response = await fetch(url);
    console.log('📡 Resposta recebida:', response.status, response.statusText);
    if (!response.ok) {
      throw new Error(`Erro ao buscar promoções: ${response.status}`);
    }
    const data = await response.json();
    console.log('✅ Promoções recebidas:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar promoções:', error);
    throw error;
  }
};

// Fetch promotions by category
export const fetchPromotionsByCategory = async (category: string): Promise<Promotion[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/promotions?category=${category}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar promoções por categoria: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar promoções por categoria:', error);
    throw error;
  }
};

// Fetch promotions by search query
export const fetchPromotionsBySearch = async (query: string): Promise<Promotion[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/promotions?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar promoções: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar promoções por busca:', error);
    throw error;
  }
};

// Fetch promotion by ID
export const fetchPromotionById = async (id: string): Promise<Promotion> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/promotions/${id}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar promoção: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar promoção:', error);
    throw error;
  }
};

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`); // Endpoint de categorias
    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    // Return default categories if the endpoint doesn't exist
    return [
      { id: 'eletronics', name: 'Eletrônicos', count: 245, image: '' },
      { id: 'fashion', name: 'Moda', count: 198, image: '' },
      { id: 'home', name: 'Casa & Cozinha', count: 156, image: '' },
      { id: 'sports', name: 'Esportes', count: 123, image: '' },
      { id: 'books', name: 'Livros', count: 98, image: '' },
      { id: 'health', name: 'Saúde & Beleza', count: 142, image: '' },
      { id: 'toys', name: 'Brinquedos', count: 76, image: '' },
      { id: 'automotive', name: 'Automotivo', count: 65, image: '' },
    ];
  }
};