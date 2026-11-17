export type TreemapItem<T> = { value: number; payload: T };
export type TreemapRect<T> = {
  x: number;
  y: number;
  w: number;
  h: number;
  payload: T;
};

type Rect = { x: number; y: number; w: number; h: number };

/**
 * Squarified treemap (Bruls, Huijing, van Wijk).
 * Values must be positive; container is [0..width]x[0..height].
 */
export function squarify<T>(
  items: TreemapItem<T>[],
  width: number,
  height: number
): TreemapRect<T>[] {
  if (!items.length || width <= 0 || height <= 0) return [];
  const total = items.reduce((s, i) => s + i.value, 0);
  const scale = (width * height) / total;
  const scaled = items
    .filter((i) => i.value > 0)
    .map((i) => ({ value: i.value * scale, payload: i.payload }))
    .sort((a, b) => b.value - a.value);

  const out: TreemapRect<T>[] = [];
  layout(scaled, { x: 0, y: 0, w: width, h: height }, out);
  return out;
}

function layout<T>(
  items: { value: number; payload: T }[],
  rect: Rect,
  out: TreemapRect<T>[]
) {
  if (!items.length) return;
  const row: typeof items = [];
  let best = Infinity;
  const short = Math.min(rect.w, rect.h);

  for (let i = 0; i < items.length; i++) {
    const next = [...row, items[i]];
    const worst = worstRatio(next, short);
    if (worst <= best) {
      row.push(items[i]);
      best = worst;
    } else {
      const consumed = placeRow(row, rect, out);
      const remaining = items.slice(i);
      layout(remaining, consumed, out);
      return;
    }
  }
  placeRow(row, rect, out);
}

function worstRatio<T>(row: { value: number; payload: T }[], short: number) {
  const sum = row.reduce((s, r) => s + r.value, 0);
  if (sum <= 0) return Infinity;
  const s2 = short * short;
  const sum2 = sum * sum;
  let max = -Infinity;
  let min = Infinity;
  for (const r of row) {
    if (r.value > max) max = r.value;
    if (r.value < min) min = r.value;
  }
  return Math.max((s2 * max) / sum2, sum2 / (s2 * min));
}

function placeRow<T>(
  row: { value: number; payload: T }[],
  rect: Rect,
  out: TreemapRect<T>[]
): Rect {
  const sum = row.reduce((s, r) => s + r.value, 0);
  const horizontal = rect.w >= rect.h;
  if (horizontal) {
    const w = sum / rect.h;
    let y = rect.y;
    for (const r of row) {
      const h = r.value / w;
      out.push({ x: rect.x, y, w, h, payload: r.payload });
      y += h;
    }
    return { x: rect.x + w, y: rect.y, w: rect.w - w, h: rect.h };
  } else {
    const h = sum / rect.w;
    let x = rect.x;
    for (const r of row) {
      const w = r.value / h;
      out.push({ x, y: rect.y, w, h, payload: r.payload });
      x += w;
    }
    return { x: rect.x, y: rect.y + h, w: rect.w, h: rect.h - h };
  }
}

