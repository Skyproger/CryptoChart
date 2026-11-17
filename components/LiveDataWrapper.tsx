import { Separator } from '@/components/ui/separator';
import CandlestickChart from '@/components/CandlestickChart';
import LivePriceHeader from '@/components/LivePriceHeader';

const LiveDataWrapper = ({ children, coinId, coin, coinOHLCData }: LiveDataProps) => {
  return (
    <section className="size-full xl:col-span-2">
      <LivePriceHeader
        coinId={coinId}
        name={coin.name}
        image={coin.image.large}
        initialPrice={coin.market_data.current_price?.usd ?? 0}
        initialPriceChangePercentage24h={
          coin.market_data.price_change_percentage_24h_in_currency?.usd ?? 0
        }
        priceChangePercentage30d={
          coin.market_data.price_change_percentage_30d_in_currency?.usd ?? 0
        }
        priceChange24h={coin.market_data.price_change_24h_in_currency?.usd ?? 0}
      />
      <Separator className="my-8! bg-purple-600!" />

      <div className="w-full">
        <CandlestickChart coinId={coinId} data={coinOHLCData} initialPeriod="daily">
          <h4 className="text-xl md:text-2xl font-semibold mb-2 mt-2 pl-2">Trend Overview</h4>
        </CandlestickChart>
      </div>

      {children}
    </section>
  );
};

export default LiveDataWrapper;
