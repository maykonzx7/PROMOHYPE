import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import MainTemplate from '@/components/templates/MainTemplate';
import PromotionList from '@/components/organisms/PromotionList';
import { Promotion } from '@/services/api';
import { Card, CardContent } from '@/components/atoms/card';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Em um sistema real, buscaria os favoritos do backend
    // Por enquanto, busca do localStorage
    const savedFavorites = localStorage.getItem('promohype_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleRemoveFavorite = (id: string) => {
    const updated = favorites.filter(fav => fav._id !== id);
    setFavorites(updated);
    localStorage.setItem('promohype_favorites', JSON.stringify(updated));
  };

  return (
    <Layout>
      <MainTemplate title="Meus Favoritos">
        <Head>
          <title>Favoritos - Promohype</title>
          <meta name="description" content="Suas promoções favoritas" />
        </Head>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Carregando favoritos...</p>
          </div>
        ) : favorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-2">
                Você ainda não tem favoritos salvos
              </p>
              <p className="text-sm text-muted-foreground/70">
                Adicione promoções aos seus favoritos para acessá-las facilmente depois
              </p>
            </CardContent>
          </Card>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {favorites.length} {favorites.length === 1 ? 'promoção favorita' : 'promoções favoritas'}
              </p>
            </div>
            <PromotionList promotions={favorites} loading={false} />
          </div>
        )}
      </MainTemplate>
    </Layout>
  );
}

