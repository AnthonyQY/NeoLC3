import { create } from "zustand";

const MEMORY_MAX = 1 << 16;

interface MemoryState {
  Memory: Uint16Array;
}

const memoryStore = (set: any) => ({
  Memory: new Uint16Array(MEMORY_MAX),

  setMemory: (address: any, value: any) => {
    set((state: any) => ({
      Memory: state.Memory.map((e: any, i: any) => {
        if (i == address) {
          return value;
        }
        return e;
      }),
    }));
  },
});

export const useMemoryStore = create<MemoryState>(memoryStore);
