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

export function InfosFr({ isOpen, close, settingsData }: InfosProps) {
  const sectionClass =
    "mb-4 rounded-2xl border border-slate-200/80 bg-white/75 p-4 text-slate-900 shadow-sm shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20";
  const sectionTitleClass =
    "mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400";
  const exampleCardClass =
    "rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
  const linkClass =
    "font-medium text-sky-700 underline decoration-sky-400/70 underline-offset-2 transition-colors hover:text-sky-800 dark:text-sky-300 dark:decoration-sky-400/50 dark:hover:text-sky-200";

  return (
    <Panel title="Comment jouer" isOpen={isOpen} close={close}>
      <div className={`${sectionClass} text-justify`}>
        <div className={sectionTitleClass}>Règles</div>
        <div>
          {" "}
          Devine le <Tradele /> en 6 essais.
        </div>
        <div>Chaque essai doit être un pays, un territoire, etc... valide.</div>
        <div>
          Après chaque essai, vous aurez la distance, la direction et la
          proximité entre votre essai et le pays cible.
        </div>
      </div>

      <div className={`${sectionClass} text-justify`}>
        <div className={sectionTitleClass}>Exemples</div>
        <div className={exampleCardClass}>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Chili",
                direction: "NE",
                distance: 13_557_000,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="mt-3 text-slate-700 dark:text-slate-300">
            Votre essai <span className="uppercase font-bold">Chili</span> est à{" "}
            {formatDistance(13_557_000, settingsData.distanceUnit)} du pays
            cible, le pays cible se trouve dans la direction Nord-Est et vous
            avez une proximité de seulement 32% car votre essai est plutôt
            éloigné !
          </div>
        </div>
        <div className={`${exampleCardClass} mt-3`}>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Finlande",
                direction: "SE",
                distance: 3_206_000,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="mt-3 text-slate-700 dark:text-slate-300">
            Votre seconde essai{" "}
            <span className="uppercase font-bold">Finlande</span> est plus
            proche ! La bonne réponse est à{" "}
            {formatDistance(3_206_000, settingsData.distanceUnit)}, au Sud-Est
            et la proximité est de 84%!
          </div>
        </div>
        <div className={`${exampleCardClass} mt-3`}>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Liban",
                direction: "N",
                distance: 0,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="mt-3 text-slate-700 dark:text-slate-300">
            Prochain essai, <span className="uppercase font-bold">Liban</span>,
            c&apos;est le pays à deviner ! Bien joué ! 🎉
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-justify font-bold text-amber-900 shadow-sm shadow-amber-100/70 dark:border-amber-500/30 dark:from-amber-900/70 dark:to-orange-900/60 dark:text-amber-100 dark:shadow-black/20">
        Un nouveau <Tradele /> sera disponible chaque jour.
      </div>

      <div className={`${sectionClass} text-justify`}>
        <div className={sectionTitleClass}>A propos de la distance</div>
        <div>
          Les distances affichées correspondent aux distances entre le centre du
          pays choisi et de la cible.
        </div>
        <div>
          Par exemple, la distance calculée entre les Etats-Unis et le Canada
          est d&apos;environs{" "}
          {formatDistance(2_260_000, settingsData.distanceUnit)} même si les
          deux pays ont une frontière commune.
        </div>
      </div>

      <div className={`${sectionClass} text-justify`}>
        <div className={sectionTitleClass}>Crédits</div>
        <Tradele /> a été <span className="font-bold">très</span> inspiré par{" "}
        <a
          className={linkClass}
          href="https://www.powerlanguage.co.uk/wordle/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wordle
        </a>{" "}
        créé par{" "}
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

      <div className={`${sectionClass} text-justify`}>
        <div className={sectionTitleClass}>Liens</div>
        <div>
          Fait par{" "}
          <a
            className={linkClass}
            href="https://twitter.com/ximoes"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ximoes
          </a>
        </div>
      </div>
    </Panel>
  );
}
