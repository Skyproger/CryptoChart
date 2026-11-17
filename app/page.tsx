import  { Suspense } from 'react';
import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import {
  CategoriesFallback,
  CoinOverviewFallback,
  TrendingCoinsFallback,
} from '@/components/home/fallback';
import Categories from '@/components/home/Categories';

const Page = async () => { //Он запускает рендер обоих компонентов параллельно
  return (
    <main className="py-6 md:py-12 mx-auto px-4 sm:px-6 max-w-360 w-full space-y-6">
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start lg:items-center gap-6">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
