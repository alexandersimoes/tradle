import { useEffect, useState } from "react";

// Session type based on the comment format
export interface SessionType {
  id: string;
  name: string;
  email: string;
  image: string;
}

export type OECSession = SessionType | false | null;

// Return session from parent with format
/*
{
  id: session.user.id,
  name: session.user.name,
  email: session.user.email,
  image: session.user.image,
  history: []
}
*/
export function useOECSession() {
  const [session, setSession] = useState<OECSession>(null);

  useEffect(() => {
    // Step 1: Ask parent for session
    const targetOrigins = [
      // "http://localhost:3000",
      "https://oec.world",
      "https://dev.oec.world",
      "https://staging.oec.world",
    ];

    let parentOrigin = "";
    try {
      // Try to get the parent origin from document.referrer
      const referrerUrl = new URL(document.referrer);
      parentOrigin = referrerUrl.origin;
    } catch {
      // fallback to '*'
    }

    // Only send to the matching origin in the list
    const matchedOrigin = targetOrigins.find(
      (origin) => origin === parentOrigin
    );
    if (parentOrigin !== "" && matchedOrigin) {
      window.parent.postMessage(
        {
          type: "requestSession",
          game: "pick-5",
          history: true, // set to true to include user's history
        },
        matchedOrigin
      );
    } else {
      console.warn("Parent origin not allowed");
    }

    // Step 2: Handle response
    const handleMessage = (event: MessageEvent) => {
      // Allow localhost, oec.world subdomain or the root domain
      const url = new URL(event.origin);
      const { hostname } = url;
      const isLocalhost = false; // change to true to test in local
      const isOecWorld =
        hostname.endsWith(".oec.world") || hostname === "oec.world";

      if (!isLocalhost && !isOecWorld) {
        console.warn("Origin not allowed");
        return;
      }

      if (event.data?.type === "session") {
        setSession(event.data.session);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return session;
}
