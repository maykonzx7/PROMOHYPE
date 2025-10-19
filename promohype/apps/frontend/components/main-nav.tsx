import * as React from 'react';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { Button } from '@/components/atoms/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/atoms/navigation-menu';
import { cn } from '@/lib/utils';

export function MainNav({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between md:justify-normal md:space-x-8 ${className}`}>
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-xl font-bold">Promohype</span>
      </Link>
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={({ isActive }) => 
                cn("text-sm font-medium transition-colors hover:text-foreground/80", 
                  isActive ? 'text-foreground' : 'text-muted-foreground')
              }>
                Início
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium transition-colors hover:text-foreground/80 text-muted-foreground">
              Lojas
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Promohype
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        As melhores promoções em um só lugar
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/search" title="Buscar Promoções">
                  Encontre promoções em todas as lojas
                </ListItem>
                <ListItem href="/promotions" title="Todas as Promoções">
                  Veja todas as promoções disponíveis
                </ListItem>
                <ListItem href="/categories" title="Categorias">
                  Navegue por categorias de produtos
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/about" legacyBehavior passHref>
              <NavigationMenuLink className={({ isActive }) => 
                cn("text-sm font-medium transition-colors hover:text-foreground/80", 
                  isActive ? 'text-foreground' : 'text-muted-foreground')
              }>
                Sobre
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink className={({ isActive }) => 
                cn("text-sm font-medium transition-colors hover:text-foreground/80", 
                  isActive ? 'text-foreground' : 'text-muted-foreground')
              }>
                Contato
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <MobileNav />
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem";