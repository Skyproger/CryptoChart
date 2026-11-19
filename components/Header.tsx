'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const ConnectWallet = dynamic(() => import('@/components/ConnectWallet'), {
  ssr: false,
  loading: () => (
    <button
      type="button"
      disabled
      aria-busy="true"
      className="h-10 shrink-0 rounded-xl bg-blue-600 px-4 font-bold whitespace-nowrap text-white opacity-70"
    >
      Loading wallet…
    </button>
  ),
});

const NAV_LINK_BASE =
  'flex items-center h-full transition-all font-medium text-purple-100 hover:text-white cursor-pointer';

const Header = () => {
  const pathname = usePathname();
  const [walletRequested, setWalletRequested] = useState(false);

  return (
    <header className="border-b border-dark-400 h-20">
      <div className="py-6 md:py-12 mx-auto px-4 sm:px-6 max-w-360 w-full flex justify-between items-center h-full">
        <Link href="/" className="shrink-0 text-lg font-normal text-white">
          CryptoChart
        </Link>

        <nav className="flex h-full items-center gap-6">
          <Link
            href="/"
            className={cn(NAV_LINK_BASE, 'max-sm:hidden', {
              'text-white': pathname === '/',
            })}
          >
            Home
          </Link>

          <p className={NAV_LINK_BASE}>Search Modal</p>
          <Link
            href="/coins"
            className={cn(NAV_LINK_BASE, {
              'text-white': pathname === '/coins',
            })}
          >
            All Coins
          </Link>

          <Link
            href="/earth"
            className={cn(NAV_LINK_BASE, {
              'text-white': pathname === '/earth',
            })}
          >
            Earth
          </Link>

          {walletRequested ? (
            <ConnectWallet />
          ) : (
            <button
              type="button"
              onClick={() => setWalletRequested(true)}
              className="h-10 shrink-0 cursor-pointer rounded-xl bg-blue-600 px-4 font-bold whitespace-nowrap text-white hover:bg-blue-500"
            >
              Connect Wallet
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
