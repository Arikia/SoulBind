// smart_contracts/programs/soulbind/src/lib.rs
//
// Solana programs are written in Rust, not Solidity — the EVM bytecode
// Solidity compiles to can't run on Solana's runtime. This is a real
// Anchor program equivalent of the old SoulBind.sol contract: it locks
// a content hash to the wallet that submitted it.
//
// One IdentityDocument account is derived per creator wallet (a PDA
// seeded by the creator's own public key), so it can't be reassigned to
// a different owner — the soulbound property the original contract's
// name implied.
use anchor_lang::prelude::*;

// Placeholder ID — run `anchor keys list` locally to generate your own
// program keypair, then sync it here and in Anchor.toml before deploying.
declare_id!("roS6AMShrJifpsKiAFKoHMvVJPGPHb4SSpHLXVvjEak");

#[program]
pub mod soulbind {
    use super::*;

    pub fn secure_document(ctx: Context<SecureDocument>, content_hash: String) -> Result<()> {
        require!(
            content_hash.len() <= IdentityDocument::MAX_HASH_LEN,
            SoulBindError::ContentHashTooLong
        );

        let document = &mut ctx.accounts.identity_document;
        document.creator = ctx.accounts.creator.key();
        document.content_hash = content_hash.clone();
        document.is_locked = true;
        document.bump = ctx.bumps.identity_document;

        emit!(DocumentSecured {
            creator: document.creator,
            content_hash,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SecureDocument<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init_if_needed,
        payer = creator,
        space = IdentityDocument::SIZE,
        seeds = [b"identity", creator.key().as_ref()],
        bump,
    )]
    pub identity_document: Account<'info, IdentityDocument>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct IdentityDocument {
    pub creator: Pubkey,
    pub content_hash: String,
    pub is_locked: bool,
    pub bump: u8,
}

impl IdentityDocument {
    pub const MAX_HASH_LEN: usize = 128;
    // 8-byte discriminator + creator pubkey + (4-byte string prefix + max
    // content_hash bytes) + is_locked + bump
    pub const SIZE: usize = 8 + 32 + (4 + Self::MAX_HASH_LEN) + 1 + 1;
}

#[event]
pub struct DocumentSecured {
    pub creator: Pubkey,
    pub content_hash: String,
}

#[error_code]
pub enum SoulBindError {
    #[msg("Content hash exceeds the maximum allowed length.")]
    ContentHashTooLong,
}
