import { Guesses } from "../Guesses";
import { Panel } from "./Panel";
import React from "react";
import { Tradele } from "../Tradele";
import { formatDistance } from "../../domain/geography";
import { SettingsData } from "../../hooks/useSettings";

interface InfosProps {
  isOpen: boolean;
  close: () => void;
  settingsData: SettingsData;
}

export function Infos({ isOpen, close, settingsData }: InfosProps) {
  const sectionClass =
    "mb-4 rounded-2xl border border-slate-200/80 bg-white/75 p-4 text-slate-900 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20";
  const sectionTitleClass =
    "mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400";
  const exampleCardClass =
    "rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
  const linkClass =
    "font-medium text-sky-700 underline decoration-sky-400/70 underline-offset-2 transition-colors hover:text-sky-800 dark:text-sky-300 dark:decoration-sky-400/50 dark:hover:text-sky-200";

  return (
    <Panel title="How to play" isOpen={isOpen} close={close}>
      <div className={sectionClass}>
        <div className={sectionTitleClass}>Overview</div>
        <div>
          Guess the <Tradele /> in 6 guesses.
        </div>
        <div>
          What exactly am I trying to guess? Each day you&apos;ll see a
          different treemap of the exports for a particular country. Each
          rectangle represents the share of a given product proportional to its
          percentage of exports for that country.
        </div>
        <div>Each guess must be a valid country, territory, ...</div>
        <div>
          After each guess, you will have the distance, the direction and the
          proximity from your guess and the target country.
        </div>
      </div>

      <div className={sectionClass}>
        <div className={sectionTitleClass}>Examples</div>
        <div className={exampleCardClass}>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Chile",
                direction: "NE",
                distance: 13_557_000,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="mt-3 text-slate-700 dark:text-slate-300">
            Your guess <span className="uppercase font-bold">Chile</span> is{" "}
            {formatDistance(13557000, settingsData.distanceUnit)} away from the
            target country, the target country is in the North-East direction
            and you have a only 32% of proximity because it&apos;s quite far
            away!
          </div>
        </div>
        <div className={`${exampleCardClass} mt-3`}>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Finland",
                direction: "SE",
                distance: 3_206_000,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="mt-3 text-slate-700 dark:text-slate-300">
            Your second guess{" "}
            <span className="uppercase font-bold">Finland</span> is getting
            closer! {formatDistance(3206000, settingsData.distanceUnit)} away,
            South-East direction and 84%!
          </div>
        </div>
        <div className={`${exampleCardClass} mt-3`}>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Lebanon",
                direction: "N",
                distance: 0,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="mt-3 text-slate-700 dark:text-slate-300">
            Next guess, <span className="uppercase font-bold">Lebanon</span>, is
            the correct country! Congrats! 🎉
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-4 font-bold text-amber-900 shadow-sm shadow-amber-100/70 dark:border-amber-500/30 dark:from-amber-900/70 dark:to-orange-900/60 dark:text-amber-100 dark:shadow-black/20">
        A new <Tradele /> will be available every day.
      </div>

      <div className={sectionClass}>
        <div className={sectionTitleClass}>About distance</div>
        <div>
          The distances displayed correspond to the distances between the
          selected and the target territory centers.
        </div>
        <div>
          For instance, the computed distance between United States and Canada
          is around {formatDistance(2_260_000, settingsData.distanceUnit)} even
          if they have a common border.
        </div>
      </div>

      <div className={sectionClass}>
        <div className={sectionTitleClass}>Credits</div>
        <Tradele /> has been <span className="font-bold">heavily</span> inspired
        by{" "}
        <a
          className={linkClass}
          href="https://worldle.teuteuf.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Worldle
        </a>{" "}
        created by{" "}
        <a
          className={linkClass}
          href="https://twitter.com/teuteuf"
          target="_blank"
          rel="noopener noreferrer"
        >
          @teuteuf
        </a>{" "}
        which itself was <span className="font-bold">heavily</span> inspired by{" "}
        <a
          className={linkClass}
          href="https://www.powerlanguage.co.uk/wordle/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wordle
        </a>{" "}
        created by{" "}
        <a
          className={linkClass}
          href="https://twitter.com/powerlanguish"
          target="_blank"
          rel="noopener noreferrer"
        >
          Josh Wardle (@powerlanguish)
        </a>
        .
      </div>

      <div className={sectionClass}>
        <div className={sectionTitleClass}>Links</div>
        <div>
          Made by{" "}
          <a
            className={linkClass}
            href="https://twitter.com/ximoes"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ximoes
          </a>
          . Source code on{" "}
          <a
            className={linkClass}
            href="https://github.com/alexandersimoes/tradle"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          .
        </div>
        <div>
          <a
            className={linkClass}
            href="https://oec.world"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about trade data on the OEC! 🌎
          </a>
        </div>
      </div>
    </Panel>
  );
}
