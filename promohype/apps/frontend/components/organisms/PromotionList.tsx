import { useState } from 'react';
import PromotionCard from '../molecules/PromotionCard';
import { Button } from '@/components/atoms/button';

interface Promotion {
  _id: string;
  title: string;
  price: string;
  link: string;
  image: string;
  store: string;
  scrapedAt: string;
}

interface PromotionListProps {
  promotions: Promotion[];
  loading?: boolean;
  onPromotionClick?: (promotion: Promotion) => void;
}

export default function PromotionList({ 
  promotions, 
  loading = false, 
  onPromotionClick 
}: PromotionListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="p-5">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-full h-48 mb-4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
              <div className="mt-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-300">Nenhuma promoção encontrada</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {promotions.map((promotion) => (
        <PromotionCard 
          key={promotion._id} 
          promotion={promotion} 
          onPromotionClick={onPromotionClick}
        />
      ))}
    </div>
  );
}