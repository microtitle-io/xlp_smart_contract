use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::pubkey::Pubkey;
use std::str::FromStr;

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

        // pay the fee:
        let fee: u64 = 25_000_000;

        let ix = system_instruction::transfer(
            ctx.accounts.author.key,
            ctx.accounts.registrar.key,
            fee
        );
        
        invoke(
            &ix,
            &[
                ctx.accounts.author.to_account_info(),
                ctx.accounts.registrar.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;


        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateRegister<'info> {
    #[account(init, payer = author, space = Microtitle::LEN)]
    pub microtitle: Account<'info, Microtitle>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(mut, address = Pubkey::from_str("HSMaqKWmpKtibZrukaE4X3HatNDUYkzg39y2kri3PRTh").unwrap())]
    pub registrar: AccountInfo<'info>,
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