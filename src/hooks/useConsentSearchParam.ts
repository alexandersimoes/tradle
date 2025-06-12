import { useEffect, useState } from "react";

const useConsentFromSearchParams = (): boolean => {
  const [consent, setConsent] = useState<boolean>(false);

  useEffect(() => {
    const getConsentFromURL = (): boolean => {
      if (typeof window === "undefined") return false;

      const searchParams = new URLSearchParams(window.location.search);
      const consentParam = searchParams.get("consent");

      if (consentParam && typeof consentParam === "string") {
        // Convert string to boolean
        return consentParam.toLowerCase() === "true";
      }

      return true; // force true for standalone mode
    };

    setConsent(getConsentFromURL());
  }, []);

  return consent;
};

export default useConsentFromSearchParams;
