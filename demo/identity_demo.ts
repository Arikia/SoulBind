// demo/identity_demo.ts
import { SolanaAgentKit } from "solana-agent-kit";

async function demonstrateIdentityProtection() {
  const walletKey = process.env.WALLET_KEY;
  if (!walletKey) {
    throw new Error("WALLET_KEY environment variable is required to run this demo.");
  }

  // Initialize Solana Agent Kit with devnet for testing
  const agent = new SolanaAgentKit(
    walletKey,
    "https://api.devnet.solana.com",
    {}
  );

  console.log("Starting SoulBind Identity Demo...");

  // Deploy soulbound token for Glitch Phoenix identity
  const tokenResult = await agent.deployToken(
    "GlitchPhoenix", // Token name
    "codex-uri",     // Points to secured identity document
    "SOULBIND",      // Token symbol
    0,               // Non-divisible token
    {},              // Mint/freeze/update authority defaults to the agent's wallet
    1                // Only one token exists (initialSupply)
  );

  console.log("Identity Token Created:", tokenResult.mint.toString());
  console.log("Token is soulbound to creator's wallet");

  // Demonstrate access control
  console.log("Demonstrating token-gated access...");
  // Add access demonstration logic here

  return tokenResult;
}

// Export for use in testing and demos
export { demonstrateIdentityProtection };
