import countryContinents from './country-continents.json';
import type { MarketCoin } from './coingecko';

export type ContinentCode = 'NA' | 'SA' | 'EU' | 'AF' | 'AS' | 'OC' | 'AN';

export const CONTINENT_NAMES: Record<ContinentCode, string> = {
  NA: 'Северная Америка',
  SA: 'Южная Америка',
  EU: 'Европа',
  AF: 'Африка',
  AS: 'Азия',
  OC: 'Океания',
  AN: 'Антарктида',
};

/**
 * Fixed color per continent, chosen for maximum mutual distinction on a dark globe.
 * Independent from the coin's brand color, so viewers can memorize continent = hue.
 */
export const CONTINENT_COLORS: Record<ContinentCode, string> = {
  NA: '#F7931A', // orange (BTC-ish)
  AS: '#FF3D9A', // hot pink
  EU: '#F5D000', // vivid yellow
  SA: '#9945FF', // purple
  AF: '#00C2FF', // cyan blue
  OC: '#14F195', // neon green
  AN: '#94a3b8', // gray, if ever shown
};

/**
 * Visual pairing order — coin rank #1 lands on the first continent in this list.
 * Order is deliberate: continents you associate with the biggest crypto activity first.
 */
export const CONTINENT_ORDER: ContinentCode[] = ['NA', 'AS', 'EU', 'SA', 'AF', 'OC'];

/** Coin ids we skip when picking the "top" — stablecoins never move, boring on a globe. */
const SKIP_COIN_IDS = new Set([
  'tether',
  'usd-coin',
  'dai',
  'binance-usd',
  'true-usd',
  'first-digital-usd',
  'paypal-usd',
  'usde',
  'ethena-usde',
  'wrapped-bitcoin',
  'wrapped-steth',
  'staked-ether',
  'weth',
]);

// Generated from world-countries 5.1.0: ISO numeric code → continent.
// Keep padded and unpadded keys to match the globe's country IDs.
const COUNTRY_TO_CONTINENT = new Map<string, ContinentCode>();
for (const [code, continent] of Object.entries(countryContinents)) {
  COUNTRY_TO_CONTINENT.set(code, continent as ContinentCode);
  COUNTRY_TO_CONTINENT.set(String(parseInt(code, 10)), continent as ContinentCode);
}

export function continentOf(id: string | number | undefined): ContinentCode | null {
  if (id == null) return null;
  const key = typeof id === 'number' ? String(id) : id;
  return COUNTRY_TO_CONTINENT.get(key) ?? COUNTRY_TO_CONTINENT.get(key.padStart(3, '0')) ?? null;
}

/**
 * Assign top-N non-stablecoin coins to continents in CONTINENT_ORDER.
 * Returns { continent → coin } and the reverse mapping helpers.
 */
export function assignCoinsToContinents(coins: MarketCoin[]): {
  map: Map<ContinentCode, MarketCoin>;
  list: Array<{ continent: ContinentCode; name: string; coin: MarketCoin }>;
} {
  const map = new Map<ContinentCode, MarketCoin>();
  const filtered = coins
    .filter((c) => !SKIP_COIN_IDS.has(c.id))
    .sort((a, b) => a.market_cap_rank - b.market_cap_rank);

  CONTINENT_ORDER.forEach((cont, i) => {
    const coin = filtered[i];
    if (coin) map.set(cont, coin);
  });

  const list = CONTINENT_ORDER.filter((c) => map.has(c)).map((c) => ({
    continent: c,
    name: CONTINENT_NAMES[c],
    coin: map.get(c)!,
  }));

  return { map, list };
}
