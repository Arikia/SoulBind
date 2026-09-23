// tests/identity_demo.test.ts
import { demonstrateIdentityProtection } from '../demo/identity_demo';

describe('SoulBind Identity Protection', () => {
  it('should create a soulbound token for identity document', async () => {
    // This hits Solana devnet through solana-agent-kit and needs a funded
    // WALLET_KEY in the environment to actually pass — see README.
    const result = await demonstrateIdentityProtection();

    // deployToken resolves to { mint: PublicKey } — it doesn't return
    // token name/symbol/supply, so that's all there is to assert here.
    expect(result).not.toBeNull();
    expect(result.mint).toBeDefined();
    expect(result.mint.toString().length).toBeGreaterThan(0);
  });
});
