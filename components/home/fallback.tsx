import React from 'react';
import DataTable from '@/components/DataTable';

const SKELETON = 'bg-dark-400/60';

export const CoinOverviewFallback = () => {
  return (
    <div className="w-full h-full xl:col-span-2 px-2 bg-dark-500 rounded-xl">
      <div className="flex-1 mb-2 flex gap-2 md:gap-3 pt-2">
        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full ${SKELETON}`} />
        <div className="flex flex-col gap-2">
          <div className={`h-3 w-24 md:w-28 ${SKELETON}`} />
          <div className={`h-7 w-36 md:w-44 ${SKELETON}`} />
        </div>
      </div>
      <div className="h-90">
        <div className={`h-full w-full rounded-xl ${SKELETON}`} />
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const columns = [
    {
      header: 'Name',
      cellClassName: 'font-bold',
      cell: () => (
        <div className="pl-1 md:pl-2 py-1 md:py-2 xl:py-1 flex items-center gap-2 md:gap-3">
          <div className={`rounded-full size-8 md:size-9 ${SKELETON}`} />
          <div className={`h-4 w-24 ${SKELETON}`} />
        </div>
      ),
    },
    {
      header: '24h Change',
      cellClassName: 'font-medium py-4 pr-3 md:pr-5',
      cell: () => (
        <div className="flex gap-1 items-center text-sm font-medium">
          <div className={`h-3.5 w-3.5 rounded-full ${SKELETON}`} />
          <div className={`h-4 w-16 ${SKELETON}`} />
        </div>
      ),
    },
    {
      header: 'Price',
      cellClassName: 'font-bold pr-5 text-sm max-w-full truncate',
      cell: () => <div className={`h-4 w-20 ${SKELETON}`} />,
    },
  ];

  const dummyData = Array.from({ length: 6 }, (_, i) => ({ id: i }));

  return (
    <div className="w-full flex flex-col justify-center h-full py-4 bg-dark-500 rounded-xl">
      <h4 className="text-xl md:text-2xl font-semibold mb-2 px-5">Trending Coins</h4>
      <DataTable
        data={dummyData}
        columns={columns as any}
        rowKey={(item: any) => item.id}
        tableClassName="bg-dark-500 overflow-hidden"
      />
    </div>
  );
};

export const CategoriesFallback = () => {
  const columns = [
    {
      header: 'Category',
      cellClassName: 'font-bold',
      cell: () => <div className={`h-4 w-32 ${SKELETON}`} />,
    },
    {
      header: 'Top Gainers',
      cellClassName: 'flex gap-1 mr-5',
      cell: () => (
        <div className="flex gap-1">
          <div className={`h-7 w-7 rounded-full ${SKELETON}`} />
          <div className={`h-7 w-7 rounded-full ${SKELETON}`} />
          <div className={`h-7 w-7 rounded-full ${SKELETON}`} />
        </div>
      ),
    },
    {
      header: '24h Change',
      cellClassName: 'font-medium',
      cell: () => (
        <div className="flex gap-1 items-center pl-2 text-center font-medium">
          <div className={`h-3.5 w-3.5 rounded-full ${SKELETON}`} />
          <div className={`h-4 w-16 ${SKELETON}`} />
        </div>
      ),
    },
    {
      header: 'Market Cap',
      cellClassName: 'font-medium',
      cell: () => <div className={`h-4 w-24 ${SKELETON}`} />,
    },
    {
      header: '24h Volume',
      cellClassName: 'font-medium',
      cell: () => <div className={`h-4 w-20 ${SKELETON}`} />,
    },
  ];

  const dummyData = Array.from({ length: 10 }, (_, i) => ({ id: i }));

  return (
    <div className="pt-8 mt-5 w-full bg-dark-500 rounded-xl overflow-hidden">
      <h4 className="text-xl md:text-2xl font-semibold mb-2 pl-5">Top Categories</h4>
      <DataTable
        data={dummyData}
        columns={columns as any}
        rowKey={(item: any) => item.id}
        tableClassName="mt-3"
      />
    </div>
  );
};
