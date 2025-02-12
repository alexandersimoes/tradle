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
      return generateSquareCharacters(percent, theme).join("");
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
              <button className="p-2 mt-4 rounded-lg font-semibold text-white bg-oec-orange hover:bg-oec-yellow active:bg-oec-orange text-white">
                {t("share")}
              </button>
            </CopyToClipboard>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="space-x-4">
            <a
              href="https://oec.world/en/games/connectrade"
              className="p-2 px-4 rounded-lg font-semibold text-white bg-gray-400 hover:bg-gray-600 inline-block"
              target="_blank"
              rel="noreferrer"
            >
              Play ConnecTrade
            </a>
            <a
              href="https://oec.world/en/games/pick-5"
              className="p-2 px-4 rounded-lg font-semibold text-white bg-gray-400 hover:bg-gray-600 inline-block"
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
        <button className="p-2 mt-4 rounded-lg font-semibold bg-oec-orange hover:bg-oec-yellow active:bg-oec-orange text-white w-full">
          {t("share")}
        </button>
      </CopyToClipboard>
    </>
  );
}
