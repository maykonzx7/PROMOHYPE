import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import MainTemplate from '@/components/templates/MainTemplate';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '(11) 99999-9999',
    preferences: {
      notifications: true,
      weeklyNewsletter: true,
      priceAlerts: true
    }
  });

  const [savedPromotions, setSavedPromotions] = useState([
    {
      id: '1',
      title: 'Notebook Ultrafino com Intel Core i7',
      price: 'R$ 3.499,99',
      store: 'Mercado Livre',
      date: '2023-05-15'
    },
    {
      id: '2',
      title: 'Smart TV 55" 4K UHD',
      price: 'R$ 2.499,99',
      store: 'Magazine Luiza',
      date: '2023-05-18'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (preference: string) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference as keyof typeof prev.preferences]
      }
    }));
  };

  return (
    <Layout>
      <MainTemplate title="Perfil do Usuário">
        <Head>
          <title>Perfil - Promohype</title>
          <meta name="description" content="Gerencie seu perfil no Promohype" />
        </Head>
        
        <div className="max-w-4xl mx-auto">
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="preferences">Preferências</TabsTrigger>
                <TabsTrigger value="saved">Promoções Salvas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Perfil</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-6">
                      <div className="bg-muted border-2 border-dashed rounded-xl w-16 h-16" />
                      <Button variant="outline">Alterar Foto</Button>
                    </div>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                        Nome
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={userData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                        E-mail
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                        Telefone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="text"
                        value={userData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex space-x-4 pt-4">
                      <Button>Salvar Alterações</Button>
                      <Button variant="outline">Cancelar</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências de Conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">Notificações</h3>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações sobre promoções relevantes
                        </p>
                      </div>
                      <Button
                        variant={userData.preferences.notifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange('notifications')}
                      >
                        {userData.preferences.notifications ? 'Ativado' : 'Desativado'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Newsletter Semanal</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receber relatório semanal com as melhores promoções
                        </p>
                      </div>
                      <Button
                        variant={userData.preferences.weeklyNewsletter ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange('weeklyNewsletter')}
                      >
                        {userData.preferences.weeklyNewsletter ? 'Ativado' : 'Desativado'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Alertas de Preço</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receber alertas quando produtos atingirem seu preço ideal
                        </p>
                      </div>
                      <Button
                        variant={userData.preferences.priceAlerts ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange('priceAlerts')}
                      >
                        {userData.preferences.priceAlerts ? 'Ativado' : 'Desativado'}
                      </Button>
                    </div>
                    
                    <div className="pt-4">
                      <Button>Salvar Preferências</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="saved" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Minhas Promoções Salvas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {savedPromotions.length > 0 ? (
                      <div className="space-y-4">
                        {savedPromotions.map((promotion) => (
                          <div 
                            key={promotion.id} 
                            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50"
                          >
                            <div>
                              <h3 className="font-medium text-foreground">{promotion.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {promotion.store} • {new Date(promotion.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {promotion.price}
                              </span>
                              <Button size="sm">Comprar</Button>
                              <Button variant="outline" size="sm">Remover</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Você ainda não salvou nenhuma promoção.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </MainTemplate>
    </Layout>
  );
}