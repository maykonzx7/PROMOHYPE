// pages/api/promotions.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface Promotion {
  _id: string;
  title: string;
  price: string;
  link: string;
  image: string;
  store: string;
  scrapedAt: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Promotion[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Em um ambiente real, esta URL seria uma variável de ambiente
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'; // Substitua pela URL real do backend
    const response = await fetch(`${backendUrl}/api/promotions`);
    
    if (!response.ok) {
      throw new Error(`Erro na resposta do backend: ${response.status}`);
    }
    
    const promotions: Promotion[] = await response.json();
    res.status(200).json(promotions);
  } catch (error) {
    console.error('Erro ao buscar promoções:', error);
    res.status(500).json({ error: 'Erro ao buscar promoções' });
  }
}