import React from 'react';
import { Search, Shield, TrendingUp, Users, Award, Menu, Bell, Settings } from 'lucide-react';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-slate-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Plataforma Verificada e Segura</span>
            </span>
            <span>Suporte 24/7: (11) 9999-9999</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hover:text-blue-300 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="hover:text-blue-300 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <span>Empresa | Dashboard</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Professional */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    PromoHype
                  </h1>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    INTELLIGENCE PLATFORM
                  </p>
                </div>
              </div>
            </div>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#dashboard" className="text-gray-900 font-medium hover:text-blue-600 transition-colors border-b-2 border-blue-600 pb-1">
                Dashboard
              </a>
              <a href="#analytics" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
                Analytics
              </a>
              <a href="#marketplace" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
                Marketplace
              </a>
              <a href="#reports" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
                Relatórios
              </a>
              <a href="#enterprise" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">
                Enterprise
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Insights</span>
              </button>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
                Acessar Portal
              </button>
              
              <button className="lg:hidden p-2 text-gray-600 hover:text-gray-900">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
            <span className="text-gray-300">/</span>
            <a href="#" className="text-gray-500 hover:text-gray-700">Dashboard</a>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Análise de Promoções</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Home />
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">PromoHype</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">INTELLIGENCE PLATFORM</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Plataforma líder em inteligência de mercado para análise de preços e promoções. 
                Desenvolvida para empresas que precisam de dados precisos e insights acionáveis.
              </p>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">99.9%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                </div>
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">24/7</div>
                  <div className="text-xs text-gray-400">Suporte</div>
                </div>
                <div className="text-center p-4 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">ISO</div>
                  <div className="text-xs text-gray-400">Certificado</div>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Soluções</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Price Intelligence</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Market Analytics</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Competitive Insights</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API Integration</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Custom Dashboards</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Enterprise Security</a></li>
              </ul>
            </div>

            {/* Enterprise */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Enterprise</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contato Comercial</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentação API</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Centro de Suporte</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Status da Plataforma</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Serviço</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 lg:mb-0">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">ISO 27001</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-300">GDPR Compliant</span>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <p className="text-gray-400 text-sm">
                  © 2025 PromoHype Intelligence Platform. Todos os direitos reservados.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  PromoHype Inc. | CNPJ: 12.345.678/0001-90 | São Paulo, Brasil
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Professional Action Bar */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl transition-all duration-200 group"
          title="Voltar ao topo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
        
        <button 
          className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-full shadow-xl transition-all duration-200"
          title="Suporte"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;