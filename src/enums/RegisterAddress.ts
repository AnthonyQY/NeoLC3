export enum RegisterAddress {
  R_R0 = 0,
  R_R1,
  R_R2,
  R_R3,
  R_R4,
  R_R5,
  R_R6,
  R_R7,
  R_PC,
  R_COND,
  R_COUNT,
}

export enum MMRA {
  MR_KBSR = 0xfe00 /* keyboard status */,
  MR_KBDR = 0xfe02 /* keyboard data */,
}
