import Head from 'next/head';
import Layout from '@/components/layout';
import MainTemplate from '@/components/templates/MainTemplate';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';

export default function ContactPage() {
  return (
    <Layout>
      <MainTemplate title="Contato">
        <Head>
          <title>Contato - Promohype</title>
          <meta name="description" content="Entre em contato conosco" />
        </Head>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Entre em Contato</h2>
              
              <p className="text-muted-foreground mb-8">
                Tem alguma dúvida, sugestão ou precisa de suporte? Estamos aqui para ajudar! Preencha o formulário ao lado 
                ou entre em contato através dos nossos canais abaixo.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">E-mail</h3>
                  <p className="text-muted-foreground">suporte@promohype.com</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Telefone</h3>
                  <p className="text-muted-foreground">(11) 99999-9999</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Endereço</h3>
                  <p className="text-muted-foreground">
                    Av. Paulista, 1000<br />
                    São Paulo, SP<br />
                    01310-100
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Redes Sociais</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-foreground hover:text-primary transition-colors">Facebook</a>
                    <a href="#" className="text-foreground hover:text-primary transition-colors">Instagram</a>
                    <a href="#" className="text-foreground hover:text-primary transition-colors">Twitter</a>
                  </div>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Nome</label>
                    <Input id="name" name="name" type="text" placeholder="Seu nome" />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">E-mail</label>
                    <Input id="email" name="email" type="email" placeholder="seu@email.com" />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">Assunto</label>
                    <Input id="subject" name="subject" type="text" placeholder="Assunto da mensagem" />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Mensagem</label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Sua mensagem..."
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Enviar Mensagem</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainTemplate>
    </Layout>
  );
}