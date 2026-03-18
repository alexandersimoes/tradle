"use client";

import React from "react";

const BOTMARKET_URL = "https://botmarket.oec.world/";

export function BotMarketLink() {
  return (
    <div style={{ textAlign: "center" }}>
      <a
        href={BOTMARKET_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-block" }}
      >
        <img
          src="/en/tradle/images/botmarket.jpg"
          alt="BotMarket - The Data Marketplace for AI Agents"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            border: "1px solid #ccc",
          }}
        />
      </a>
    </div>
  );
}
