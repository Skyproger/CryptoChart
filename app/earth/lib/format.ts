export function formatUsd(n: number, digits = 2): string {
  if (n === 0) return '$0';
  const abs = Math.abs(n);
  if (abs >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  if (abs >= 1) return `$${n.toFixed(digits)}`;
  return `$${n.toPrecision(3)}`;
}

export function formatPct(n: number | null | undefined, digits = 2): string {
  if (n == null || Number.isNaN(n)) return '—';
  const s = n.toFixed(digits);
  return `${n >= 0 ? '+' : ''}${s}%`;
}
