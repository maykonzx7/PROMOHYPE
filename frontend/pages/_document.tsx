import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR" suppressHydrationWarning>
      <Head />
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}