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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-transparent group-hover:border-blue-500">
        <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{category.count} promoções</p>
      </div>
    </Link>
  );
}