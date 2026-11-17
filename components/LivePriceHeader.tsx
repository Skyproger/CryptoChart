'use client';

import { useEffect, useState } from 'react';
import CoinHeader from '@/components/CoinHeader';
import { getLivePrice } from '@/lib/coingecko.actions';

const POLL_INTERVAL_MS = 20_000;

interface LivePriceHeaderProps {
  coinId: string;
  name: string;
  image: string;
  initialPrice: number;
  initialPriceChangePercentage24h: number;
  priceChangePercentage30d: number;
  priceChange24h: number;
}

const LivePriceHeader = ({
  coinId,
  name,
  image,
  initialPrice,
  initialPriceChangePercentage24h,
  priceChangePercentage30d,
  priceChange24h,
}: LivePriceHeaderProps) => {
  const [price, setPrice] = useState(initialPrice);
  const [change24h, setChange24h] = useState(initialPriceChangePercentage24h);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      const data = await getLivePrice(coinId);
      if (cancelled || !data) return;
      setPrice(data.usd);
      if (typeof data.usd_24h_change === 'number') {
        setChange24h(data.usd_24h_change);
      }
    };

    const interval = setInterval(tick, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [coinId]);

  return (
    <CoinHeader
      name={name}
      image={image}
      livePrice={price}
      livePriceChangePercentage24h={change24h}
      priceChangePercentage30d={priceChangePercentage30d}
      priceChange24h={priceChange24h}
    />
  );
};

export default LivePriceHeader;
