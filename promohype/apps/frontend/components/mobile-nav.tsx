import { Sheet, SheetContent, SheetTrigger } from '@/components/atoms/sheet';
import { Button } from '@/components/atoms/button';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export function MobileNav() {
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
          <Link href="/" className="text-base font-medium transition-colors hover:text-foreground/80">
            Início
          </Link>
          <details className="group">
            <summary className="flex justify-between items-center text-base font-medium cursor-pointer list-none">
              <span>Lojas</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="pl-4 mt-2 space-y-2">
              <Link href="/promotions" className="block text-base font-medium transition-colors hover:text-foreground/80">
                Todas as Promoções
              </Link>
              <Link href="/search" className="block text-base font-medium transition-colors hover:text-foreground/80">
                Buscar Promoções
              </Link>
              <Link href="/categories" className="block text-base font-medium transition-colors hover:text-foreground/80">
                Categorias
              </Link>
            </div>
          </details>
          <Link href="/about" className="text-base font-medium transition-colors hover:text-foreground/80">
            Sobre
          </Link>
          <Link href="/contact" className="text-base font-medium transition-colors hover:text-foreground/80">
            Contato
          </Link>
          <div className="pt-4 space-y-2">
            <Link href="/profile">
              <Button variant="outline" className="w-full">Perfil</Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" className="w-full">Entrar</Button>
            </Link>
            <Link href="/auth">
              <Button className="w-full">Cadastrar</Button>
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