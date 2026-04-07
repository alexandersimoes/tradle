import { useEffect, useMemo, useState } from "react";
import { DateTime, Interval } from "luxon";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Modal } from "@mantine/core";
import {
  computeProximityPercent,
  generateSquareCharacters,
} from "../domain/geography";
import { Guess } from "../domain/guess";
import React from "react";
import { SettingsData } from "../hooks/useSettings";
import AdSense from "./Adsense";

const START_DATE = DateTime.fromISO("2022-03-06");

const APRIL_FOOLS_SHARE_SQUARES: Record<string, string> = {
  "🟩": "🟧",
  "🟨": "🟫",
  "⬜": "⬛",
};

function getShareCharacters(
  percent: number,
  theme: "light" | "dark",
  isAprilFools: boolean
) {
  const characters = generateSquareCharacters(percent, theme);
  if (!isAprilFools) {
    return characters;
  }

  return characters.map(
    (character) => APRIL_FOOLS_SHARE_SQUARES[character] || character
  );
}

interface ShareProps {
  guesses: Guess[];
  dayString: string;
  settingsData: SettingsData;
  hideImageMode: boolean;
  rotationMode: boolean;
  won: boolean;
  isAprilFools?: boolean;
}

export function Share({
  guesses,
  dayString,
  settingsData,
  hideImageMode,
  rotationMode,
  won,
  isAprilFools = false,
}: ShareProps) {
  const { t } = useTranslation();
  const { theme } = settingsData;
  const isDark = theme === "dark";
  const [opened, setOpened] = useState<boolean>(false);

  const endDate = DateTime.fromISO(dayString);
  const dayCount = Math.floor(
    Interval.fromDateTimes(START_DATE, endDate).length("day")
  );

  const shareText = useMemo(() => {
    const guessCount =
      guesses[guesses.length - 1]?.distance === 0 ? guesses.length : "X";
    const difficultyModifierEmoji = hideImageMode
      ? " 🙈"
      : rotationMode
      ? " 🌀"
      : "";
    const title = isAprilFools
      ? `#Tradle #AprilFoolsDay #${dayCount} ${guessCount}/6${difficultyModifierEmoji}`
      : `#Tradle #${dayCount} ${guessCount}/6${difficultyModifierEmoji}`;

    const guessesEmoji = guesses.map((guess) => {
      const percent = computeProximityPercent(guess.distance);
      return getShareCharacters(percent, theme, isAprilFools).join("");
    });

    const guessesString = guessesEmoji.join("\n");

    return [title, guessesEmoji, guessesString];
  }, [dayCount, guesses, hideImageMode, rotationMode, theme, isAprilFools]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpened(true); // This will open the modal after the delay
    }, 3000); // Set the delay here, 3000ms is 3 seconds

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, []); // The empty dependency array makes sure the effect runs only once after the initial render

  const [title, guessesEmoji, guessesString] = shareText;
  const guessesEmojiArray: string[] =
    typeof guessesEmoji === "string" ? [guessesEmoji] : guessesEmoji;

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        className="shadow-lg text-center"
        overlayColor={isDark ? "#020617" : "#d8e2eb"}
        overlayOpacity={isDark ? 0.82 : 0.72}
        styles={{
          modal: {
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            color: isDark ? "#f8fafc" : "#0f172a",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            borderRadius: 20,
            boxShadow: isDark
              ? "0 28px 80px rgba(2, 6, 23, 0.7)"
              : "0 28px 80px rgba(148, 163, 184, 0.28)",
          },
          header: {
            backgroundColor: "transparent",
            color: isDark ? "#f8fafc" : "#0f172a",
          },
          body: {
            backgroundColor: "transparent",
          },
          close: {
            color: isDark ? "#cbd5e1" : "#475569",
          },
        }}
      >
        <h1 className="text-2xl font-bold mb-4">
          {won ? "Congratulations!" : "Try again next time..."}
        </h1>
        <h2 className="text-lg font-semibold">Tradle</h2>
        <p className="font-medium mb-2">Puzzle #{dayCount}</p>
        <div className="flex flex-col mb-2 text-center">
          {guessesEmojiArray.map((guess: string, i: number) => (
            <div
              key={`${guess}-${i}`}
              className="flex space-x-1 justify-center"
            >
              {guess}
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mb-6">
          <div className="space-x-4">
            <CopyToClipboard
              text={[
                title,
                guessesString,
                "https://oec.world/en/games/tradle",
              ].join("\n")}
              onCopy={() => toast(t("copy"))}
              options={{
                format: "text/plain",
              }}
            >
              <button className="mt-4 rounded-xl bg-oec-orange p-2 font-semibold text-white transition-colors hover:bg-oec-yellow hover:text-slate-950 active:bg-oec-orange">
                {t("share")}
              </button>
            </CopyToClipboard>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="space-x-4">
            <a
              href="https://oec.world/en/games/connectrade"
              className="inline-block rounded-xl bg-slate-300 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              target="_blank"
              rel="noreferrer"
            >
              Play ConnecTrade
            </a>
            <a
              href="https://oec.world/en/games/pick-5"
              className="inline-block rounded-xl bg-slate-300 px-4 py-2 font-semibold text-slate-900 transition-colors hover:bg-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              target="_blank"
              rel="noreferrer"
            >
              Play Pick 5
            </a>
          </div>
        </div>
        <br />
        <div className="flex justify-center items-center">
          <AdSense />
        </div>
      </Modal>
      <CopyToClipboard
        text={[title, guessesString, "https://oec.world/en/games/tradle"].join(
          "\n"
        )}
        onCopy={() => toast(t("copy"))}
        options={{
          format: "text/plain",
        }}
      >
        <button className="mt-4 w-full rounded-xl bg-oec-orange p-2 font-semibold text-white transition-colors hover:bg-oec-yellow hover:text-slate-950 active:bg-oec-orange">
          {t("share")}
        </button>
      </CopyToClipboard>
    </>
  );
}
