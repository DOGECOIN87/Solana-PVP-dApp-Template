import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SolanaWalletProvider } from '@/context/WalletProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Solana Counter dApp',
  description: 'A decentralized counter application built with Anchor on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
