// src/components/IdentityManager.tsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SolanaAgentKit } from "solana-agent-kit";

export const IdentityManager = () => {
  const { publicKey } = useWallet();
  const [document, setDocument] = useState<{ mint: string } | null>(null);
  const [isSecuring, setIsSecuring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const secureIdentity = async () => {
    if (!publicKey) {
      setError('Connect a wallet first.');
      return;
    }

    setIsSecuring(true);
    setError(null);

    try {
      const walletKey = process.env.WALLET_KEY;
      const rpcUrl = process.env.RPC_URL;
      if (!walletKey || !rpcUrl) {
        throw new Error('WALLET_KEY and RPC_URL must be configured.');
      }

      // NOTE: SolanaAgentKit signs with a raw private key (WALLET_KEY),
      // which must never ship to the browser. Next.js already strips
      // non-NEXT_PUBLIC_ env vars from client bundles, so this call needs
      // to move behind a server-side API route (using the connected
      // wallet's own signTransaction instead of a hardcoded key) before
      // this is anything more than a local demo.
      const agent = new SolanaAgentKit(walletKey, rpcUrl, {});

      const result = await agent.deployToken(
        "GlitchPhoenix",
        "codex-uri",
        "SOULBIND",
        0,
        {}, // Mint/freeze/update authority defaults to the agent's wallet
        1   // initialSupply
      );

      setDocument({ mint: result.mint.toString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to secure identity document.');
    } finally {
      setIsSecuring(false);
    }
  };

  return (
    <div className="p-4">
      <h2>Identity Document Manager</h2>
      <button onClick={secureIdentity} disabled={isSecuring || !publicKey}>
        {isSecuring ? 'Securing...' : 'Create Identity Token'}
      </button>
      {!publicKey && <p>Connect a wallet to create an identity token.</p>}
      {error && <p role="alert">{error}</p>}
      {document && <p>Identity token minted: {document.mint}</p>}
    </div>
  );
};
