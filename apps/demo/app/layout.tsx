import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zenith Editor Demo',
  description: 'Demo application for Zenith Editor - A modern WYSIWYG editor for React & Next.js',
  keywords: ['editor', 'wysiwyg', 'react', 'nextjs', 'typescript', 'tiptap'],
  authors: [{ name: 'Zenith Editor Team' }],
  openGraph: {
    title: 'Zenith Editor Demo',
    description: 'Experience the power of Zenith Editor - A modern WYSIWYG editor',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
