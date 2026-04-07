import { useCallback, useMemo, useState } from "react";

export interface SettingsData {
  noImageMode: boolean;
  rotationMode: boolean;
  distanceUnit: "km" | "miles";
  theme: "light" | "dark";
}

const defaultSettingsData: SettingsData = {
  noImageMode: false,
  rotationMode: false,
  distanceUnit: "km",
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
};

function loadSettings(): SettingsData {
  const storedSettings = localStorage.getItem("settings");
  const settingsData = storedSettings != null ? JSON.parse(storedSettings) : {};
  return {
    ...defaultSettingsData,
    ...settingsData,
  };
}

function getThemeOverrideFromSearchParams(): SettingsData["theme"] | null {
  const searchParams = new URLSearchParams(window.location.search);
  const theme = searchParams.get("theme");

  return theme === "light" || theme === "dark" ? theme : null;
}

export function useSettings(): [
  SettingsData,
  (newSettings: Partial<SettingsData>) => void
] {
  const [storedSettingsData, setStoredSettingsData] = useState<SettingsData>(
    loadSettings()
  );

  const settingsData = useMemo(() => {
    const themeOverride = getThemeOverrideFromSearchParams();
    return themeOverride == null
      ? storedSettingsData
      : { ...storedSettingsData, theme: themeOverride };
  }, [storedSettingsData]);

  const updateSettingsData = useCallback(
    (newSettings: Partial<SettingsData>) => {
      const updatedSettings = {
        ...storedSettingsData,
        ...newSettings,
      };

      setStoredSettingsData(updatedSettings);
      localStorage.setItem("settings", JSON.stringify(updatedSettings));
    },
    [storedSettingsData]
  );

  return [settingsData, updateSettingsData];
}
