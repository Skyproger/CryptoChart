"use client";

import dynamic from "next/dynamic";

const CandlestickChart = dynamic(
  () => import("@/components/CandlestickChart"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full">
        Loading chart...
      </div>
    ),
  }
);

export default CandlestickChart;