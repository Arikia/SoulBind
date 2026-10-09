// src/components/IdentityManager.tsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, freezeAccount } from '@solana/spl-token';
import bs58 from 'bs58';

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

      // NOTE: signing with a raw private key (WALLET_KEY) must never ship
      // to the browser. Next.js already strips non-NEXT_PUBLIC_ env vars
      // from client bundles, so this call needs to move behind a
      // server-side API route (using the connected wallet's own
      // signTransaction instead of a hardcoded key) before this is
      // anything more than a local demo.
      const connection = new Connection(rpcUrl, 'confirmed');
      const payer = Keypair.fromSecretKey(bs58.decode(walletKey));

      const mint = await createMint(connection, payer, payer.publicKey, payer.publicKey, 0);
      const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);
      await mintTo(connection, payer, mint, tokenAccount.address, payer, 1);
      // Freeze the holder's account so the token can never be transferred —
      // this is what makes it "soulbound" to the creator's wallet.
      await freezeAccount(connection, payer, tokenAccount.address, mint, payer);

      setDocument({ mint: mint.toString() });
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
