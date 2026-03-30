import type { Country } from "./countries";
import { sanitizeCountryName } from "./countries";
import type { Guess } from "./guess";

export const APRIL_FOOLS_TARGET: Country = {
  code: "AA",
  latitude: 26.2,
  longitude: 13.4,
  name: "Arrakis",
};

export const APRIL_FOOLS_PROMPT = "Guess which planet exports these products";

export const APRIL_FOOLS_PLACEHOLDER = "Pick a world";

export const APRIL_FOOLS_CELEBRATION = {
  top: "🪱 🌶️ 🏜️ 💧",
  middle: "The spice must flow.",
  bottom: "🔪 👁️ 👑 ⚗️",
};

const APRIL_FOOLS_HINTS: Record<string, string> = {
  caladan:
    "Too much moisture detected. This world would recycle your entire ocean into one stillsuit.",
  giediprime:
    "Close in ruthless energy... but one has style and prophecies, the other has just pollution.",
  kaitain:
    "Imperial capital swagger noted. This place has less palace decor and more giant existential tube monsters.",
  salusasecundus:
    "Elite murder planet energy, but this is where empires hallucinate their supply chains.",
  ix: "You found the gadget nerds. Useful, but this place prefers prophecy with a side of worm.",
  richese:
    "Elegant engineering, wrong sand. This planet exports monopoly, mysticism, and premium dehydration.",
  wallachix:
    "Mysticism detected, but even the Bene Gesserit need this place for the deluxe visions.",
  lankiveil:
    "Cold and whale-adjacent. This would classify as a catastrophic hydration event here.",
  tleilax:
    "Too much biotech menace. Destiny grows the old-fashioned way here: in sand and suffering.",
  belategeuse:
    "Busy trade lanes, wrong apocalypse aesthetic. This is scarcity with branding.",
  chapterhouse:
    "Strong spiritual manipulation profile, but the real fanatics still queue up here.",
};

const DEFAULT_HINT =
  "Wrong desert. The worms here don't care about your rhythm - they'll still eat your harvester.";

export function getAprilFoolsHint(guess?: Guess): string | null {
  if (!guess || guess.distance === 0) {
    return null;
  }

  const guessName = sanitizeCountryName(guess.country?.name || guess.name);
  return APRIL_FOOLS_HINTS[guessName] || DEFAULT_HINT;
}
