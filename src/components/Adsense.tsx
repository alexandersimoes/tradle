import React, { useEffect, CSSProperties, useRef } from "react";

interface AdSenseProps {
  client?: string;
  slot?: string;
  format?: string;
  responsive?: string;
  style?: CSSProperties;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

const AdSense: React.FC<AdSenseProps> = ({
  client = "ca-pub-1706971377772539",
  slot = "6371942046",
  format = "fluid",
  responsive = "true",
  style = {
    display: "block",
    minWidth: "250px",
    width: "100%", // or a specific width if appropriate
    height: "auto",
  },
}) => {
  const adRef = useRef(null);
  useEffect(() => {
    // Dynamically load the AdSense script if it's not already present
    if (!window.adsbygoogle) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      document.head.appendChild(script);
    }
    // Push the ad to the queue (required by Google AdSense)
    if (adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      ref={adRef}
    />
  );
};

export default AdSense;
