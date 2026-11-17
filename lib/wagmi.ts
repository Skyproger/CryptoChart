import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  phantomWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'CryptoChart',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
  wallets: [
    {
      groupName: 'Popular',
      wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet, phantomWallet],
    },
    {
      groupName: 'More',
      wallets: [rainbowWallet, trustWallet, safeWallet],
    },
  ],
});
