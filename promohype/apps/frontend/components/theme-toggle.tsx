"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar flash durante hidratação
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  // Usar resolvedTheme para verificar o tema real (resolve "system" para "light" ou "dark")
  const currentTheme = resolvedTheme || theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Toggle theme">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[100]">
        <DropdownMenuItem 
          onClick={() => {
            setTheme("light");
            console.log("Tema alterado para: light");
          }}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
          {currentTheme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => {
            setTheme("dark");
            console.log("Tema alterado para: dark");
          }}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro</span>
          {currentTheme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => {
            setTheme("system");
            console.log("Tema alterado para: system");
          }}
        >
          <span>Sistema</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}