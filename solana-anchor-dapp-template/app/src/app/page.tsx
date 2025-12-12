'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GameLobby } from '@/components/GameLobby';
import { MyMatches } from '@/components/MyMatches';
import { useState } from 'react';

type Tab = 'lobby' | 'my-matches';

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>('lobby');

  return (
    <main className="min-h-screen flex flex-col bg-[var(--secondary-color)] text-[var(--text-color)]">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] bg-clip-text text-transparent">
              PVP Arena
            </h1>
            <p className="text-[var(--subtext-color)] text-xl mb-2">
              Where legends are born and fortunes are made.
            </p>
            <p className="text-sm">
              Experience the thrill of skill-based gaming on the Solana blockchain.
            </p>
          </div>

          {!connected ? (
            <div className="text-center py-16">
              <div className="glass-card p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6">⚔️</div>
                <h2 className="text-3xl font-bold mb-4 text-[var(--primary-color)]">Connect Your Wallet</h2>
                <p className="text-[var(--subtext-color)] mb-8">
                  Join the arena, challenge opponents, and claim your victory.
                </p>
                <WalletMultiButton />
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <div className="glass-card p-1 flex gap-1">
                  <button
                    onClick={() => setActiveTab('lobby')}
                    className={`px-6 py-2 rounded-md transition-all font-bold ${
                      activeTab === 'lobby'
                        ? 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white'
                        : 'text-[var(--subtext-color)] hover:text-white'
                    }`}
                  >
                    🏟️ Game Lobby
                  </button>
                  <button
                    onClick={() => setActiveTab('my-matches')}
                    className={`px-6 py-2 rounded-md transition-all font-bold ${
                      activeTab === 'my-matches'
                        ? 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white'
                        : 'text-[var(--subtext-color)] hover:text-white'
                    }`}
                  >
                    📋 My Matches
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'lobby' && <GameLobby />}
              {activeTab === 'my-matches' && <MyMatches />}
            </>
          )}

          {/* How It Works */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-[var(--primary-color)]">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <StepCard
                number={1}
                title="Create Match"
                description="Set your stake and create a new match."
                icon="💰"
              />
              <StepCard
                number={2}
                title="Find Opponent"
                description="Wait for a worthy opponent to accept the challenge."
                icon="🎯"
              />
              <StepCard
                number={3}
                title="Play & Win"
                description="Compete in a skill-based game to determine the winner."
                icon="🎮"
              />
              <StepCard
                number={4}
                title="Claim Prize"
                description="The victor claims 95% of the total pot instantly."
                icon="🏆"
              />
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Secure Escrow"
              description="Stakes are held securely in a smart contract until the match concludes."
              icon="🔐"
            />
            <FeatureCard
              title="Low Platform Fee"
              description="A flat 5% fee is applied, regardless of the match outcome."
              icon="📊"
            />
            <FeatureCard
              title="Instant Payouts"
              description="Winners can immediately claim their prize on-chain."
              icon="⚡"
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: number;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="text-center glass-card p-6">
      <div className="relative inline-block">
        <div className="text-5xl mb-4">{icon}</div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] rounded-full flex items-center justify-center text-sm font-bold">
          {number}
        </div>
      </div>
      <h3 className="font-bold text-lg mb-2 text-[var(--primary-color)]">{title}</h3>
      <p className="text-[var(--subtext-color)] text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="glass-card p-8 text-center hover:border-[var(--primary-color)] transition-colors duration-300">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-[var(--primary-could)]">{title}</h3>
      <p className="text-[var(--subtext-color)] text-sm">{description}</p>
    </div>
  );
}
