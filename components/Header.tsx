'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const ConnectWallet = dynamic(() => import('@/components/ConnectWallet'), {
  ssr: false,
  loading: () => <div className="w-40 h-10" />,
});

const NAV_LINK_BASE =
  'px-6 py-5 flex items-center h-full transition-all font-medium text-purple-100 hover:text-white cursor-pointer';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="border-b border-dark-400 h-20">
      <div className="py-6 md:py-12 mx-auto px-4 sm:px-6 max-w-360 w-full flex justify-between items-center h-full">
        <Link href="/" className="shrink-0 text-lg font-normal text-white">
          CryptoChart
        </Link>

        <nav className="flex h-full items-center">
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

          <ConnectWallet />
        </nav>
      </div>
    </header>
  );
};

export default Header;
