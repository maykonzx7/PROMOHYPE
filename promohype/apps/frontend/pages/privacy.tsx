import Head from 'next/head';
import Layout from '@/components/layout';

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Política de Privacidade - Promohype</title>
          <meta name="description" content="Política de privacidade do Promohype" />
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Política de Privacidade</h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Informações que Coletamos</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Coletamos informações para fornecer um serviço melhor e mais personalizado para nossos usuários. 
                  As categorias de informações que podemos coletar incluem:
                </p>
                
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                  <li><strong>Informações que você nos fornece:</strong> Quando você cria uma conta, se inscreve em 
                    notificações ou entra em contato conosco, podemos coletar informações como seu nome, e-mail e 
                    preferências.</li>
                  <li><strong>Informações de uso:</strong> Coletamos informações sobre como você interage com o 
                    Promohype, incluindo páginas visitadas, promoções visualizadas e tempo de permanência no site.</li>
                  <li><strong>Informações técnicas:</strong> Coletamos automaticamente informações sobre seu 
                    dispositivo e conexão, como tipo de navegador, sistema operacional e endereço IP.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Como Usamos suas Informações</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Usamos as informações coletadas para:
                </p>
                
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                  <li>Fornecer e manter nosso serviço</li>
                  <li>Personalizar sua experiência de uso</li>
                  <li>Enviar notificações sobre promoções relevantes</li>
                  <li>Realizar análises e melhorias no serviço</li>
                  <li>Garantir a segurança e integridade do serviço</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Compartilhamento de Informações</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Não vendemos, comercializamos ou alugamos suas informações pessoais. Podemos compartilhar 
                  informações em situações específicas:
                </p>
                
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                  <li><strong>Com provedores de serviço:</strong> Compartilhamos informações com provedores 
                    terceirizados que auxiliam na operação do site, condução de negócios ou prestação de serviços 
                    aos usuários, desde que concordem em manter as informações confidenciais.</li>
                  <li><strong>Para cumprimento legal:</strong> Podemos divulgar suas informações caso 
                    necessário para cumprir com processos legais ou proteger nossos direitos.</li>
                  <li><strong>Com lojas parceiras:</strong> Podemos compartilhar informações agregadas e 
                    anônimas com lojas parceiras para fins estatísticos e de mercado.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Cookies e Tecnologias Semelhantes</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência de navegação, 
                  lembrar de suas preferências e compreender como você utiliza nosso site. Você pode configurar 
                  seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo enviado.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Segurança das Informações</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Adotamos medidas de segurança técnicas, administrativas e físicas apropriadas para proteger 
                  suas informações contra acesso não autorizado, alteração, divulgação ou destruição. 
                  No entanto, nenhum método de transmissão ou armazenamento eletrônico é 100% seguro.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Seus Direitos</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Dependendo da sua localização, você pode ter os seguintes direitos sobre suas informações pessoais:
                </p>
                
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                  <li>O direito de solicitar acesso às suas informações pessoais</li>
                  <li>O direito de solicitar a correção de informações imprecisas</li>
                  <li>O direito de solicitar a exclusão de suas informações pessoais</li>
                  <li>O direito de solicitar a limitação do processamento de suas informações</li>
                  <li>O direito de portabilidade dos dados</li>
                </ul>
                
                <p className="text-gray-700 dark:text-gray-300">
                  Para exercer esses direitos, entre em contato conosco através do e-mail privacy@promohype.com
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Crianças</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Nosso serviço não se destina a menores de 13 anos. Não coletamos conscientemente informações 
                  pessoais de crianças menores de 13 anos. Se você é pai ou responsável e acredita que seu filho 
                  nos forneceu informações pessoais, entre em contato conosco para que possamos tomar as medidas 
                  necessárias.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Modificações desta Política</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre 
                  quaisquer alterações publicando a nova política na página e atualizando a data de "Última atualização". 
                  O uso contínuo do site após as modificações constitui aceitação da política atualizada.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Contato</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  E-mail: privacy@promohype.com<br />
                  Endereço: Av. Paulista, 1000, São Paulo, SP, 01310-100
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}