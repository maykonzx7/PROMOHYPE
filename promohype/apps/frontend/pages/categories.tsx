import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import MainTemplate from '@/components/templates/MainTemplate';
import CategoryList from '@/components/organisms/CategoryList';
import { fetchCategories, Category } from '@/services/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Categorias - Promohype</title>
        <meta name="description" content="Descubra promoções por categoria" />
      </Head>
      
      <MainTemplate title="Categorias">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-300">Carregando categorias...</p>
          </div>
        ) : (
          <CategoryList categories={categories} />
        )}
      </MainTemplate>
    </Layout>
  );
}