import { DateTime } from "luxon";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  getCountryName,
  countryISOMapping,
  getFictionalCountryByName,
  getCountryByName,
} from "../domain/countries";
import { getCompassDirection } from "../domain/geography";
import { useGuesses } from "../hooks/useGuesses";
import { CountryInput } from "./CountryInput";
import * as geolib from "geolib";
import { Share } from "./Share";
import { Guesses } from "./Guesses";
import { useTranslation } from "react-i18next";
import { SettingsData } from "../hooks/useSettings";
import { useMode } from "../hooks/useMode";
import { useCountry } from "../hooks/useCountry";
import axios from "axios";

function getDayString() {
  // Parse query parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get("date");

  // If date parameter exists, validate it
  if (dateParam) {
    // Try to parse the date using Luxon
    const parsedDate = DateTime.fromISO(dateParam);

    // Check if the date is valid and return it in the required format
    if (parsedDate.isValid) {
      return parsedDate.toFormat("yyyy-MM-dd");
    }
    // If invalid date parameter, we could show a toast notification here
    console.warn("Invalid date parameter, using current date instead");
  }

  // Fall back to current date if no valid date parameter
  return DateTime.now().toUTC().toFormat("yyyy-MM-dd");
}

const MAX_TRY_COUNT = 6;

interface GameProps {
  settingsData: SettingsData;
}

