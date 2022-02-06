use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("KdWVDYMteVwTbBNZGfCkS2ayCFEWhbkBoFZxPwdqCgu");

#[program]
pub mod register {
    use super::*;
    pub fn update_register(ctx: Context<UpdateRegister>, bkey: Pubkey, mint: Pubkey) -> ProgramResult {
        let microtitle: &mut Account<Microtitle> = &mut ctx.accounts.microtitle;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        microtitle.author = *author.key;
        microtitle.timestamp = clock.unix_timestamp;
        microtitle.bkey = bkey;
        microtitle.mint = mint; 

        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateRegister<'info> {
    #[account(init, payer = author, space = Microtitle::LEN)]
    pub microtitle: Account<'info, Microtitle>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

// 1. Define the structure of the Microtitle account.
#[account]
pub struct Microtitle {
    pub author: Pubkey,
    pub timestamp: i64,
    pub bkey: Pubkey,
    pub mint: Pubkey,
}

// 2. Add some useful constants for sizing propeties.
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;

// 3. Add a constant on the Microtitle account that provides its total size.
impl Microtitle {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + TIMESTAMP_LENGTH // Timestamp.
        + PUBLIC_KEY_LENGTH // Bonding keypair public key.
        + PUBLIC_KEY_LENGTH; // Mint ID public key.
}

// #[error]
// pub enum ErrorCode {
    // #[msg("The provided bkey is not 32 bytes.")]
    // BkeyIncorrectLength,
    // #[msg("The provided mint is not 32 bytes.")]
    // MintIncorrectLength,
// }