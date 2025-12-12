use anchor_lang::prelude::*;
use crate::state::{PlatformConfig, GameMatch, MatchStatus};
use crate::GameError;

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(
        seeds = [PlatformConfig::SEED_PREFIX],
        bump = platform_config.bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    
    #[account(
        mut,
        seeds = [GameMatch::SEED_PREFIX, &game_match.match_id],
        bump = game_match.bump,
        constraint = game_match.status == MatchStatus::Completed @ GameError::InvalidMatchState,
        constraint = game_match.winner == winner.key() @ GameError::NotWinner
    )]
    pub game_match: Account<'info, GameMatch>,
    
    /// Escrow account holding the stakes
    #[account(
        mut,
        seeds = [GameMatch::ESCROW_SEED_PREFIX, game_match.key().as_ref()],
        bump = game_match.escrow_bump
    )]
    /// CHECK: PDA validated by seeds
    pub escrow: SystemAccount<'info>,
    
    /// Treasury to receive the platform fee
    /// CHECK: Validated against platform_config
    #[account(
        mut,
        constraint = treasury.key() == platform_config.treasury
    )]
    pub treasury: SystemAccount<'info>,
    
    /// Winner claiming their prize
    #[account(mut)]
    pub winner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ClaimWinnings>) -> Result<()> {
    let game_match = &mut ctx.accounts.game_match;
    let escrow = &ctx.accounts.escrow;
    
    let prize_amount = game_match.prize_amount;
    let fee_amount = game_match.fee_amount;
    
    // Verify escrow has enough funds
    require!(
        escrow.lamports() >= prize_amount + fee_amount,
        GameError::InsufficientEscrowFunds
    );
    
    // Get match key for PDA seeds
    let match_key = game_match.key();
    let escrow_bump = game_match.escrow_bump;
    let escrow_seeds = &[
        GameMatch::ESCROW_SEED_PREFIX,
        match_key.as_ref(),
        &[escrow_bump],
    ];
    
    // Transfer fee to treasury
    **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= fee_amount;
    **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? += fee_amount;
    
    // Transfer prize to winner
    **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= prize_amount;
    **ctx.accounts.winner.to_account_info().try_borrow_mut_lamports()? += prize_amount;
    
    // Mark match as claimed
    game_match.mark_claimed();
    
    msg!("Winnings claimed!");
    msg!("Winner: {}", ctx.accounts.winner.key());
    msg!("Prize received: {} lamports ({} SOL)", prize_amount, prize_amount as f64 / 1_000_000_000.0);
    msg!("Platform fee: {} lamports", fee_amount);
    
    Ok(())
}
