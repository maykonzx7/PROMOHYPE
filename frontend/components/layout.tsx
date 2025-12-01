'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/atoms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import {
  SidebarProvider,
  SidebarInset
} from '@/components/ui/sidebar';
import { NewSidebar } from '@/components/new-sidebar';
import { TooltipProvider } from '@/components/atoms/tooltip';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={100}>
      <SidebarProvider>
        <NewSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
            <div className="flex h-14 items-center justify-end px-4 gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:block">
                  <Button variant="ghost" size="sm" className="relative">
                    <span className="absolute w-2 h-2 bg-green-500 rounded-full top-2 right-2 ring-2 ring-background"></span>
                    Perfil
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Meu Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites">Favoritos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth?logout=1">Sair</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ThemeToggle />
            </div>
          </header>
        <main className="flex-1 w-full">
          {children}
        </main>
        <footer className="py-6 border-t bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Promohype</h3>
                <p className="text-sm text-muted-foreground">
                  Encontre as melhores promoções nas principais lojas online.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Navegação</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Início</Link></li>
                  <li><Link href="/promotions" className="text-sm text-muted-foreground hover:text-foreground">Promoções</Link></li>
                  <li><Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground">Categorias</Link></li>
                  <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">Sobre</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Termos de Uso</Link></li>
                  <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Política de Privacidade</Link></li>
                  <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contato</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Redes Sociais</h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://facebook.com/promohype" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Visite nossa página no Facebook"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://instagram.com/promohype" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Visite nosso perfil no Instagram"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://twitter.com/promohype" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Visite nosso perfil no Twitter"
                    >
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Promohype. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  );
}