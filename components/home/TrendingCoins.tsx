import { fetcher } from '@/lib/coingecko.actions';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import DataTable from '@/components/DataTable';
import { TrendingCoinsFallback } from './fallback';

const TrendingCoins = async () => {
  let trendingCoins;

  try {
    trendingCoins = await fetcher<{ coins: TrendingCoin[] }>('/search/trending', undefined, 300);
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return <TrendingCoinsFallback />;
  }

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: 'Name',
      cellClassName: 'font-bold',
      cell: (coin) => {
        const item = coin.item;

        return (
          <Link
            href={`/coins/${item.id}`}
            className="pl-1 md:pl-2 py-1 md:py-2 xl:py-1 flex items-center gap-2 md:gap-3"
          >
            <Image
              src={item.large}
              alt={item.name}
              width={36}
              height={36}
              className="rounded-full size-8 md:size-9"
            />
            <p className="text-sm md:text-base">{item.name}</p>
          </Link>
        );
      },
    },
    {
      header: '24h Change',
      cellClassName: 'font-medium py-4 pr-3 md:pr-5',
      cell: (coin) => {
        const item = coin.item;
        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

        return (
          <div
            className={cn(
              'flex gap-1 items-center text-sm font-medium',
              isTrendingUp ? 'text-green-500' : 'text-red-500',
            )}
          >
            <p className="flex items-center">
              {formatPercentage(item.data.price_change_percentage_24h.usd)}
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Price',
      cellClassName: 'font-bold pr-5 text-sm max-w-full truncate',
      cell: (coin) => formatCurrency(coin.item.data.price),
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center h-full py-4 bg-dark-500 rounded-xl">
      <h4 className="text-xl md:text-2xl font-semibold mb-2 px-5">Trending Coins</h4>

      <DataTable
        data={trendingCoins.coins.slice(0, 6) || []}
        columns={columns}
        rowKey={(coin) => coin.item.id}
        tableClassName="bg-dark-500 overflow-hidden"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
};

export default TrendingCoins;
