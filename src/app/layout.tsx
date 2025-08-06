import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calculadora de Precificação Inteligente',
  description: 'Ferramenta completa para calcular preços de venda, analisar custos e maximizar lucros. Ideal para pequenos empreendedores, MEIs e autônomos.',
  keywords: 'precificação, calculadora, lucro, custos, preço de venda, margem, empreendedorismo, MEI',
  authors: [{ name: 'Calculadora de Precificação' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Calculadora de Precificação Inteligente',
    description: 'Simplifique sua gestão financeira com nossa calculadora de precificação. Calcule preços ideais, analise custos e maximize seus lucros.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}