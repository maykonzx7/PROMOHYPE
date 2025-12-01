import Head from 'next/head';
import Layout from '@/components/layout';

export default function OrdersPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Head>
          <title>Meus Pedidos - Promohype</title>
          <meta name="description" content="Veja seus pedidos recentes" />
        </Head>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12 text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Pedidos</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Histórico de todos os seus pedidos realizados
              </p>
            </header>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400">
                Você ainda não tem nenhum pedido registrado.
              </p>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}