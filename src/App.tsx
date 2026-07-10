import { initFrameAndPoll } from "@newswire/frames";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Game } from "./components/Game";
import { PracticeGame } from "./components/PracticeGame";
import { Infos } from "./components/panels/Infos";
import { InfosFr } from "./components/panels/InfosFr";
import { Settings } from "./components/panels/Settings";
import { Stats } from "./components/panels/Stats";
import { useSettings } from "./hooks/useSettings";

type AppMode = "daily" | "practice";

function App() {
  const { i18n } = useTranslation();

  const [infoOpen, setInfoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [mode, setMode] = useState<AppMode>("daily");

  const [settingsData, updateSettings] = useSettings();
  const headerLogoSrc =
    settingsData.theme === "dark"
      ? "/en/tradle/images/oec-tradle-logo-dark-bg.png"
      : "/en/tradle/images/oec-tradle-logo.png";

  useEffect(() => {
    if (typeof document !== "undefined") {
      initFrameAndPoll(); // Iframe poll height
    }
    if (settingsData.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settingsData.theme]);

  return (
    <>
      <div className="absolute hidden md:block">
        <img src="/en/tradle/images/top-ship.png" alt="logo" width="371" />
      </div>
      <ToastContainer
        hideProgressBar
        position="top-center"
        transition={Flip}
        theme={settingsData.theme}
        autoClose={5000}
        bodyClassName="font-bold text-center"
      />
      {i18n.resolvedLanguage === "fr" ? (
        <InfosFr
          isOpen={infoOpen}
          close={() => setInfoOpen(false)}
          settingsData={settingsData}
        />
      ) : (
        <Infos
          isOpen={infoOpen}
          close={() => setInfoOpen(false)}
          settingsData={settingsData}
        />
      )}
      <Settings
        isOpen={settingsOpen}
        close={() => setSettingsOpen(false)}
        settingsData={settingsData}
        updateSettings={updateSettings}
      />
      <Stats
        isOpen={statsOpen}
        close={() => setStatsOpen(false)}
        distanceUnit={settingsData.distanceUnit}
      />
      <div
        className="flex justify-center flex-auto relative"
        // style={{ background: "linear-gradient(#2c5363,#0f2027)" }}
      >
        <div className="w-full max-w-lg flex flex-col relative z-10 bg-white/80 text-slate-900 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none dark:bg-slate-900/70 dark:text-slate-100 md:dark:bg-transparent">
          <header className="border-b-2 border-slate-200/80 px-3 flex justify-between dark:border-slate-700/80">
            <button
              className="mr-3 text-xl text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              type="button"
              onClick={() => setInfoOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-center my-1 flex-auto">
              <img
                className="block m-auto"
                src={headerLogoSrc}
                alt="logo"
                width="120"
              />
            </h1>
            <button
              className="ml-3 text-xl text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              type="button"
              onClick={() => setStatsOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </button>
          </header>

          <div className="mx-2 mt-3 grid grid-cols-2 rounded-xl bg-slate-200/80 p-1 dark:bg-slate-800/80">
            <button
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                mode === "daily"
                  ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              }`}
              type="button"
              onClick={() => setMode("daily")}
            >
              Daily
            </button>
            <button
              className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                mode === "practice"
                  ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white"
                  : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              }`}
              type="button"
              onClick={() => setMode("practice")}
            >
              Practice
            </button>
          </div>

          {mode === "daily" ? (
            <Game settingsData={settingsData} updateSettings={updateSettings} />
          ) : (
            <PracticeGame settingsData={settingsData} />
          )}

          <footer className="flex justify-center text-sm mt-8 mb-1">
            <a
              className="rounded bg-amber-200/85 px-2 py-1 text-center underline decoration-amber-700/70 underline-offset-2 transition-colors hover:bg-amber-200 dark:bg-amber-400/15 dark:text-amber-100 dark:decoration-amber-200/60 dark:hover:bg-amber-400/20"
              href="https://oecworld.threadless.com/mens/t-shirt/regular"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Tradle Merch! 👕
            </a>
          </footer>
        </div>
        <div className="absolute bottom-0 right-0 z-0">
          <img src="/en/tradle/images/bottom-ship.png" alt="logo" width="342" />
        </div>
      </div>
    </>
  );
}

export default App;
