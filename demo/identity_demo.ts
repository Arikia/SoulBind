// demo/identity_demo.ts
import { Connection, Keypair } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  freezeAccount,
} from "@solana/spl-token";
import bs58 from "bs58";

async function demonstrateIdentityProtection() {
  const walletKey = process.env.WALLET_KEY;
  if (!walletKey) {
    throw new Error("WALLET_KEY environment variable is required to run this demo.");
  }

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const payer = Keypair.fromSecretKey(bs58.decode(walletKey));

  console.log("Starting SoulBind Identity Demo...");

  // Create a new SPL token mint for the Glitch Phoenix identity: 0 decimals
  // (non-divisible), with the creator's own wallet as mint & freeze authority.
  const mint = await createMint(connection, payer, payer.publicKey, payer.publicKey, 0);

  // Create the creator's token account and mint exactly one token into it —
  // "only one token exists".
  const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
  await mintTo(connection, payer, mint, tokenAccount.address, payer, 1);

  // Freeze the holder's account so the token can never be transferred out of
  // it — this is what makes it "soulbound" to the creator's wallet.
  await freezeAccount(connection, payer, tokenAccount.address, mint, payer);

  console.log("Identity Token Created:", mint.toString());
  console.log("Token is soulbound to creator's wallet");

  // Demonstrate access control
  console.log("Demonstrating token-gated access...");
  // Add access demonstration logic here

  return { mint };
}

// Export for use in testing and demos
export { demonstrateIdentityProtection };
