interface PromotionDetailTemplateProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function PromotionDetailTemplate({ children, title, description }: PromotionDetailTemplateProps) {
  return (
    <div className="w-full min-h-screen bg-background py-8 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}