"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { feature } from "topojson-client";
import * as THREE from "three";
import type { Feature, FeatureCollection, Geometry, Polygon, MultiPolygon } from "geojson";
import type { Topology } from "topojson-specification";
import type { MarketCoin } from "../lib/coingecko";
import {
  assignCoinsToContinents,
  CONTINENT_COLORS,
  continentOf,
  type ContinentCode,
} from "../lib/continents";
import rawTopo from "../lib/countries-110m.json";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const topo = rawTopo as unknown as Topology;

type CountryFeature = Feature<Polygon | MultiPolygon, { name: string }> & {
  id: string | number;
  __continent: ContinentCode | null;
};

export function Globe3D({ coins }: { coins: MarketCoin[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const configured = useRef(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (configured.current) return;
    if (size.w === 0 || size.h === 0) return;
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls?.();
    if (!controls) return;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enablePan = false;
    controls.minDistance = 101;
    controls.maxDistance = 800;
    controls.zoomSpeed = 1.5;
    if (typeof g.pointOfView === "function") {
      g.pointOfView({ altitude: 2.2 }, 0);
    }
    configured.current = true;
  }, [size.w, size.h]);

  const countries = useMemo<CountryFeature[]>(() => {
    const obj = topo.objects.countries;
    if (!obj) return [];
    const fc = feature(topo, obj) as unknown as FeatureCollection<Geometry, { name: string }>;
    return fc.features
      .filter(
        (f): f is Feature<Polygon | MultiPolygon, { name: string }> =>
          f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon"
      )
      .map((f) => ({
        ...f,
        id: (f.id ?? f.properties.name) as string | number,
        __continent: continentOf(f.id ?? undefined),
      })) as CountryFeature[];
  }, []);

  const { map: continentToCoin, list: legend } = useMemo(
    () => assignCoinsToContinents(coins),
    [coins]
  );

  const globeMaterial = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: "#05080f",
        emissive: "#020409",
        shininess: 5,
      }),
    []
  );

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full overflow-hidden rounded border border-neutral-800/80 bg-neutral-950/60"
    >
      <div className="pointer-events-none absolute left-3 top-2 z-10 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80">
          глобус
        </span>
        <span className="text-[10px] uppercase tracking-widest text-neutral-500">
          6 континентов = топ-6 монет по капитализации
        </span>
      </div>

      <div className="pointer-events-auto absolute right-3 top-2 z-10 flex flex-col gap-1 border border-neutral-800 bg-neutral-950/85 p-2 text-[10px] font-mono uppercase tracking-wider backdrop-blur">
        {legend.length === 0 && (
          <span className="text-neutral-500">нет данных</span>
        )}
        {legend.map(({ continent, name, coin }) => {
          const color = CONTINENT_COLORS[continent];
          return (
            <div key={continent} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-4 rounded-sm"
                style={{ background: color, boxShadow: `0 0 8px ${color}80` }}
              />
              <span className="w-[140px] text-neutral-400">{name}</span>
              <span className="w-[42px] font-semibold" style={{ color }}>
                {coin.symbol.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute bottom-2 right-3 z-10 text-[10px] uppercase tracking-widest text-neutral-500">
        тянуть · колесо — приблизить · авто-вращение
      </div>

      {size.w > 0 && size.h > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          showGlobe
          showAtmosphere
          atmosphereColor="#38bdf8"
          atmosphereAltitude={0.2}
          globeImageUrl={null}
          globeMaterial={globeMaterial}
          polygonsData={countries}
          polygonGeoJsonGeometry={(d: any) => d.geometry}
          polygonAltitude={(d: any) =>
            continentToCoin.has(d.__continent) ? 0.022 : 0.004
          }
          polygonCapColor={(d: any) => {
            const cont = d.__continent as ContinentCode | null;
            if (!cont || !continentToCoin.has(cont)) return "rgba(50,54,66,0.55)";
            return CONTINENT_COLORS[cont];
          }}
          polygonSideColor={() => "rgba(5, 8, 16, 0.9)"}
          polygonStrokeColor={() => "rgba(5, 8, 16, 0.9)"}
          polygonsTransitionDuration={800}
        />
      )}
    </div>
  );
}

