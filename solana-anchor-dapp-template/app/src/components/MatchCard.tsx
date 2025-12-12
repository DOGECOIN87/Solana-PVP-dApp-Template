'use client';

import { FC } from 'react';
import { usePvpGame } from '@/hooks/usePvpGame';
import { GameMatch, MatchState } from '@/idl/pvp_game';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface MatchCardProps {
  match: {
    publicKey: any;
    account: GameMatch;
  };
}

export const MatchCard: FC<MatchCardProps> = ({ match }) => {
  const { publicKey } = useWallet();
  const { joinMatch, submitResult, claimWinnings, cancelMatch, isJoining, isSubmitting, isClaiming, isCanceling } = usePvpGame();

  const isPlayer1 = publicKey?.equals(match.account.player1);
  const isPlayer2 = publicKey?.equals(match.account.player2);
  const canJoin = !isPlayer1 && !isPlayer2 && match.account.state === MatchState.Open;
  const canPlay = (isPlayer1 || isPlayer2) && match.account.state === MatchState.InProgress;
  const canClaim = (isPlayer1 && match.account.winner?.equals(publicKey!)) || (isPlayer2 && match.account.winner?.equals(publicKey!));
  const canCancel = isPlayer1 && match.account.state === MatchState.Open;

  const renderAction = () => {
    if (canJoin) {
      return <button onClick={() => joinMatch(match.publicKey)} className="btn-primary w-full" disabled={isJoining}>Join Match</button>;
    }
    if (canPlay) {
      return <button onClick={() => submitResult(match.publicKey)} className="btn-primary w-full" disabled={isSubmitting}>Submit Result</button>;
    }
    if (canClaim) {
      return <button onClick={() => claimWinnings(match.publicKey)} className="btn-primary w-full" disabled={isClaiming}>Claim Winnings</button>;
    }
    if (canCancel) {
      return <button onClick={() => cancelMatch(match.publicKey)} className="btn-secondary w-full" disabled={isCanceling}>Cancel Match</button>;
    }
    return null;
  };

  const getStatus = () => {
    switch (match.account.state) {
      case MatchState.Open:
        return <span className="text-green-400">Open</span>;
      case MatchState.InProgress:
        return <span className="text-yellow-400">In Progress</span>;
      case MatchState.Finished:
        return <span className="text-red-400">Finished</span>;
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between hover:border-[var(--primary-color)] transition-colors duration-300">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-[var(--subtext-color)]">Match Stake</p>
            <p className="text-2xl font-bold text-[var(--primary-color)]">{match.account.stake.toNumber() / LAMPORTS_PER_SOL} SOL</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--subtext-color)]">Status</p>
            <p className="font-bold">{getStatus()}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p><span className="font-semibold text-[var(--subtext-color)]">Player 1:</span> {match.account.player1.toBase58().slice(0, 8)}...</p>
          <p><span className="font-semibold text-[var(--subtext-color)]">Player 2:</span> {match.account.player2 ? `${match.account.player2.toBase58().slice(0,8)}...` : 'Waiting...'}</p>
          {match.account.winner && <p><span className="font-semibold text-[var(--subtext-color)]">Winner:</span> {match.account.winner.toBase58().slice(0,8)}...</p>}
        </div>
      </div>
      <div className="mt-6">
        {renderAction()}
      </div>
    </div>
  );
};
