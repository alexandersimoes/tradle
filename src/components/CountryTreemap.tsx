import React, { useEffect, useMemo, useRef, useState } from "react";
import { hierarchy, treemap } from "d3-hierarchy";
import { format } from "d3-format";

interface ApiRow {
  "Section Official ID": string;
  "Section Official": string;
  "HS4 Official ID": string;
  "HS4 Official": string;
  "Trade Value": number;
}

interface ApiResponse {
  data?: ApiRow[];
}

interface Props {
  country: string;
  year: number;
}

// HS section palette tuned to roughly match OEC's traditional section colors.
const SECTION_COLORS: Record<string, string> = {
  "01": "#a4d869", // Animal Products
  "02": "#79c267", // Vegetable Products
  "03": "#c9a55c", // Animal & Vegetable Bi-Products
  "04": "#e2cf60", // Foodstuffs
  "05": "#a26b3f", // Mineral Products
  "06": "#e58981", // Chemical Products
  "07": "#d56e6e", // Plastics & Rubbers
  "08": "#8e6f4f", // Animal Hides
  "09": "#a2845e", // Wood Products
  "10": "#f1d480", // Paper Goods
  "11": "#9b6fa6", // Textiles
  "12": "#cf8acf", // Footwear & Headwear
  "13": "#b1b1b1", // Stone & Glass
  "14": "#ead46a", // Precious Metals
  "15": "#7a7a7a", // Metals
  "16": "#5f9bcf", // Machines
  "17": "#477fb6", // Transportation
  "18": "#7fb6df", // Instruments
  "19": "#2c2c2c", // Weapons
  "20": "#c97cb4", // Miscellaneous
  "21": "#9ac09a", // Arts & Antiques
};

const formatUSD = format("$.3~s");

interface Cell {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  value: number;
  name: string;
  sectionId: string;
  sectionName: string;
}

function buildLayout(rows: ApiRow[], width: number, height: number): Cell[] {
  const bySection = new Map<
    string,
    {
      sectionId: string;
      sectionName: string;
      children: { name: string; value: number }[];
    }
  >();

  for (const r of rows) {
    const sid = r["Section Official ID"];
    let section = bySection.get(sid);
    if (!section) {
      section = {
        sectionId: sid,
        sectionName: r["Section Official"],
        children: [],
      };
      bySection.set(sid, section);
    }
    section.children.push({
      name: r["HS4 Official"],
      value: r["Trade Value"],
    });
  }

  const root = hierarchy<{
    name: string;
    value?: number;
    sectionId?: string;
    sectionName?: string;
    children?: unknown[];
  }>({
    name: "root",
    children: Array.from(bySection.values()).map((s) => ({
      name: s.sectionName,
      sectionId: s.sectionId,
      sectionName: s.sectionName,
      children: s.children,
    })),
  } as never)
    .sum((d) => (d as { value?: number }).value ?? 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  treemap<typeof root extends { data: infer D } ? D : never>()
    .size([width, height])
    .paddingInner(1)
    .round(true)(root as never);

  return root.leaves().map((n) => {
    const parentData = n.parent?.data as {
      sectionId?: string;
      sectionName?: string;
    };
    return {
      x0: (n as never as { x0: number }).x0,
      y0: (n as never as { y0: number }).y0,
      x1: (n as never as { x1: number }).x1,
      y1: (n as never as { y1: number }).y1,
      value: n.value ?? 0,
      name: n.data.name,
      sectionId: parentData?.sectionId ?? "",
      sectionName: parentData?.sectionName ?? "",
    };
  });
}

export function CountryTreemap({ country, year }: Props) {
  const [rows, setRows] = useState<ApiRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setError(null);

    const params = new URLSearchParams({
      cube: "trade_i_baci_a_96",
      drilldowns: "Section Official,HS4 Official",
      measures: "Trade Value",
      Year: String(year),
      "Exporter Country Official": country,
      parents: "true",
    });
    const url = `https://api-v2.oec.world/tesseract/data.jsonrecords?${params}`;

    fetch(url)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))
      )
      .then((d: ApiResponse) => {
        if (!cancelled) setRows(d.data ?? []);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });

    return () => {
      cancelled = true;
    };
  }, [country, year]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setSize({ width: rect.width, height: rect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cells = useMemo(() => {
    if (!rows || rows.length === 0 || size.width < 1 || size.height < 1) {
      return null;
    }
    return buildLayout(rows, size.width, size.height);
  }, [rows, size.width, size.height]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-gray-50 dark:bg-slate-800"
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-sm text-center text-gray-700 dark:text-gray-200">
          Couldn&apos;t load trade data ({error}).
        </div>
      )}
      {!error && !cells && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          Loading trade data…
        </div>
      )}
      {cells && (
        <svg
          width={size.width}
          height={size.height}
          style={{ display: "block" }}
        >
          {cells.map((c, i) => {
            const w = c.x1 - c.x0;
            const h = c.y1 - c.y0;
            const fill = SECTION_COLORS[c.sectionId] ?? "#999999";
            const showLabel = w > 50 && h > 24;
            const showValue = w > 70 && h > 40;
            return (
              <g key={i} transform={`translate(${c.x0},${c.y0})`}>
                <title>{`${c.name} — ${c.sectionName}: ${formatUSD(
                  c.value
                ).replace("G", "B")}`}</title>
                <rect width={w} height={h} fill={fill} stroke="#ffffff" />
                {showLabel && (
                  <text
                    x={4}
                    y={14}
                    fontSize={11}
                    fill="#111111"
                    style={{ pointerEvents: "none" }}
                  >
                    {c.name.length > Math.floor(w / 6)
                      ? `${c.name.slice(0, Math.floor(w / 6) - 1)}…`
                      : c.name}
                  </text>
                )}
                {showValue && (
                  <text
                    x={4}
                    y={28}
                    fontSize={10}
                    fill="#222222"
                    style={{ pointerEvents: "none" }}
                  >
                    {formatUSD(c.value).replace("G", "B")}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
