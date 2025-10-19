interface PromotionDetailTemplateProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function PromotionDetailTemplate({ children, title, description }: PromotionDetailTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}