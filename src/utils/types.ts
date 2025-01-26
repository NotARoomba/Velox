import { ImagePickerAsset } from "expo-image-picker";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

export interface SliderProps {
  options: string[];
  setOption: (v: string) => void;
  selected?: string | null;
}

export enum Games {
  MATCH = "match",
  PI = "pi",
  APPROXIMATION = "approximation",
}

export enum Difficulty {
  EASY,
  MEDIUM,
  HARD
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: ImagePickerAsset | string | null;
}

export interface KeypadProps {
  onDigitPress: (digit: string) => void;
  disabled: boolean;
}

export interface GameInfoProps {
  lives: number;
  timeLeft: number;
  guessed: number;
}

export enum GameType {
  PI,
  MATCH,
  APPROXIMATION,
}

export interface Game {
  type: GameType;
  score: number;
  lives: number;
  time: number;
  username?: string;
  avatar_url?: string;
  answer?: number;
}

export interface HoloTextProps {
  children: string;
  width: number;
  height: number;
  fontSize?: number;
  textColor?: string;
  style?: object;
  className?: string;
}

export type LanguageCodes =
  | "en"
  | "es"
  | "zh"
  | "fr"
  | "de"
  | "ru"
  | "ja"
  | "ko";


export type Language = {
  locale: LanguageCodes;
  name: string;
};

// Define the LANGUAGES array using the Language type
export const LANGUAGES: Language[] = [
  { locale: "en", name: "English" },
  { locale: "es", name: "Español" },
  { locale: "zh", name: "中文" },
  { locale: "fr", name: "Français" },
  { locale: "de", name: "Deutsch" },
  { locale: "ru", name: "Русский" },
  { locale: "ja", name: "日本語" },
  { locale: "ko", name: "한국어" },
];

export const LANGUAGE_COLORS: Record<LanguageCodes, string> = {
  en: "#071932",
  es: "#1e68d0",
  zh: "#023c4d",
  fr: "#124081",
  de: "#082540",
  ru: "#b1d4f5",
  ja: "#56d4fb",
  ko: "#06bcf4",
};

export interface LanguageButtonProps {
  language: Language;
  index: number;
  currentIndex: number;
}

export interface ApproxSliderProps {
  inputNumber: number;
  onRelease: (event: boolean) => void;
  bounds: number[];
}

export interface CurvedTextProps {
  width: number;
  height: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  startOffset: number;
  reversed: boolean;
  text: string;
  svgProps?: any;
  textPathProps?: any;
  textProps?: any;
  tspanProps?: any;
}

export interface GameOverModalProps {
  game: Game;
  onQuit: () => void;
  onRestart: () => void;
}

export interface LivesProps {
  lives: number;
  totalLives?: number;
}

