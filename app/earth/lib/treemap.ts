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
  height: number,
): TreemapRect<T>[] {
  const area = width * height;
  if (
    !items.length ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0 ||
    !Number.isFinite(area) ||
    area <= 0
  )
    return [];

  const positiveItems = items.filter((item) => Number.isFinite(item.value) && item.value > 0);
  if (!positiveItems.length) return [];

  // Normalize first so even multiple Number.MAX_VALUE inputs cannot overflow the sum.
  const maxValue = positiveItems.reduce((max, item) => Math.max(max, item.value), 0);
  const normalized = positiveItems.map((item) => ({
    value: item.value / maxValue,
    payload: item.payload,
  }));
  const total = normalized.reduce((sum, item) => sum + item.value, 0);
  const scaled = normalized
    .map((item) => ({ value: (item.value / total) * area, payload: item.payload }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const out: TreemapRect<T>[] = [];
  layout(scaled, { x: 0, y: 0, w: width, h: height }, out);
  return out;
}

function layout<T>(items: { value: number; payload: T }[], rect: Rect, out: TreemapRect<T>[]) {
  let index = 0;

  // Every row consumes at least one item; no recursion or unchanged remainder.
  while (index < items.length && rect.w > 0 && rect.h > 0) {
    const row: typeof items = [];
    let best = Infinity;
    const short = Math.min(rect.w, rect.h);

    while (index < items.length) {
      const next = [...row, items[index]];
      const worst = worstRatio(next, short);
      if (row.length > 0 && !(worst <= best)) break;

      row.push(items[index]);
      index += 1;
      best = worst;
    }

    rect = placeRow(row, rect, out);
  }
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
  out: TreemapRect<T>[],
): Rect {
  const sum = row.reduce((s, r) => s + r.value, 0);
  const horizontal = rect.w >= rect.h;
  if (horizontal) {
    const w = Math.min(rect.w, sum / rect.h);
    let y = rect.y;
    for (const r of row) {
      const h = r.value / w;
      out.push({ x: rect.x, y, w, h, payload: r.payload });
      y += h;
    }
    return { x: rect.x + w, y: rect.y, w: rect.w - w, h: rect.h };
  } else {
    const h = Math.min(rect.h, sum / rect.w);
    let x = rect.x;
    for (const r of row) {
      const w = r.value / h;
      out.push({ x, y: rect.y, w, h, payload: r.payload });
      x += w;
    }
    return { x: rect.x, y: rect.y + h, w: rect.w, h: rect.h - h };
  }
}
