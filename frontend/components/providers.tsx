"use client";

import { ThemeProvider } from '@/lib/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      storageKey="promohype-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}