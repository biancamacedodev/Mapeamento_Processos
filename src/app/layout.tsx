import 'reflect-metadata';
import { Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import '@/styles/globals.css';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mapeamento de Processos',
  description: 'Sistema de mapeamento de processos e subprocessos empresariais',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="container">
          <Navigation />
          <main className="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 