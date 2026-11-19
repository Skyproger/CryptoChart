const BASE = 'https://api.coingecko.com/api/v3';

export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
};

export async function cgFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number },
): Promise<T> {
  const url = `${BASE}${path}`;
  const revalidate = init?.revalidate ?? 60;
  const apiKey = process.env.COINGECKO_API_KEY;
  const res = await fetch(url, {
    ...init,
    headers: {
      accept: 'application/json',
      ...(apiKey ? { 'x-cg-demo-api-key': apiKey } : {}),
      ...(init?.headers ?? {}),
    },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`CoinGecko ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}
