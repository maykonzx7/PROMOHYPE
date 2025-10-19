import Head from 'next/head';
import Layout from '@/components/layout';

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Sobre Nós - Promohype</title>
          <meta name="description" content="Saiba mais sobre o Promohype e nossa missão" />
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Sobre o Promohype</h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Nossa História</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Fundado em 2023, o Promohype nasceu da frustração de gastar horas procurando promoções espalhadas por 
                  diferentes lojas online. Nossa missão é economizar seu tempo e dinheiro, reunindo as melhores ofertas 
                  em um único lugar.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Hoje, somos uma plataforma líder em comparação de preços e rastreamento de promoções, ajudando 
                  milhares de consumidores a tomarem decisões de compra mais inteligentes.
                </p>
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Nossa Missão</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Tornar a busca por promoções mais eficiente e transparente, garantindo que nossos usuários sempre 
                  encontrem as melhores ofertas do mercado. Acreditamos que todos merecem aproveitar promoções 
                  exclusivas sem o estresse de pesquisar em dezenas de lojas diferentes.
                </p>
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Como Funcionamos</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Utilizamos tecnologia de ponta para rastrear milhares de produtos em tempo real nas principais lojas 
                  online. Nossos algoritmos identificam automaticamente promoções, descontos e ofertas especiais, 
                  apresentando-as de forma clara e organizada.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="text-blue-600 dark:text-blue-400 text-2xl mb-3">🔍</div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Rastreamento Inteligente</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Monitoramos constantemente preços em centenas de lojas para identificar promoções valiosas.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="text-blue-600 dark:text-blue-400 text-2xl mb-3">📊</div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Análise de Preços</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Comparamos preços históricos para garantir que você esteja vendo uma oferta real.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="text-blue-600 dark:text-blue-400 text-2xl mb-3">🔔</div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Alertas Personalizados</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Receba notificações quando produtos específicos atingirem seu preço ideal.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Perguntas Frequentes</h2>
                
                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Como o Promohype encontra promoções?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Utilizamos crawlers especializados que visitam milhares de lojas diariamente, coletando informações 
                      sobre preços, disponibilidade e ofertas especiais. Nossos algoritmos processam esses dados para 
                      identificar promoções valiosas.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">O Promohype ganha dinheiro com isso?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Sim, ganhamos comissões quando você compra um produto através dos links que disponibilizamos, 
                      mas isso não influencia na seleção ou classificação das promoções.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">As promoções são atualizadas em tempo real?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Sim, nossos sistemas atualizam as informações de preços e disponibilidade constantemente, 
                      garantindo que você tenha acesso às informações mais recentes.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}