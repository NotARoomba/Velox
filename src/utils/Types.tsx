export interface SliderProps {
  options: string[];
  setOption: (v: string) => void;
  selected?: string | null;
}
