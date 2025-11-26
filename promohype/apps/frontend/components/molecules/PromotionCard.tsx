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
  installments?: number;
  installmentValue?: string;
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
        
        {/* Preço e Loja */}
        <div className="flex justify-between items-center mt-4 mb-3">
          <span className="text-xl font-bold text-green-600 dark:text-green-400">
            {promotion.price}
          </span>
          <span className="bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-0.5 rounded">
            {promotion.store}
          </span>
        </div>

        {/* Parcelamento - Exibição Visual */}
        {(promotion.installments || promotion.installmentValue) && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-primary">
                    {promotion.installments || 'N/A'}
                  </span>
                  <span className="text-sm text-muted-foreground">x</span>
                </div>
                {promotion.installmentValue && (
                  <span className="text-sm text-foreground">
                    {promotion.installmentValue.includes('sem juros') || 
                     promotion.installmentValue.toLowerCase().includes('sem juro') ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        sem juros
                      </span>
                    ) : (
                      <span className="text-muted-foreground">com juros</span>
                    )}
                  </span>
                )}
              </div>
              {promotion.installmentValue && (
                <div className="flex items-center gap-1">
                  {promotion.installmentValue.includes('sem juros') || 
                   promotion.installmentValue.toLowerCase().includes('sem juro') ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                      <span>✓</span>
                      <span>Sem Juros</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full">
                      <span>ℹ</span>
                      <span>Com Juros</span>
                    </span>
                  )}
                </div>
              )}
            </div>
            {promotion.installmentValue && (
              <div className="mt-2 text-xs text-muted-foreground">
                {promotion.installmentValue}
              </div>
            )}
          </div>
        )}
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