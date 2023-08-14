import { create } from "zustand";

interface TerminalState {
  Lines: Array<any>;
}

const systemTerminalStore = (set: any) => ({
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

export const useSystemTerminalStore =
  create<TerminalState>(systemTerminalStore);
