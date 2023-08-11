import { create } from "zustand";
import { RegisterAddress } from "../enums/RegisterAddress";

interface RegisterState {
  Registers: Uint16Array;
}

const registerStore = (set: any) => ({
  Registers: new Uint16Array(RegisterAddress.R_COUNT),

  setRegister: (address: any, value: any) => {
    set((state: any) => ({
      Registers: state.Registers.map((e: any, i: any) => {
        if (i == address) {
          return value;
        }
        return e;
      }),
    }));
  },
});

export const useRegisterStore = create<RegisterState>(registerStore);
