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
  "01": "#a4d869",
  "02": "#79c267",
  "03": "#c9a55c",
  "04": "#e2cf60",
  "05": "#a26b3f",
  "06": "#e58981",
  "07": "#d56e6e",
  "08": "#8e6f4f",
  "09": "#a2845e",
  "10": "#f1d480",
  "11": "#9b6fa6",
  "12": "#cf8acf",
  "13": "#b1b1b1",
  "14": "#ead46a",
  "15": "#7a7a7a",
  "16": "#5f9bcf",
  "17": "#477fb6",
  "18": "#7fb6df",
  "19": "#2c2c2c",
  "20": "#c97cb4",
  "21": "#9ac09a",
};

const formatUSD = (n: number) => format("$.3~s")(n).replace("G", "B");

interface Section {
  id: string;
  name: string;
  value: number;
}

interface Cell {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  value: number;
  name: string;
  id: string;
  sectionId: string;
}

interface LeafDatum {
  name: string;
  value: number;
  id: string;
  sectionId: string;
}

function layoutCells(
  leaves: LeafDatum[],
  width: number,
  height: number
): Cell[] {
  const root = hierarchy<{
    name: string;
    value?: number;
    id?: string;
    sectionId?: string;
    children?: LeafDatum[];
  }>({ name: "root", children: leaves })
    .sum((d) => (d as { value?: number }).value ?? 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  treemap<typeof root extends { data: infer D } ? D : never>()
    .size([width, height])
    .paddingInner(1)
    .round(true)(root as never);

  return root.leaves().map((n) => {
    const d = n.data as LeafDatum;
    return {
      x0: (n as never as { x0: number }).x0,
      y0: (n as never as { y0: number }).y0,
      x1: (n as never as { x1: number }).x1,
      y1: (n as never as { y1: number }).y1,
      value: n.value ?? 0,
      name: d.name,
      id: d.id,
      sectionId: d.sectionId,
    };
  });
}

function truncate(label: string, maxChars: number): string {
  if (maxChars <= 1) return "";
  return label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label;
}

export function CountryTreemap({ country, year }: Props) {
  const [rows, setRows] = useState<ApiRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setError(null);
    setSelectedSection(null);

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
    const el = chartRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setChartSize({ width: rect.width, height: rect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sections: Section[] = useMemo(() => {
    if (!rows) return [];
    const map = new Map<string, Section>();
    for (const r of rows) {
      const id = r["Section Official ID"];
      const existing = map.get(id);
      if (existing) {
        existing.value += r["Trade Value"];
      } else {
        map.set(id, {
          id,
          name: r["Section Official"],
          value: r["Trade Value"],
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [rows]);

  const total = useMemo(
    () => sections.reduce((s, sec) => s + sec.value, 0),
    [sections]
  );

  const cells: Cell[] | null = useMemo(() => {
    if (
      !rows ||
      rows.length === 0 ||
      chartSize.width < 1 ||
      chartSize.height < 1
    ) {
      return null;
    }

    if (selectedSection) {
      const leaves: LeafDatum[] = rows
        .filter((r) => r["Section Official ID"] === selectedSection)
        .map((r) => ({
          name: r["HS4 Official"],
          value: r["Trade Value"],
          id: r["HS4 Official ID"],
          sectionId: r["Section Official ID"],
        }));
      return layoutCells(leaves, chartSize.width, chartSize.height);
    }

    const leaves: LeafDatum[] = sections.map((s) => ({
      name: s.name,
      value: s.value,
      id: s.id,
      sectionId: s.id,
    }));
    return layoutCells(leaves, chartSize.width, chartSize.height);
  }, [rows, sections, selectedSection, chartSize.width, chartSize.height]);

  const handleCellClick = (cell: Cell) => {
    if (selectedSection) return;
    setSelectedSection(cell.id);
  };

  const handleLegendClick = (sectionId: string) => {
    setSelectedSection((current) => (current === sectionId ? null : sectionId));
  };

  const selectedSectionName = selectedSection
    ? sections.find((s) => s.id === selectedSection)?.name
    : null;

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-gray-900">
      <div className="flex items-baseline justify-between px-2 py-1 gap-2">
        <div className="text-sm font-semibold truncate">
          {selectedSectionName ?? "Total exports"}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-base font-bold tabular-nums">
            {total > 0 ? formatUSD(total) : ""}
          </div>
          {selectedSection && (
            <button
              type="button"
              onClick={() => setSelectedSection(null)}
              className="text-xs underline text-gray-600 hover:text-gray-900"
            >
              back
            </button>
          )}
        </div>
      </div>

      <div ref={chartRef} className="relative flex-1 min-h-0">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-sm text-center text-gray-700">
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
            width={chartSize.width}
            height={chartSize.height}
            style={{ display: "block" }}
          >
            {cells.map((c) => {
              const w = c.x1 - c.x0;
              const h = c.y1 - c.y0;
              const fill = SECTION_COLORS[c.sectionId] ?? "#999999";
              const showLabel = w > 50 && h > 24;
              const showValue = w > 70 && h > 40;
              const labelMax = Math.max(1, Math.floor((w - 8) / 6));
              const clickable = !selectedSection;
              return (
                <g
                  key={c.id}
                  transform={`translate(${c.x0},${c.y0})`}
                  onClick={clickable ? () => handleCellClick(c) : undefined}
                  style={{ cursor: clickable ? "pointer" : "default" }}
                >
                  <title>{`${c.name}: ${formatUSD(c.value)}`}</title>
                  <rect width={w} height={h} fill={fill} stroke="#ffffff" />
                  {showLabel && (
                    <text
                      x={4}
                      y={14}
                      fontSize={11}
                      fill="#111111"
                      style={{ pointerEvents: "none" }}
                    >
                      {truncate(c.name, labelMax)}
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
                      {formatUSD(c.value)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {sections.length > 0 && (
        <div className="flex flex-wrap gap-1 px-2 py-2 border-t border-gray-200 max-h-[35%] overflow-y-auto">
          {sections.map((s) => {
            const active = s.id === selectedSection;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleLegendClick(s.id)}
                className={`flex items-center gap-1 text-[10px] leading-tight px-1.5 py-0.5 rounded border transition-opacity ${
                  active
                    ? "border-gray-900 bg-white font-semibold"
                    : selectedSection
                    ? "border-transparent opacity-50 hover:opacity-100"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm"
                  style={{ background: SECTION_COLORS[s.id] ?? "#999" }}
                />
                <span className="whitespace-nowrap">{s.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
