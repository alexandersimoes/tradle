import React from "react";
import { useTranslation } from "react-i18next";
import { formatDistance } from "../../domain/geography";
import { getStatsData } from "../../domain/stats";
import { Panel } from "./Panel";

interface StatsProps {
  isOpen: boolean;
  close: () => void;
  distanceUnit: "km" | "miles";
}

export function Stats({ isOpen, close, distanceUnit }: StatsProps) {
  const { t } = useTranslation();
  const {
    played,
    winRatio,
    currentStreak,
    maxStreak,
    averageBestDistance,
    guessDistribution,
  } = getStatsData();

  const maxDistribution = Math.max(...Object.values(guessDistribution));
  const distributionMax = maxDistribution || 1;

  return (
    <Panel title={t("stats.title")} isOpen={isOpen} close={close}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatsTile value={played} name={t("stats.played")} />
        <StatsTile value={Math.round(winRatio * 100)} name={t("stats.win")} />
        <StatsTile value={currentStreak} name={t("stats.currentStreak")} />
        <StatsTile value={maxStreak} name={t("stats.maxStreak")} />
      </div>

      <div className="my-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-100/90 p-5 text-center text-slate-900 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800 dark:text-slate-100 dark:shadow-black/20">
        <div className="flex flex-col">
          <p className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
            {formatDistance(averageBestDistance, distanceUnit)}
          </p>
          <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {t("stats.averageBestDistance")}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-4 text-slate-900 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {t("stats.guessDistribution")}
        </h3>
        <ul className="space-y-3">
          {Object.entries(guessDistribution).map(([index, count]) => (
            <li key={index} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {index}
              </div>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-oec-orange to-amber-300 dark:from-sky-500 dark:to-cyan-300"
                  style={{
                    width: `${Math.max(
                      8,
                      Math.round((count / distributionMax) * 100)
                    )}%`,
                  }}
                />
              </div>
              <div className="min-w-[2.5rem] text-right font-bold text-slate-700 dark:text-slate-200">
                {count}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

interface StatsTileProps {
  value: number;
  name: string;
}

function StatsTile({ value, name }: StatsTileProps) {
  return (
    <div className="flex min-h-[6.5rem] flex-col justify-center rounded-2xl border border-slate-200/80 bg-white/75 px-3 py-4 text-center text-slate-900 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20">
      <p className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {name}
      </p>
    </div>
  );
}
