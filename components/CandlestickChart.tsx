'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getCandlestickConfig, getChartConfig, PERIOD_BUTTONS, PERIOD_CONFIG } from '@/constants';
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { fetcher } from '@/lib/coingecko.actions';
import { convertOHLCData } from '@/lib/utils';

const CandlestickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
}: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const lastFittedPeriodRef = useRef<Period | null>(null);
  const [chartData, setChartData] = useState({ period: initialPeriod, data: data ?? [] });
  const [isPending, setIsPending] = useState(false);
  const { period, data: ohlcData } = chartData;

  const preparedCandles = useMemo(() => {
    const convertedToSeconds = ohlcData.map(
      (item) => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData,
    );
    return convertOHLCData(convertedToSeconds);
  }, [ohlcData]);

  const handlePeriodChange = async (newPeriod: Period) => {
    if (newPeriod === period || isPending) return;

    setIsPending(true);
    try {
      const { days } = PERIOD_CONFIG[newPeriod];
      const newData = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days,
        precision: 'full',
      });

      // Keep the selected period and its candles in sync, including on request failure.
      setChartData({ period: newPeriod, data: newData ?? [] });
    } catch (e) {
      console.error('Failed to fetch OHLCData', e);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      ...getChartConfig(container.clientHeight),
      width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());

    chartRef.current = chart;
    candleSeriesRef.current = series;
    lastFittedPeriodRef.current = null;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.applyOptions({
      height,
      timeScale: { timeVisible: ['daily', 'weekly', 'monthly'].includes(period) },
    });
  }, [height, period]);

  useEffect(() => {
    const chart = chartRef.current;
    const series = candleSeriesRef.current;
    if (!chart || !series) return;

    series.setData(preparedCandles);

    if (lastFittedPeriodRef.current !== period && preparedCandles.length > 0) {
      chart.timeScale().fitContent();
      lastFittedPeriodRef.current = period;
    }
  }, [preparedCandles, period]);

  return (
    <div className="p-3 mt-5 rounded-lg bg-dark-500">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center mb-4 font-semibold text-[#e6eef8] text-[20px]">
        <div className="flex-1">{children}</div>

        <div className="flex gap-1 xl:gap-2 items-center">
          <span className="text-sm mx-2 font-medium text-purple-100/50">Period:</span>
          {PERIOD_BUTTONS.map(({ value, label }) => {
            const isActive = period === value;
            return (
              <button
                key={value}
                className={
                  isActive
                    ? 'rounded-sm px-2.5 py-1.5 border-0 cursor-pointer text-sm text-[#1a1a1a] bg-[#f3994f]'
                    : 'rounded-sm border-0 cursor-pointer px-2.5 py-2 text-xs xl:text-sm text-purple-100 hover:bg-dark-400 hover:text-white'
                }
                onClick={() => handlePeriodChange(value)}
                disabled={isPending}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full min-h-50" style={{ height }} />
    </div>
  );
};

export default CandlestickChart;
