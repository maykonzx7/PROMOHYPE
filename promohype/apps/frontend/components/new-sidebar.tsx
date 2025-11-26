'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Home, 
  Tag, 
  Tags, 
  Search, 
  Star, 
  LogIn,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/atoms/button';
import { Separator } from '@/components/atoms/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/atoms/tooltip';

// Menu items principais
const mainItems = [
  {
    title: "Início",
    url: "/",
    icon: Home,
  },
  {
    title: "Promoções",
    url: "/promotions",
    icon: Tag,
  },
  {
    title: "Categorias",
    url: "/categories",
    icon: Tags,
  },
  {
    title: "Busca",
    url: "/search",
    icon: Search,
  },
];

// Menu items removidos - não necessários no momento

// Componente para item do menu com indicação ativa
function SidebarNavItem({ 
  item, 
  isActive 
}: { 
  item: typeof mainItems[0]; 
  isActive: boolean;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const buttonContent = (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className={cn(
        "relative group/item transition-all duration-200",
        isActive && "bg-accent text-foreground font-medium",
        !isActive && "text-muted-foreground",
        "hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <Link href={item.url} className="flex items-center gap-3 w-full">
        <item.icon className={cn(
          "h-5 w-5 transition-transform duration-200",
          isActive && "scale-110",
          "group-hover/item:scale-105"
        )} />
        <span className="group-data-[collapsible=icon]:hidden transition-opacity duration-200">
          {item.title}
        </span>
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-foreground rounded-r-full group-data-[collapsible=icon]:hidden" />
        )}
      </Link>
    </SidebarMenuButton>
  );

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-2">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
}

export function NewSidebar() {
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (url: string) => {
    if (url === "/") {
      return router.pathname === "/";
    }
    return router.pathname?.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="px-4 py-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-8 w-8 hover:bg-accent/50 transition-colors" />
          <div className={cn(
            "flex items-center gap-2 transition-opacity duration-200",
            "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:pointer-events-none"
          )}>
            <div className="h-8 w-8 rounded-lg bg-foreground/10 flex items-center justify-center border border-border/50">
              <Sparkles className="h-4 w-4 text-foreground" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-foreground leading-tight">Promohype</h2>
              <span className="text-xs text-muted-foreground leading-tight">Promoções</span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarNavItem item={item} isActive={isActive(item.url)} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      
      <SidebarFooter className="px-3 py-4 border-t border-border/40">
        <div className={cn(
          "transition-opacity duration-200",
          "group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:hidden"
        )}>
          <Link href="/auth" className="block">
            <Button className="w-full gap-2" size="sm" variant="outline">
              <LogIn className="h-4 w-4" />
              Entrar / Cadastrar
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}