"use client";

import React from "react";

const BOTMARKET_URL = "https://botmarket.oec.world/";

export function BotMarketLink() {
  return (
    <div className="mb-2 text-center">
      <a
        href={BOTMARKET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block overflow-hidden rounded-sm border border-slate-300 shadow-sm shadow-slate-300/70 transition-shadow hover:shadow-md hover:shadow-slate-400/60 dark:border-slate-700 dark:shadow-slate-950/40 dark:hover:shadow-black/50"
      >
        <img
          src="/en/tradle/images/botmarket.jpg"
          alt="BotMarket - The Data Marketplace for AI Agents"
          className="block h-auto max-w-full"
        />
      </a>
    </div>
  );
}
