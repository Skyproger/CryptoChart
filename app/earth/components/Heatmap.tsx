'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { MarketCoin } from '../lib/coingecko';
import { formatPct, formatUsd } from '../lib/format';
import { squarify, type TreemapRect } from '../lib/treemap';
import { assignCoinsToContinents, CONTINENT_COLORS, type ContinentCode } from '../lib/continents';

type HeatmapPayload = { coin: MarketCoin; color: string; continent: ContinentCode };

export function Heatmap({ coins }: { coins: MarketCoin[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const rects = useMemo<TreemapRect<HeatmapPayload>[]>(() => {
    if (!coins.length || !size.w || !size.h) return [];
    const { list } = assignCoinsToContinents(coins);
    return squarify(
      list.map(({ coin, continent }) => ({
        value: coin.market_cap,
        payload: { coin, continent, color: CONTINENT_COLORS[continent] },
      })),
      size.w,
      size.h,
    );
  }, [coins, size]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded border border-neutral-800/80 bg-neutral-950/60">
      <header className="flex items-center justify-between border-b border-neutral-800/80 px-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80">
            тепловая карта
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            топ-6 · капитализация
          </span>
        </div>
      </header>

      <div ref={wrapRef} className="relative flex-1">
        {!coins.length && (
          <div className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-widest text-neutral-500">
            нет данных
          </div>
        )}
        {rects.map(({ x, y, w, h, payload: { coin: c, color } }) => {
          const showLabel = w > 46 && h > 34;
          const showSub = w > 70 && h > 54;
          return (
            <div
              key={c.id}
              className="absolute overflow-hidden"
              style={{
                left: x,
                top: y,
                width: w,
                height: h,
                background: color,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35)',
              }}
            >
              {showLabel && (
                <div
                  className="flex h-full flex-col justify-between p-1.5"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}
                >
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="truncate font-mono text-[11px] font-semibold uppercase text-white">
                      {c.symbol}
                    </span>
                    {showSub && (
                      <span className="font-mono text-[10px] text-white/85">
                        #{c.market_cap_rank}
                      </span>
                    )}
                  </div>
                  {showSub && (
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="truncate font-mono text-[10px] text-white/90">
                        {formatUsd(c.current_price)}
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-white">
                        {formatPct(c.price_change_percentage_24h)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
