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
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Ver detalhes de ${promotion.title}`}
    >
      <CardContent className="p-5">
        <div className="flex justify-center mb-4">
          {promotion.image ? (
            <img 
              src={promotion.image} 
              alt={promotion.title} 
              className="w-full h-48 object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center rounded-lg">
              <span className="text-muted-foreground">Sem imagem</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2 h-14">
          {promotion.title}
        </h3>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            {promotion.price}
          </span>
          <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-0.5 rounded">
            {promotion.store}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Ver promoção de ${promotion.title} na ${promotion.store}`}
        >
          <a 
            href={promotion.link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Ver promoção
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}