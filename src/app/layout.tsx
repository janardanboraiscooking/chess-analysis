import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'GoatedChess — Chess Engine & Analysis Platform',
  description: 'A professional chess engine built from scratch in C++. Game analysis, opening explorer, and tactical puzzles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
