interface MainTemplateProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function MainTemplate({ title, children, description }: MainTemplateProps) {
  return (
    <div className="w-full min-h-screen bg-background py-8 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {title && <h1 className="text-3xl font-bold text-foreground mb-8">{title}</h1>}
        {description && <p className="text-muted-foreground mb-8">{description}</p>}
        {children}
      </div>
    </div>
  );
}