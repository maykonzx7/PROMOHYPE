# Sistema de Scraping - Promohype

## 📋 Visão Geral

Sistema de scraping completo e robusto para buscar promoções de múltiplas lojas online:
- **Mercado Livre**
- **Magazine Luiza (Magalu)**
- **Casas Bahia**

## 🚀 Como Usar

### 1. Via Script NPM

```bash
npm run scrape
```

Isso executará o scraping de todas as lojas e salvará as promoções no banco de dados.

### 2. Via API (Requer Autenticação)

```bash
POST http://localhost:5000/api/scraping/run
Content-Type: application/json
Authorization: Bearer <token>

{
  "searchTerms": ["smartphone", "notebook", "tv", "headphone", "tablet"]
}
```

### 3. Verificar Estatísticas

```bash
GET http://localhost:5000/api/scraping/stats
```

Retorna:
- Total de promoções
- Promoções das últimas 24h
- Estatísticas por loja

## 🏗️ Estrutura

```
backend/
├── scraping/
│   ├── mercadoLivre.js    # Scraper Mercado Livre
│   ├── magalu.js          # Scraper Magazine Luiza
│   ├── casasBahia.js      # Scraper Casas Bahia
│   └── searchhype.js      # Serviço centralizado
├── services/
│   └── savepromotion.js   # Salva promoções no banco
└── routes/
    └── scraping.js        # Rotas da API
```

## ✨ Funcionalidades

### ✅ Prevenção de Duplicatas
- Verifica se a promoção já existe antes de salvar
- Baseado em: link, título + loja
- Atualiza promoções existentes se o preço mudou

### ✅ Tratamento de Erros
- Cada scraper executa independentemente
- Erros em uma loja não afetam as outras
- Logs detalhados de erros

### ✅ Performance
- Execução paralela de scrapers
- Desabilita imagens para acelerar
- Timeouts configuráveis
- Limite de produtos por busca

### ✅ Dados Coletados
- Título do produto
- Preço atual
- Link do produto
- Imagem
- Loja
- Categoria
- Disponibilidade

## 🔧 Configuração

### Variáveis de Ambiente

```env
MONGO_URI=mongodb://localhost:27017/promohype
PORT=5000
```

### Customizar Termos de Busca

Edite os arquivos de scraper para mudar os termos de busca padrão:

```javascript
// Cada scraper aceita um array de termos
scrapeMercadoLivre(['smartphone', 'notebook', 'tv'])
```

## 📊 Melhorias Implementadas

1. **Scrapers Robustos**
   - Múltiplos seletores CSS (fallbacks)
   - Tratamento de diferentes estruturas HTML
   - Timeouts e retries

2. **Sistema Centralizado**
   - Um único ponto de entrada
   - Execução paralela
   - Agregação de resultados

3. **Prevenção de Duplicatas**
   - Verificação antes de salvar
   - Atualização inteligente
   - Normalização de links

4. **API Integrada**
   - Endpoint para executar scraping
   - Estatísticas em tempo real
   - Autenticação para proteção

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "MongoDB connection failed"
Verifique se o MongoDB está rodando e a URI está correta.

### Scraping retorna poucos resultados
- Os sites podem ter mudado a estrutura HTML
- Verifique os seletores CSS nos scrapers
- Tente executar manualmente um scraper específico

### Timeout errors
- Aumente os timeouts nos scrapers
- Verifique sua conexão com internet
- Alguns sites podem estar bloqueando bots

## 🔄 Próximas Melhorias

- [ ] Adicionar mais lojas (Amazon, Americanas, etc)
- [ ] Sistema de agendamento (cron jobs)
- [ ] Cache de resultados
- [ ] Notificações quando encontrar promoções
- [ ] Dashboard de monitoramento
- [ ] Rate limiting inteligente

