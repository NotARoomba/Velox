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
  MATCH = 'match',
  PI = 'pi',
  APPROXIMATION = 'approximation',
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: ImagePickerAsset |  string | null;
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