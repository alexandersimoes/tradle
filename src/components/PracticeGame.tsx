import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  countries,
  countryISOMapping,
  getCountryByName,
  type Country,
} from "../domain/countries";
import { SettingsData } from "../hooks/useSettings";
import { CountryInput } from "./CountryInput";

interface PracticeGameProps {
  settingsData: SettingsData;
}

type CardStatus = "answering" | "correct" | "revealed";

function shuffle<T>(values: T[]): T[] {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

function buildPracticeQueue(): Country[] {
  return shuffle(
    countries.filter(
      (country) => country.oecCode || countryISOMapping[country.code]
    )
  );
}

function getLetterCount(name: string): number {
  return name.replace(/[^a-z]/gi, "").length;
}

export function PracticeGame({ settingsData }: PracticeGameProps) {
  const [queue, setQueue] = useState<Country[]>(buildPracticeQueue);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countryValue, setCountryValue] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<CardStatus>("answering");
  const [hintLevel, setHintLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const target = queue[currentIndex];

  const country3LetterCode = target
    ? countryISOMapping[target.code]?.toLowerCase()
    : "";
  const oecCode = target?.oecCode?.toLowerCase() || country3LetterCode;
  const iframeSrc = oecCode
    ? `https://oec.world/en/visualize-legacy/embed/tree_map/hs92/export/${oecCode}/all/show/2023/?controls=false&title=false&click=false`
    : "";
  const oecLink = country3LetterCode
    ? `https://oec.world/en/profile/country/${country3LetterCode}`
    : "https://oec.world/";

  const hintText = useMemo(() => {
    if (!target || hintLevel === 0) {
      return null;
    }

    if (hintLevel === 1) {
      return `The country starts with “${target.name.charAt(0)}”.`;
    }

    return `The country starts with “${target.name.charAt(
      0
    )}” and has ${getLetterCount(target.name)} letters.`;
  }, [hintLevel, target]);

  const resetCard = useCallback(() => {
    setCountryValue("");
    setCurrentGuess("");
    setStatus("answering");
    setHintLevel(0);
    setAttempts(0);
  }, []);

  const goToNextCountry = useCallback(() => {
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((index) => index + 1);
      resetCard();
      return;
    }

    setQueue(buildPracticeQueue());
    setCurrentIndex(0);
    resetCard();
  }, [currentIndex, queue.length, resetCard]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!target || status !== "answering") {
        return;
      }

      const submittedValue = countryValue || currentGuess;
      const guessedCountry = getCountryByName(submittedValue);

      if (!guessedCountry) {
        toast.error("Please select a valid country.");
        return;
      }

      setAttempts((count) => count + 1);

      if (guessedCountry.code === target.code) {
        setStatus("correct");
        setCorrectCount((count) => count + 1);
        setCountryValue("");
        setCurrentGuess("");
        return;
      }

      toast.error("Not quite. Try again.");
      setCountryValue("");
      setCurrentGuess("");
    },
    [countryValue, currentGuess, status, target]
  );

  const revealAnswer = useCallback(() => {
    setStatus("revealed");
    setCountryValue("");
    setCurrentGuess("");
  }, []);

  if (!target) {
    return (
      <div className="mx-2 flex flex-grow items-center justify-center">
        No countries are available for practice.
      </div>
    );
  }

  const isLastCard = currentIndex + 1 === queue.length;

  return (
    <div className="relative mx-2 flex flex-grow flex-col">
      <div className="mb-2 mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <span>
          Country {currentIndex + 1} of {queue.length}
        </span>
        <span>{correctCount} correct this session</span>
      </div>

      <h2 className="mb-1 text-center font-bold text-slate-900 dark:text-slate-100">
        Practice: identify the country from its exports
      </h2>

      <div className="relative h-0 pb-96 pt-[25px] md:pb-[70%]">
        {iframeSrc ? (
          <iframe
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            title="Country export chart to identify"
            width="390"
            height="315"
            src={iframeSrc}
            frameBorder="0"
          />
        ) : null}
      </div>

      {hintText ? (
        <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50/95 px-3 py-2 text-center text-sm text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-100">
          {hintText}
        </div>
      ) : null}

      <div className="my-3">
        {status === "answering" ? (
          <form onSubmit={handleSubmit}>
            <CountryInput
              countryValue={countryValue}
              setCountryValue={setCountryValue}
              setCurrentGuess={setCurrentGuess}
              theme={settingsData.theme}
              isAprilFools={false}
              guesses={[]}
              placeholder="Pick a country"
            />

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="rounded-xl bg-slate-800 px-4 py-2 font-bold text-white shadow-sm transition-colors hover:bg-slate-900 dark:bg-oec-orange dark:text-slate-950 dark:hover:bg-orange-300"
                type="submit"
              >
                🌍 Guess
              </button>
              <button
                className="rounded-xl border border-slate-300 bg-white/80 px-4 py-2 font-bold text-slate-800 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
                type="button"
                disabled={hintLevel >= 2}
                onClick={() => setHintLevel((level) => Math.min(level + 1, 2))}
              >
                Hint
              </button>
              <button
                className="rounded-xl border border-slate-300 bg-white/80 px-4 py-2 font-bold text-slate-800 transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900"
                type="button"
                onClick={revealAnswer}
              >
                Reveal answer
              </button>
            </div>

            {attempts > 0 ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Attempts: {attempts}
              </p>
            ) : null}
          </form>
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {status === "correct" ? "Correct" : "Answer"}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
              {target.name}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {status === "revealed"
                ? attempts > 0
                  ? `Revealed after ${attempts} ${
                      attempts === 1 ? "attempt" : "attempts"
                    }.`
                  : "The answer was revealed."
                : attempts === 1
                ? "Solved in 1 attempt."
                : `Solved in ${attempts} attempts.`}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                href={oecLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View OEC profile
              </a>
              <button
                className="rounded-xl bg-slate-800 px-4 py-2 font-bold text-white shadow-sm transition-colors hover:bg-slate-900 dark:bg-oec-orange dark:text-slate-950 dark:hover:bg-orange-300"
                type="button"
                onClick={goToNextCountry}
              >
                {isLastCard ? "Start another round" : "Next country"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
