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