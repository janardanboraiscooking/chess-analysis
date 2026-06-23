import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoatedChess — Game Analysis',
  description: 'Upload a PGN and get instant Stockfish analysis with move classifications',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
