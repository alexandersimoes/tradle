"use client";

import React from "react";

const OEC_URL = "https://oec.world/";

export function OecLink() {
  return (
    <div style={{ textAlign: "center" }}>
      <a
        href={OEC_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-block" }}
      >
        <img
          src="/en/tradle/images/oec-banner.png"
          alt="OEC - Decode Global Trade. Unlock Strategic Insight."
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
