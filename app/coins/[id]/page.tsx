import { fetcher } from '@/lib/coingecko.actions';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import Converter from '@/components/Converter';

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`),
    fetcher<OHLCData[]>(`/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days: 1,
      precision: 'full',
    }),
  ]);

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatCurrency(coinData.market_data.market_cap?.usd ?? 0),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data.total_volume?.usd ?? 0),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ];

  return (
    <main className="py-12 px-4 sm:px-6 mx-auto max-w-360 size-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center gap-6 xl:gap-10 justify-center">
      <section className="size-full xl:col-span-2">
        <LiveDataWrapper coinId={id} coin={coinData} coinOHLCData={coinOHLCData} />
      </section>

      <section className="size-full max-lg:mt-8 lg:col-span-1">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price ?? { usd: 0 }}
        />
        <div className="w-full mt-8 space-y-4">
          <h4 className="text-xl md:text-2xl font-semibold mb-2 pb-3">Coin Details</h4>

          <ul className="rounded-lg grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-5">
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <li
                key={index}
                className="text-base bg-dark-500 px-5 py-6 rounded-lg flex flex-col gap-3"
              >
                <p className="text-purple-100">{label}</p>

                {link ? (
                  <div className="flex items-center text-green-500 gap-1">
                    <Link href={link} target="_blank">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};
export default Page;
