import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import Link from 'next/link';

import { cn, formatPercentage, formatCurrency } from '@/lib/utils';
import DataTable from '@/components/DataTable';
import CoinsPagination from '@/components/CoinsPagination';

const Coins = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const perPage = 10;

  const coinsData = await fetcher<CoinMarketData[]>('/coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: perPage,
    page: currentPage,
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: 'Rank',
      cellClassName: 'pl-5 max-w-20! py-5 font-medium text-purple-100',
      cell: (coin) => (
        <>
          #{coin.market_cap_rank}
          <Link href={`/coins/${coin.id}`} aria-label="View coin" className="absolute inset-0 z-10" />
        </>
      ),
    },
    {
      header: 'Token',
      cellClassName: 'py-3 font-semibold',
      cell: (coin) => (
        <div className="flex items-center gap-3">
          <Image 
            src={coin.image} 
            alt={coin.name} 
            width={36} 
            height={36} />
          <p className="max-w-full truncate">
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'py-4 font-medium',
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: '24h Change',
      cellClassName: 'font-medium',
      cell: (coin) => {
        const isTrendingUp = coin.price_change_percentage_24h > 0;

        return (
          <span
            className={cn('flex gap-1 items-center font-medium', {
              'text-green-600': isTrendingUp,
              'text-red-500': !isTrendingUp,
            })}
          >
            {isTrendingUp && '+'}
            {formatPercentage(coin.price_change_percentage_24h)}
          </span>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'pr-5 font-medium',
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  const hasMorePages = coinsData.length === perPage;

  const estimatedTotalPages = 25;

  return (
    <main className="py-12 px-4 sm:px-6 mx-auto max-w-360 size-full items-center gap-10 justify-center">
      <div className="flex flex-col w-full space-y-5">
        <h4 className="text-2xl">All Coins</h4>

        <DataTable
          tableClassName="bg-dark-500 rounded-xl max-h-fit overflow-hidden"
          columns={columns}
          data={coinsData}
          rowKey={(coin) => coin.id}
        />

        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  );
};

export default Coins;
