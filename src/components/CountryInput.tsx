import React, { forwardRef, Dispatch, SetStateAction } from "react";
import {
  countries,
  fictionalCountries,
  sanitizeCountryName,
} from "../domain/countries";
import { Group, Text, Autocomplete } from "@mantine/core";
import { flag } from "country-emoji";
import type { Guess } from "../domain/guess";

interface CountryInputProps {
  setCountryValue: Dispatch<SetStateAction<string>>;
  countryValue: string;
  setCurrentGuess: (guess: string) => void;
  theme: "light" | "dark";
  isAprilFools: boolean;
  placeholder?: string;
  guesses: Guess[];
}

interface ItemProps {
  value: string;
  id: string;
  isAprilFools: boolean;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ id, value, isAprilFools = false, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Text>{flag(id)}</Text>
        <div>
          <Text>{value}</Text>
        </div>
      </Group>
    </div>
  )
);
AutoCompleteItem.displayName = "Autocomplete Item";
const AutoCompleteItemAprilFools = forwardRef<HTMLDivElement, ItemProps>(
  ({ id, value, isAprilFools = false, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text>{value}</Text>
        </div>
      </Group>
    </div>
  )
);
AutoCompleteItemAprilFools.displayName = "Autocomplete Item April Fools";

export function CountryInput({
  countryValue,
  setCountryValue,
  setCurrentGuess,
  theme,
  isAprilFools = false,
  placeholder = "Pick a location",
  guesses,
}: CountryInputProps) {
  const isDark = theme === "dark";
  const guessedNames = new Set(
    guesses.map((guess) =>
      sanitizeCountryName(guess.country?.name || guess.name)
    )
  );
  const items = (isAprilFools ? fictionalCountries : countries)
    .filter((country) => !guessedNames.has(sanitizeCountryName(country.name)))
    .map((country) => ({
      name: country.name,
      value: `${country.name}`,
      id: country.code,
    }));
  return (
    <Autocomplete
      autoComplete="noautocompleteplzz"
      placeholder={placeholder}
      limit={isAprilFools ? items.length : 5}
      itemComponent={
        isAprilFools ? AutoCompleteItemAprilFools : AutoCompleteItem
      }
      styles={{
        input: {
          height: 48,
          borderRadius: 12,
          border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.94)" : "#ffffff",
          color: isDark ? "#e2e8f0" : "#0f172a",
        },
        dropdown: {
          maxHeight: isAprilFools ? 280 : undefined,
          overflowY: isAprilFools ? "auto" : undefined,
          border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          color: isDark ? "#e2e8f0" : "#0f172a",
          boxShadow: isDark
            ? "0 18px 40px rgba(2, 6, 23, 0.58)"
            : "0 18px 40px rgba(148, 163, 184, 0.22)",
        },
        item: {
          color: isDark ? "#e2e8f0" : "#0f172a",
          borderRadius: 10,
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
        },
        hovered: {
          backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
          color: isDark ? "#f8fafc" : "#0f172a",
        },
        nothingFound: {
          color: isDark ? "#94a3b8" : "#475569",
        },
      }}
      data={items}
      filter={(value, item) =>
        item.value
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .includes(value.toLowerCase().trim()) ||
        item.id.toLowerCase().includes(value.toLowerCase().trim())
      }
      onItemSubmit={(item) => {
        setCurrentGuess(sanitizeCountryName(item.value));
      }}
      value={countryValue}
      onChange={setCountryValue}
    />
  );
}
