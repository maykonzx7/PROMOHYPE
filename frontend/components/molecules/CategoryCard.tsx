import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`/promotions?category=${category.id}`}
      className="block group"
    >
      <div className="bg-card rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-border group-hover:border-foreground/20">
        <div className="bg-muted border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-card-foreground mb-2">{category.name}</h3>
        <p className="text-muted-foreground text-sm">{category.count} promoções</p>
      </div>
    </Link>
  );
}