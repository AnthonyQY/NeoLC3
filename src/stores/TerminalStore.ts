import { create } from "zustand";

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
    set(() => ({
      Lines: [],
    }));
  },
});

export const useTerminalStore = create<TerminalState>(registerStore);
