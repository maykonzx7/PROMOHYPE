import { Sheet, SheetContent, SheetTrigger } from '@/components/atoms/sheet';
import { Button } from '@/components/atoms/button';
import { Menu, Home, Tag, Tags, ShoppingCart, BarChart3, Settings, User, Search, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export function MobileNav() {
  const navItems = [
    { title: "Início", url: "/", icon: Home },
    { title: "Promoções", url: "/promotions", icon: Tag },
    { title: "Categorias", url: "/categories", icon: Tags },
    { title: "Busca", url: "/search", icon: Search },
    { title: "Favoritos", url: "/profile", icon: Star },
    { title: "Relatórios", url: "/", icon: BarChart3 },
    { title: "Configurações", url: "/settings", icon: Settings },
  ];

  const accountItems = [
    { title: "Perfil", url: "/profile", icon: User },
    { title: "Pedidos", url: "/orders", icon: ShoppingCart },
    { title: "Histórico", url: "/history", icon: ShoppingCart },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <div className="mt-4 flex flex-col space-y-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.title} 
                href={item.url} 
                className="flex items-center gap-2 text-base font-medium transition-colors hover:text-foreground/80"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
          
          <div className="pt-4 space-y-2 border-t pt-4">
            <h3 className="text-sm font-semibold">Minha Conta</h3>
            {accountItems.map((item) => (
              <Link 
                key={item.title} 
                href={item.url} 
                className="flex items-center gap-2 text-base font-medium transition-colors hover:text-foreground/80"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
          
          <div className="pt-4 space-y-2">
            <Link href="/auth">
              <Button variant="default" className="w-full">Entrar / Cadastrar</Button>
            </Link>
          </div>
        </div>
        <div className="mt-auto pt-6">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}