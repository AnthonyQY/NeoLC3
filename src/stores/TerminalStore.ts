import { create } from "zustand";
import { RegisterAddress } from "../enums/RegisterAddress";

interface TerminalState {
  Lines: Array<any>;
}

const registerStore = (set: any) => ({
  Lines: new Array<String>(),

  addText: (value: any) => {
    set((state: any) => ({
      Lines: [...state.Lines, value],
    }));
  },

  clearText: () => {
    set((state: any) => ({
      Lines: [],
    }));
  },
});

export const useTerminalStore = create<TerminalState>(registerStore);
