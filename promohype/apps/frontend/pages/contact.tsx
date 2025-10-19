import Head from 'next/head';
import Layout from '@/components/layout';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';

export default function ContactPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Contato - Promohype</title>
          <meta name="description" content="Entre em contato conosco" />
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contato</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Entre em Contato</h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-8">
                  Tem alguma dúvida, sugestão ou precisa de suporte? Estamos aqui para ajudar! Preencha o formulário ao lado 
                  ou entre em contato através dos nossos canais abaixo.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">E-mail</h3>
                    <p className="text-gray-700 dark:text-gray-300">suporte@promohype.com</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Telefone</h3>
                    <p className="text-gray-700 dark:text-gray-300">(11) 99999-9999</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Endereço</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Av. Paulista, 1000<br />
                      São Paulo, SP<br />
                      01310-100
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Redes Sociais</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Facebook</a>
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Instagram</a>
                      <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Twitter</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Envie uma Mensagem</h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                    <Input id="name" name="name" type="text" placeholder="Seu nome" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assunto</label>
                    <Input id="subject" name="subject" type="text" placeholder="Assunto da mensagem" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem</label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Sua mensagem..."
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Enviar Mensagem</Button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}