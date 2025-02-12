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
    csv("/en/tradle/data.csv", (d) => {
      return { country: d.country, date: d.date };
    }).then((data) => {
      setForcedCountryCode(
        data.length
          ? (
              data.find((el) => el.date === dayString) as DateCountry
            )?.country.toUpperCase() || ""
          : ""
      );
    });
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
