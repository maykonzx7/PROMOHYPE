import { Card, CardContent, CardFooter } from '@/components/atoms/card';
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

interface PromotionCardProps {
  promotion: Promotion;
  onPromotionClick?: (promotion: Promotion) => void;
}

export default function PromotionCard({ 
  promotion, 
  onPromotionClick 
}: PromotionCardProps) {
  const handleClick = () => {
    if (onPromotionClick) {
      onPromotionClick(promotion);
    }
  };

  return (
    <Card 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={handleClick}
    >
      <CardContent className="p-5">
        <div className="flex justify-center mb-4">
          {promotion.image ? (
            <img 
              src={promotion.image} 
              alt={promotion.title} 
              className="w-full h-48 object-contain"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">Sem imagem</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 h-14">
          {promotion.title}
        </h3>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            {promotion.price}
          </span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
            {promotion.store}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <a 
          href={promotion.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors duration-300 block"
          onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up to the card
        >
          Ver promoção
        </a>
      </CardFooter>
    </Card>
  );
}