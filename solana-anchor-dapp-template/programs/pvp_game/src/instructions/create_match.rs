use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::{PlatformConfig, GameMatch};
use crate::GameError;

#[derive(Accounts)]
#[instruction(stake_amount: u64, match_id: [u8; 32])]
pub struct CreateMatch<'info> {
    #[account(
        seeds = [PlatformConfig::SEED_PREFIX],
        bump = platform_config.bump,
        constraint = !platform_config.paused @ GameError::PlatformPaused
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    
    /// The match account (PDA derived from match_id)
    #[account(
        init,
        payer = player1,
        space = 8 + GameMatch::INIT_SPACE,
        seeds = [GameMatch::SEED_PREFIX, &match_id],
        bump
    )]
    pub game_match: Account<'info, GameMatch>,
    
    /// Escrow account to hold the staked SOL (PDA)
    #[account(
        mut,
        seeds = [GameMatch::ESCROW_SEED_PREFIX, game_match.key().as_ref()],
        bump
    )]
    /// CHECK: This is a PDA that will hold SOL, validated by seeds
    pub escrow: SystemAccount<'info>,
    
    /// Player 1 creating the match
    #[account(mut)]
    pub player1: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateMatch>, stake_amount: u64, match_id: [u8; 32]) -> Result<()> {
    // Validate stake amount
    require!(
        stake_amount >= GameMatch::MIN_STAKE,
        GameError::StakeTooLow
    );
    require!(
        stake_amount <= GameMatch::MAX_STAKE,
        GameError::StakeTooHigh
    );
    
    let game_match = &mut ctx.accounts.game_match;
    let clock = Clock::get()?;
    
    // Initialize match state
    game_match.init(
        match_id,
        ctx.accounts.player1.key(),
        stake_amount,
        clock.unix_timestamp,
        ctx.bumps.game_match,
        ctx.bumps.escrow,
    );
    
    // Transfer stake from player1 to escrow
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.player1.to_account_info(),
                to: ctx.accounts.escrow.to_account_info(),
            },
        ),
        stake_amount,
    )?;
    
    // Update platform stats
    let platform_config = &mut ctx.accounts.platform_config.to_account_info();
    // Note: We can't mutate platform_config here due to borrow rules
    // Stats will be updated in a separate instruction or via events
    
    msg!("Match created!");
    msg!("Match ID: {:?}", match_id);
    msg!("Player 1: {}", game_match.player1);
    msg!("Stake: {} lamports ({} SOL)", stake_amount, stake_amount as f64 / 1_000_000_000.0);
    
    Ok(())
}
