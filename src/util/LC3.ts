import { RegisterAddress } from "../enums/RegisterAddress";
import { ConditionFlag, UpdateFlags } from "../enums/ConditionFlag";
import { useMemoryStore } from "../stores/MemoryStore";
import { MMRA } from "../enums/RegisterAddress";
import { GetRegister, PrintTerminal, SetRegister, WriteMemory } from "./util";
import { Opcode } from "../enums/OpCode";
import { SignExtend, putBuf } from "./util";
import { TrapCode } from "../enums/TrapCode";
import { abort } from "process";

const PC_START = 0x3000;
let isRunning: boolean = true;

export function stopLC3() {
  isRunning = false;
}

export function pauseLC3() {}

export function startLC3() {
  isRunning = true;
}

export async function runLC3(delay: number) {
  function getChar() {
    PrintTerminal("[SYS] Awaiting user input...");
    var input = prompt("Input: ") || "N";
    PrintTerminal("[USR] Input: " + input);
    if (input.toLowerCase() == "q") {
      isRunning = false;
    }
    return input.charCodeAt(0);
  }

  function ReadMemory(address: any) {
    if (address == MMRA.MR_KBSR) {
      let input = getChar();
      if (input != null) {
        WriteMemory(MMRA.MR_KBSR, 1 << 15);
        WriteMemory(MMRA.MR_KBDR, input);
      } else {
        WriteMemory(MMRA.MR_KBSR, 0);
      }
    }
    return useMemoryStore.getState().Memory[address];
  }

  function handleTrap(instruction: any) {
    switch (instruction & 0xff) {
      case TrapCode.TRAP_GETC:
        SetRegister(RegisterAddress.R_R0, getChar());
        UpdateFlags(RegisterAddress.R_R0);
        break;
      case TrapCode.TRAP_OUT:
        putBuf([GetRegister(RegisterAddress.R_R0)]);
        break;
      case TrapCode.TRAP_PUTS:
        let a = GetRegister(RegisterAddress.R_R0);
        let c: any = [];
        while (ReadMemory(a) !== 0) {
          c.push(ReadMemory(a));
          a++;
        }
        putBuf(c);
        break;
      case TrapCode.TRAP_IN:
        SetRegister(RegisterAddress.R_R0, getChar());
        UpdateFlags(RegisterAddress.R_R0);
        break;
      case TrapCode.TRAP_PUTSP:
        let addr = GetRegister(RegisterAddress.R_R0);
        let charBuffer: any = [];
        while (ReadMemory(addr) != 0) {
          let char1 = ReadMemory(addr) & 0xff;
          charBuffer.push(String.fromCharCode(char1));

          let char2 = ReadMemory(addr) >> 8;
          if (char2) {
            charBuffer.push(char2);
          }
          addr++;
        }
        putBuf(charBuffer);
        break;
      case TrapCode.TRAP_HALT:
        PrintTerminal("[SYS] HALT");
        isRunning = false;
        break;
    }
  }

  // Entry Point
  PrintTerminal("[SYS] Running...");

  SetRegister(RegisterAddress.R_COND, ConditionFlag.FL_ZRO);
  SetRegister(RegisterAddress.R_PC, PC_START);

  isRunning = true;
  while (isRunning) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    let instruction = ReadMemory(GetRegister(RegisterAddress.R_PC));
    SetRegister(RegisterAddress.R_PC, GetRegister(RegisterAddress.R_PC) + 1);
    let opcode = instruction >> 12;

    switch (opcode) {
      case Opcode.OP_BR: {
        let pcOffset = SignExtend(instruction & 0x1ff, 9);
        let condFlag = (instruction >> 9) & 0x7;
        if (condFlag & GetRegister(RegisterAddress.R_COND)) {
          SetRegister(
            RegisterAddress.R_PC,
            GetRegister(RegisterAddress.R_PC) + pcOffset
          );
        }
        break;
      }
      case Opcode.OP_ADD: {
        let destinationReg = (instruction >> 9) & 0x7;
        let firstOperandReg = (instruction >> 6) & 0x7;
        let isImmediate = (instruction >> 5) & 0x1;

        if (isImmediate) {
          let immediateVal = SignExtend(instruction & 0x1f, 5);
          SetRegister(
            destinationReg,
            GetRegister(firstOperandReg) + immediateVal
          );
        } else {
          let secondOperandReg = instruction & 0x7;
          SetRegister(
            destinationReg,
            GetRegister(firstOperandReg) + GetRegister(secondOperandReg)
          );
        }

        UpdateFlags(destinationReg);
        break;
      }
      case Opcode.OP_LD: {
        let r0 = (instruction >> 9) & 0x7;
        let pc_offset = SignExtend(instruction & 0x1ff, 9);
        SetRegister(
          r0,
          ReadMemory(GetRegister(RegisterAddress.R_PC) + pc_offset)
        );
        UpdateFlags(r0);
        break;
      }
      case Opcode.OP_ST: {
        let r0 = (instruction >> 9) & 0x7;
        let pcOffset = SignExtend(instruction & 0x1ff, 9);
        WriteMemory(
          GetRegister(RegisterAddress.R_PC) + pcOffset,
          GetRegister(r0)
        );
        break;
      }
      case Opcode.OP_JSR: {
        let longFlag = (instruction >> 11) & 1;
        SetRegister(RegisterAddress.R_R7, GetRegister(RegisterAddress.R_PC));
        if (longFlag) {
          let longPCOffset = SignExtend(instruction & 0x7ff, 11);
          SetRegister(
            RegisterAddress.R_PC,
            GetRegister(RegisterAddress.R_PC) + longPCOffset
          );
        } else {
          let r1 = (instruction >> 6) & 0x7;
          SetRegister(RegisterAddress.R_PC, GetRegister(r1));
        }
        break;
      }
      case Opcode.OP_AND: {
        let destinationReg = (instruction >> 9) & 0x7;
        let firstOperandReg = (instruction >> 6) & 0x7;
        let isImmediate = (instruction >> 5) & 0x1;

        if (isImmediate) {
          let immediateVal = SignExtend(instruction & 0x1f, 5);
          SetRegister(
            destinationReg,
            GetRegister(firstOperandReg) & immediateVal
          );
        } else {
          let secondOperandReg = instruction & 0x7;
          SetRegister(
            destinationReg,
            GetRegister(firstOperandReg) & GetRegister(secondOperandReg)
          );
        }

        UpdateFlags(destinationReg);
        break;
      }
      case Opcode.OP_LDR: {
        let r0 = (instruction >> 9) & 0x7;
        let r1 = (instruction >> 6) & 0x7;
        let offset = SignExtend(instruction & 0x3f, 6);
        SetRegister(r0, ReadMemory(GetRegister(r1) + offset));
        UpdateFlags(r0);
        break;
      }
      case Opcode.OP_STR: {
        let r0 = (instruction >> 9) & 0x7;
        let r1 = (instruction >> 6) & 0x7;
        let offset = SignExtend(instruction & 0x3f, 6);
        WriteMemory(GetRegister(r1) + offset, GetRegister(r0));
        break;
      }
      case Opcode.OP_RTI: {
        break;
      }
      case Opcode.OP_NOT: {
        let destinationReg = (instruction >> 9) & 0x7;
        let firstOperandReg = (instruction >> 6) & 0x7;

        SetRegister(destinationReg, ~GetRegister(firstOperandReg));
        UpdateFlags(destinationReg);
        break;
      }
      case Opcode.OP_LDI: {
        let destinationReg = (instruction >> 9) & 0x7;
        let pcOffset = SignExtend(instruction & 0x1ff, 9);
        SetRegister(
          destinationReg,
          ReadMemory(ReadMemory(GetRegister(RegisterAddress.R_PC) + pcOffset))
        );
        UpdateFlags(destinationReg);
        break;
      }
      case Opcode.OP_STI: {
        let r0 = (instruction >> 9) & 0x7;
        let pc_offset = SignExtend(instruction & 0x1ff, 9);
        WriteMemory(
          ReadMemory(GetRegister(RegisterAddress.R_PC) + pc_offset),
          GetRegister(r0)
        );
        break;
      }
      case Opcode.OP_JMP: {
        let r1 = (instruction >> 6) & 0x7;
        SetRegister(RegisterAddress.R_PC, GetRegister(r1));
        break;
      }
      case Opcode.OP_RES: {
        break;
      }
      case Opcode.OP_LEA: {
        let r0 = (instruction >> 9) & 0x7;
        let pc_offset = SignExtend(instruction & 0x1ff, 9);
        SetRegister(r0, GetRegister(RegisterAddress.R_PC) + pc_offset);
        UpdateFlags(r0);
        break;
      }
      case Opcode.OP_TRAP: {
        handleTrap(instruction);
        break;
      }
      default:
        abort();
        break;
    }
  }
}
