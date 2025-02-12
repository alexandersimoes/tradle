import { useEffect, useMemo, useState } from "react";
import { countriesWithImage, Country } from "../domain/countries";

export function useCountry(dayString: string): [Country | undefined] {
  const [forcedCountryCode, setForcedCountryCode] = useState("");

  useEffect(() => {
    const randomCountryCode =
      countriesWithImage[Math.floor(Math.random() * countriesWithImage.length)]
        .code;
    setForcedCountryCode(randomCountryCode);
  }, [dayString]);

  const country = useMemo(() => {
    const forcedCountry =
      forcedCountryCode !== ""
        ? countriesWithImage.find(
            (country) => country.code === forcedCountryCode
          )
        : undefined;
    return forcedCountry;
  }, [forcedCountryCode]);
  return [country];
}
