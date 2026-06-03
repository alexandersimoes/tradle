"use client";

import React from "react";

const WORLD_TRADE_CUP_URL = "https://worldcup.oec.world/";

export function WorldTradeCupLink() {
  return (
    <div style={{ textAlign: "center" }}>
      <a
        href={WORLD_TRADE_CUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-block" }}
      >
        <img
          src="/en/tradle/images/wt-cup.png"
          alt="World Trade Cup - Which country trades like a champion?"
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
