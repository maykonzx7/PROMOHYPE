interface MainTemplateProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function MainTemplate({ title, children, description }: MainTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{title}</h1>
        {description && <p className="text-gray-600 dark:text-gray-300 mb-8">{description}</p>}
        {children}
      </main>
    </div>
  );
}