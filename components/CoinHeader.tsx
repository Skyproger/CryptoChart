import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp } from 'lucide-react';

const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h,
}: LiveCoinHeaderProps) => {
  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isThirtyDayUp = priceChangePercentage30d > 0;
  const isPriceChangeUp = priceChange24h > 0;

  const stats = [
    {
      label: 'Today',
      value: livePriceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: '30 Days',
      value: priceChangePercentage30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: 'Price Change (24h)',
      value: priceChange24h,
      isUp: isPriceChangeUp,
      formatter: formatCurrency,
      showIcon: false,
    },
  ];

  const badgeClass = cn(
    'font-medium mt-2 h-fit py-1 flex items-center gap-1',
    isTrendingUp ? 'bg-green-600/20! text-green-600!' : 'bg-red-500/20! text-red-500!',
  );

  return (
    <div className="space-y-5 w-full">
      <h3 className="text-3xl font-medium">{name}</h3>

      <div className="flex gap-3 items-center">
        <Image
          src={image}
          alt={name}
          width={77}
          height={77}
          className="size-11.25 sm:size-12.5 xl:size-19.25"
        />

        <div className="flex gap-4">
          <h1 className="text-3xl sm:text-5xl xl:text-6xl font-semibold">
            {formatCurrency(livePrice)}
          </h1>
          <Badge className={badgeClass}>
            {formatPercentage(livePriceChangePercentage24h)}
            {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
            (24h)
          </Badge>
        </div>
      </div>

      <ul className="grid grid-cols-3 mt-8 gap-4 sm:gap-6 w-fit">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="text-base border-r last:border-none border-purple-600 flex flex-col gap-2"
          >
            <p className="text-purple-100 max-sm:text-sm">{stat.label}</p>

            <div
              className={cn('flex gap-1 flex-1 items-end text-base font-medium', {
                'text-green-500': stat.isUp,
                'text-red-500': !stat.isUp,
              })}
            >
              <p>{stat.formatter(stat.value)}</p>
              {stat.showIcon &&
                (stat.isUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CoinHeader;
