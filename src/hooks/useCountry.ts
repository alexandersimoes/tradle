import { csv } from "d3-fetch";
import { useEffect, useMemo, useState } from "react";
import { countriesWithImage, Country } from "../domain/countries";

interface DateCountry {
  country: string;
  date: string;
}

export function useCountry(dayString: string): [Country | undefined] {
  const [forcedCountryCode, setForcedCountryCode] = useState("");

  useEffect(() => {
    const randomCountryCode = countriesWithImage[Math.floor(Math.random() * countriesWithImage.length)].code;
    setForcedCountryCode(randomCountryCode);
  });

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
