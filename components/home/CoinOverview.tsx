import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { CoinOverviewFallback } from './fallback';
import CandlestickChart from "@/components/CandlestickChart";


const CoinOverview = async () => {
  try {
    const [coin, coinOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('/coins/bitcoin', {
        dex_pair_format: 'symbol',
      }),
      fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        precision: 'full',
      }),
    ]);

    return (
      <div className="w-full h-full xl:col-span-2 px-2 bg-dark-500 rounded-xl">
        <CandlestickChart data={coinOHLCData} coinId="bitcoin" >
          <div className="flex-1 mb-2 flex gap-2 md:gap-3 pt-2">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={56}
              height={56}
              className="w-10 h-10 md:w-14 md:h-14"
            />
            <div className="flex flex-col">
              <p className="flex text-purple-100 text-xs md:text-sm w-fit">
                {coin.name} / {coin.symbol.toUpperCase()}
              </p>
              <h1 className="text-xl md:text-2xl font-semibold">
                {formatCurrency(coin.market_data.current_price?.usd ?? 0)}
              </h1>
            </div>
          </div>
        </CandlestickChart>
      </div>
    );
  } catch (error) {
    console.error('Error fetching coin overview:', error);
    return <CoinOverviewFallback />;
  }
};

export default CoinOverview;
