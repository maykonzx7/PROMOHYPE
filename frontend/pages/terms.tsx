import Head from 'next/head';
import Layout from '@/components/layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Termos de Uso - Promohype</title>
          <meta name="description" content="Termos de uso do Promohype" />
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Termos de Uso</h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Ao acessar e usar o site Promohype, você concorda com estes Termos de Uso e com a nossa Política de Privacidade. 
                  Se você não concordar com estes termos, por favor, não utilize nosso site.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Uso do Serviço</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  O Promohype oferece um serviço de comparação de preços e rastreamento de promoções. Não somos responsáveis 
                  pelas informações fornecidas pelas lojas parceiras e não garantimos a disponibilidade ou exatidão dos 
                  produtos anunciados.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Você concorda em usar o serviço apenas para fins legais e de acordo com estes Termos de Uso.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Propriedade Intelectual</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Todo o conteúdo disponível no site Promohype, incluindo textos, gráficos, logotipos, ícones, imagens e 
                  softwares, é de propriedade exclusiva do Promohype e está protegido pelas leis de propriedade intelectual.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  É proibido copiar, reproduzir, distribuir ou modificar qualquer parte deste site sem autorização prévia por escrito.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Links para Terceiros</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Nosso site pode conter links para sites de terceiros. Não temos controle sobre o conteúdo desses sites 
                  e não somos responsáveis por quaisquer práticas de privacidade ou termos de uso dessas plataformas.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Recomendamos que você leia os termos de uso e políticas de privacidade de qualquer site de terceiros 
                  que você visitar.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Limitação de Responsabilidade</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  O Promohype não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais 
                  decorrentes do uso ou incapacidade de uso do nosso serviço.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Não garantimos que o site estará disponível em todos os momentos ou que estará livre de erros.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Modificações</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão 
                  em vigor imediatamente após serem publicadas no site. O uso contínuo do site após as modificações 
                  constitui aceitação dos termos atualizados.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Lei Aplicável</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Estes Termos de Uso serão regidos pelas leis da República Federativa do Brasil, e eventuais disputas 
                  serão resolvidas nos fóruns competentes da Comarca de São Paulo/SP.
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}