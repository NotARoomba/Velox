import * as SecureStore from "expo-secure-store";
// import { NativeWindStyleSheet } from "nativewind";
import * as Nativewind from "nativewind";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Alert, Appearance, StatusBar, useColorScheme } from "react-native";
import { useLoading } from "./useLoading";

interface SettingsContextType {
  language: string | null;
  theme: "light" | "dark" | null;
  setLanguage: (language: string) => Promise<void>;
  setTheme: (theme: "light" | "dark") => Promise<void>;
  fetchSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const { t, i18n } = useTranslation();
  const { setLoading } = useLoading();
  const [language, setLanguageState] = useState<string | null>(null);
  const [theme, setThemeState] = useState<"light" | "dark" | null>(null);
  let colorScheme = useColorScheme();
  // const { setColorScheme } = Nativewind.useColorScheme();

  const fetchSettings = async () => {
    // setLoading(true);
    try {
      const savedLanguage = await SecureStore.getItemAsync("language");
      const savedTheme = await SecureStore.getItemAsync("theme");

      if (savedLanguage) {
        setLanguageState(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }

      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
        // setColorScheme(savedTheme);
        Nativewind.colorScheme.set(savedTheme);
        Appearance.setColorScheme(savedTheme);
        // NativeWindStyleSheet.setColorScheme(savedTheme);
        StatusBar.setBarStyle(
          savedTheme !== "light" ? "light-content" : "dark-content",
          true
        );
      } else {
        setThemeState(colorScheme as "dark" | "light");
        Nativewind.colorScheme.set(colorScheme as "dark" | "light");
        StatusBar.setBarStyle(
          colorScheme !== "light" ? "light-content" : "dark-content",
          true
        );
        setTheme(colorScheme as "dark" | "light");
      }
      //setLoading(false);
    } catch (error) {
      //setLoading(false);
      Alert.alert(t("error"), t("errors.fetchSettings"));
    }
  };

  const setLanguage = async (language: string) => {
    try {
      await SecureStore.setItemAsync("language", language);
      setLanguageState(language);
      await i18n.changeLanguage(language);
    } catch (error) {
      Alert.alert(t("error"), t("errors.saveSettings"));
    }
  };

  const setTheme = async (newTheme: "light" | "dark") => {
    try {
      await SecureStore.setItemAsync("theme", newTheme);
      // NativeWindStyleSheet.setColorScheme(newTheme);
      // setColorScheme(newTheme);
      Nativewind.colorScheme.set(newTheme);
      Appearance.setColorScheme(newTheme);
      StatusBar.setBarStyle(
        newTheme !== "light" ? "light-content" : "dark-content",
        true
      );
      setThemeState(newTheme);
    } catch (error) {
      Alert.alert(t("error"), t("errors.saveSettings"));
    }
  };

  useEffect(() => {
    fetchSettings();
    // DOES NOT WORK
    const listener = Appearance.addChangeListener((e) => {
      setThemeState(e.colorScheme as "dark" | "light");
      // setColorScheme(savedTheme);
      Nativewind.colorScheme.set(e.colorScheme as "dark" | "light");
      Appearance.setColorScheme(e.colorScheme as "dark" | "light");
      // NativeWindStyleSheet.setColorScheme(savedTheme);
      StatusBar.setBarStyle(
        e.colorScheme !== "light" ? "light-content" : "dark-content",
        true
      );
    });
    return () => listener.remove();
  }, []);

  return (
    <SettingsContext.Provider
      value={{ language, theme, setLanguage, setTheme, fetchSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
