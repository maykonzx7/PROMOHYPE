import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/card';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular processo de autenticação
    console.log(isLogin ? 'Login realizado' : 'Cadastro realizado', formData);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>{isLogin ? 'Login' : 'Cadastro'} - Promohype</title>
          <meta name="description" content={`Faça ${isLogin ? 'login' : 'cadastro'} no Promohype`} />
        </Head>
        
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Card className="w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {isLogin ? 'Entrar no Promohype' : 'Criar Conta'}
                </CardTitle>
                <CardDescription>
                  {isLogin 
                    ? 'Acesse sua conta para ver promoções personalizadas' 
                    : 'Crie uma conta para salvar promoções e receber alertas'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        required={!isLogin}
                      />
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Senha
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Sua senha"
                      required
                    />
                  </div>
                  
                  {!isLogin && (
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirmar Senha
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirme sua senha"
                        required={!isLogin}
                      />
                    </div>
                  )}
                  
                  {isLogin && (
                    <div className="flex justify-end mb-4">
                      <a href="/reset-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Esqueceu sua senha?
                      </a>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full">
                    {isLogin ? 'Entrar' : 'Cadastrar'}
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col">
                <div className="relative w-full mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continue com
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    Facebook
                  </Button>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                  <a 
                    href="#" 
                    className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLogin(!isLogin);
                    }}
                  >
                    {isLogin ? 'Crie uma conta' : 'Faça login'}
                  </a>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </Layout>
  );
}