import { RegisterAddress } from "./RegisterAddress";
import { useRegisterStore } from "../stores/RegisterStore";
import { SetRegister } from "../util/util";

export enum ConditionFlag {
  FL_POS = 1 << 0 /* P */,
  FL_ZRO = 1 << 1 /* Z */,
  FL_NEG = 1 << 2 /* N */,
}

export function UpdateFlags(address: number) {
  const Registers = useRegisterStore.getState().Registers;
  if (Registers[address] == 0) {
    SetRegister(RegisterAddress.R_COND, ConditionFlag.FL_ZRO);
  } else if (Registers[address] >> 15) {
    SetRegister(RegisterAddress.R_COND, ConditionFlag.FL_NEG);
  } else {
    SetRegister(RegisterAddress.R_COND, ConditionFlag.FL_POS);
  }
}
