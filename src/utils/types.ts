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
