'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Web3Provider from '@/components/providers/Web3Provider';

const ConnectWallet = () => {
  return (
    <Web3Provider>
      <ConnectButton showBalance={true} chainStatus="icon" accountStatus="address" />
    </Web3Provider>
  );
};

export default ConnectWallet;
