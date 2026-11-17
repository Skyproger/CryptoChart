import type { Metadata } from "next";
import { Heatmap } from "./components/Heatmap";
import { Globe3D } from "./components/Globe3D";
import { cgFetch, type MarketCoin } from "./lib/coingecko";
import "./globalss.css";

export const metadata: Metadata = {
  title: "CryptoChart Terminal",
  description: "Crypto market terminal — global stats, heatmap and 3D exchange globe.",
};

async function getCoins(): Promise<MarketCoin[]> {
  try {
    return await cgFetch<MarketCoin[]>(
      "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h",
      { revalidate: 60 }
    );
  } catch {
    return [];
  }
}

export default async function Home() {
  const coins = await getCoins();

  return (
    <main className="flex min-h-screen flex-col">
      <section className="grid flex-1 gap-3 p-3 lg:grid-cols-6">
        <div id="globe" className="lg:col-span-4 h-[75vh] lg:h-auto min-h-[560px] order-1 lg:order-2">
          <Globe3D coins={coins} />
        </div>
        <div id="heatmap" className="lg:col-span-2 h-[70vh] lg:h-auto min-h-[520px] order-2 lg:order-1">
          <Heatmap coins={coins} />
        </div>
      </section>
    </main>
  );
}


