// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { config } from '../../config';

// IdentityManager calls useWallet(), which throws unless it's rendered
// inside a WalletProvider — this is that provider, set up once for the
// whole app.
export default function App({ Component, pageProps }: AppProps) {
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={config.rpcUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <Component {...pageProps} />
      </WalletProvider>
    </ConnectionProvider>
  );
}
