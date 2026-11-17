'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestOnce(url: string, revalidate: number) {
  return fetch(url, {
    headers: {
      'x-cg-demo-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  let response = await requestOnce(url, revalidate);

  if (response.status === 429) {
    await sleep(1500);
    response = await requestOnce(url, revalidate);
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Слишком много запросов к CoinGecko. Подожди немного и обнови страницу.');
    }

    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody?.status?.error_message ||
      errorBody?.error_message ||
      (typeof errorBody?.error === 'string' ? errorBody.error : null) ||
      response.statusText;

    throw new Error(`API Error: ${response.status}: ${message} (${url})`);
  }

  return response.json();
}

export async function getLivePrice(
  coinId: string,
): Promise<{ usd: number; usd_24h_change?: number } | null> {
  try {
    const data = await fetcher<Record<string, { usd: number; usd_24h_change?: number }>>(
      '/simple/price',
      {
        ids: coinId,
        vs_currencies: 'usd',
        include_24hr_change: 'true',
      },
      15,
    );

    return data?.[coinId] ?? null;
  } catch (e) {
    console.error('Failed to fetch live price', e);
    return null;
  }
}