export function Game({ settingsData }: GameProps) {
  const { t, i18n } = useTranslation();
  const dayString = useMemo(getDayString, []);
  const isAprilFools = dayString.endsWith("04-01");

  // Add a check to see if we're using a historical date
  const isHistoricalPuzzle = useMemo(() => {
    const currentDayString = DateTime.now().toUTC().toFormat("yyyy-MM-dd");
    return dayString !== currentDayString;
  }, [dayString]);

  const countryInputRef = useRef<HTMLInputElement>(null);

  const countryData = useCountry(`${dayString}`);
  let country = countryData[0];

  if (isAprilFools) {
    country = {
      code: "AJ",
      latitude: 42.546245,
      longitude: 1.601554,
      name: "Land of Oz",
    };
  }

  const [ipData, setIpData] = useState(null);
  const [won, setWon] = useState(false);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [countryValue, setCountryValue] = useState<string>("");
  const [guesses, addGuess] = useGuesses(dayString);
  const [hideImageMode, setHideImageMode] = useMode(
    "hideImageMode",
    dayString,
    settingsData.noImageMode
  );
  const [rotationMode, setRotationMode] = useMode(
    "rotationMode",
    dayString,
    settingsData.rotationMode
  );

  const gameEnded =
    guesses.length === MAX_TRY_COUNT ||
    guesses[guesses.length - 1]?.distance === 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!country) return;
      const getIpData = async () => {
        const res = await axios.get("https://geolocation-db.com/json/");
        setIpData(res.data);
      };
      const guessedCountry = isAprilFools
        ? getFictionalCountryByName(currentGuess)
        : getCountryByName(currentGuess);

      if (guessedCountry == null) {
        toast.error(t("unknownCountry"));
        return;
      }

      const newGuess = {
        name: currentGuess,
        distance: geolib.getDistance(guessedCountry, country),
        direction: getCompassDirection(guessedCountry, country),
        country: guessedCountry,
      };

      addGuess(newGuess);
      setCurrentGuess("");
      setCountryValue("");

      if (newGuess.distance === 0) {
        setWon(true);
        getIpData();
      }
    },
    [addGuess, country, currentGuess, t, isAprilFools]
  );

  useEffect(() => {
    const getIpData = async () => {
      const res = await axios.get("https://geolocation-db.com/json/");
      setIpData(res.data);
    };
    if (
      guesses.length === MAX_TRY_COUNT &&
      guesses[guesses.length - 1].distance > 0
    ) {
      const countryName = country
        ? getCountryName(i18n.resolvedLanguage, country)
        : "";
      if (countryName) {
        toast.info(countryName.toUpperCase(), {
          autoClose: false,
          delay: 2000,
        });
      }
      getIpData();
    }
  }, [country, guesses, i18n.resolvedLanguage]);

  useEffect(() => {
    if (ipData) {
      axios
        .post("/tradle/score", {
          date: new Date(),
          guesses,
          ip: ipData,
          answer: country,
          won,
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            console.log(
              `⚠️ ${error.response.status}: Unable to post tradle score.`
            );
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
        });
    }
  }, [guesses, ipData, won, country]);

  let iframeSrc = "https://games.oec.world/en/tradle/aprilfools.html";
  let oecLink = "https://oec.world/";
  const country3LetterCode = country?.code
    ? countryISOMapping[country.code]?.toLowerCase()
    : "";
  if (!isAprilFools) {
    const oecCode = country?.oecCode
      ? country?.oecCode?.toLowerCase()
      : country3LetterCode;
    iframeSrc = `https://oec.world/en/visualize/embed/tree_map/hs92/export/${oecCode}/all/show/2023/?controls=false&title=false&click=false`;
    oecLink = `https://oec.world/en/profile/country/${country3LetterCode}`;
  }

  return (
    <div className="flex-grow flex flex-col mx-2 relative">
      {/* Add an indicator for historical puzzles */}
      {isHistoricalPuzzle && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-2"
          role="alert"
        >
          <p className="text-center">
            You are playing a historical puzzle from {dayString}
          </p>
        </div>
      )}
      {hideImageMode && !gameEnded && (
        <button
          className="border-2 uppercase my-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
          type="button"
          onClick={() => setHideImageMode(false)}
        >
          {t("showCountry")}
        </button>
      )}
      {/* <div className="my-1 mx-auto"> */}
      <h2 className="font-bold text-center">
        Guess which country exports these products!
      </h2>
      <div className="relative h-0 pt-[25px] pb-96 md:pb-[70%]">
        {country3LetterCode || isAprilFools ? (
          <iframe
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            title="Country to guess"
            width="390"
            height="315"
            src={iframeSrc}
            frameBorder="0"
          />
        ) : null}
      </div>
      {rotationMode && !hideImageMode && !gameEnded && (
        <button
          className="border-2 uppercase mb-2 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
          type="button"
          onClick={() => setRotationMode(false)}
        >
          {t("cancelRotation")}
        </button>
      )}
      <Guesses
        rowCount={MAX_TRY_COUNT}
        guesses={guesses}
        settingsData={settingsData}
        countryInputRef={countryInputRef}
        isAprilFools={isAprilFools}
      />
      <div className="my-2">
        {gameEnded ? (
          <>
            <Share
              guesses={guesses}
              dayString={dayString}
              settingsData={settingsData}
              hideImageMode={hideImageMode}
              rotationMode={rotationMode}
              won={guesses[guesses.length - 1]?.distance === 0}
              isAprilFools={isAprilFools}
            />
            <a
              className="underline w-full text-center block mt-4 flex justify-center"
              href={oecLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {t("showOnGoogleMaps")}
            </a>
            {isAprilFools ? (
              <div className="w-full text-center block mt-4 flex flex-col justify-center text-2xl font-bold">
                <div>🐶 🚲 🌪 🏚</div>
                <div>Happy April Fools!</div>
                <div>👠 🤖 🦁 🎍</div>
              </div>
            ) : null}
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="">
              <CountryInput
                countryValue={countryValue}
                setCountryValue={setCountryValue}
                setCurrentGuess={setCurrentGuess}
                isAprilFools={isAprilFools}
              />
              {/* <button
                className="border-2 uppercase my-0.5 hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-slate-800 dark:active:bg-slate-700"
                type="submit"
              >
                🌍 {t("guess")}
              </button> */}
              <div className="text-left">
                <button className="my-2 inline-block justify-end bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded items-center">
                  {isAprilFools ? "🪄" : "🌍"} <span>Guess</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
