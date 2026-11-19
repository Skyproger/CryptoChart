'use client';

import { useEffect, useRef } from 'react';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import Web3Provider from '@/components/providers/Web3Provider';

const WalletButton = () => {
  const { openConnectModal } = useConnectModal();
  const hasOpened = useRef(false);

  useEffect(() => {
    if (hasOpened.current || !openConnectModal) return;
    hasOpened.current = true;
    openConnectModal();
  }, [openConnectModal]);

  return <ConnectButton showBalance={true} chainStatus="icon" accountStatus="address" />;
};

const ConnectWallet = () => (
  <Web3Provider>
    <WalletButton />
  </Web3Provider>
);

export default ConnectWallet;
