import { RegisterAddress } from "../enums/RegisterAddress";
import { ConditionFlag, UpdateFlags } from "../enums/ConditionFlag";
import { useMemoryStore } from "../stores/MemoryStore";
import { MMRA } from "../enums/RegisterAddress";
import {
  GetRegister,
  PrintAssemblyTerminal,
  PrintOutputTerminal,
  PrintSystemTerminal,
  SetRegister,
  WriteMemory,
} from "./util";
import { Opcode } from "../enums/OpCode";
import { SignExtend, putBuf } from "./util";
import { TrapCode } from "../enums/TrapCode";
import { abort } from "process";

const PC_START = 0x3000;
let isRunning: boolean = true;

export function stopLC3() {
  PrintSystemTerminal("[SYS] SYSTEM INTERRUPT");
  isRunning = false;
}

export async function runLC3(delay: number) {
  function getChar() {
    PrintSystemTerminal("[SYS] Awaiting user input...");
    var input = prompt("Input: ") || "N";
    PrintSystemTerminal("[SYS] User input received. Continuing...");
    PrintOutputTerminal("[USR] Input: " + input);
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
        PrintAssemblyTerminal("----- GETC");
        SetRegister(RegisterAddress.R_R0, getChar());
        UpdateFlags(RegisterAddress.R_R0);
        break;
      case TrapCode.TRAP_OUT:
        PrintAssemblyTerminal("----- OUT ");
        putBuf([GetRegister(RegisterAddress.R_R0)]);
        break;
      case TrapCode.TRAP_PUTS:
        PrintAssemblyTerminal("----- PUTS");
        let a = GetRegister(RegisterAddress.R_R0);
        let c: any = [];
        while (ReadMemory(a) !== 0) {
          c.push(ReadMemory(a));
          a++;
        }
        putBuf(c);
        break;
      case TrapCode.TRAP_IN:
        PrintAssemblyTerminal("----- IN  ");
        SetRegister(RegisterAddress.R_R0, getChar());
        UpdateFlags(RegisterAddress.R_R0);
        break;
      case TrapCode.TRAP_PUTSP:
        PrintAssemblyTerminal("----- PUTSP");
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
        PrintAssemblyTerminal("----- HALT");
        PrintSystemTerminal("[SYS] HALT");
        isRunning = false;
        break;
    }
  }

  // Entry Point
  PrintSystemTerminal("[SYS] Running...");

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
        PrintAssemblyTerminal("[ASM] BR  " + pcOffset + " " + condFlag);
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
        PrintAssemblyTerminal(
          "[ASM] ADD " +
            destinationReg +
            " " +
            firstOperandReg +
            " " +
            isImmediate
        );
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
        PrintAssemblyTerminal("[ASM] LD  " + r0 + " " + pc_offset);
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
        PrintAssemblyTerminal("[ASM] ST  " + r0 + " " + pcOffset);
        WriteMemory(
          GetRegister(RegisterAddress.R_PC) + pcOffset,
          GetRegister(r0)
        );
        break;
      }
      case Opcode.OP_JSR: {
        let longFlag = (instruction >> 11) & 1;
        PrintAssemblyTerminal("[ASM] JSR " + longFlag);
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
        PrintAssemblyTerminal(
          "[ASM] AND " +
            destinationReg +
            " " +
            firstOperandReg +
            " " +
            isImmediate
        );
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
        PrintAssemblyTerminal("[ASM] LDR " + r0 + " " + r1 + " " + offset);
        SetRegister(r0, ReadMemory(GetRegister(r1) + offset));
        UpdateFlags(r0);
        break;
      }
      case Opcode.OP_STR: {
        let r0 = (instruction >> 9) & 0x7;
        let r1 = (instruction >> 6) & 0x7;
        let offset = SignExtend(instruction & 0x3f, 6);
        PrintAssemblyTerminal("[ASM] STR " + r0 + " " + r1 + " " + offset);
        WriteMemory(GetRegister(r1) + offset, GetRegister(r0));
        break;
      }
      case Opcode.OP_RTI: {
        PrintAssemblyTerminal("[ASM] RTI ");
        break;
      }
      case Opcode.OP_NOT: {
        let destinationReg = (instruction >> 9) & 0x7;
        let firstOperandReg = (instruction >> 6) & 0x7;
        PrintAssemblyTerminal(
          "[ASM] NOT " + destinationReg + " " + firstOperandReg
        );
        SetRegister(destinationReg, ~GetRegister(firstOperandReg));
        UpdateFlags(destinationReg);
        break;
      }
      case Opcode.OP_LDI: {
        let destinationReg = (instruction >> 9) & 0x7;
        let pcOffset = SignExtend(instruction & 0x1ff, 9);
        PrintAssemblyTerminal("[ASM] LDI " + destinationReg + " " + pcOffset);
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
        PrintAssemblyTerminal("[ASM] STI " + r0 + " " + pc_offset);
        WriteMemory(
          ReadMemory(GetRegister(RegisterAddress.R_PC) + pc_offset),
          GetRegister(r0)
        );
        break;
      }
      case Opcode.OP_JMP: {
        let r1 = (instruction >> 6) & 0x7;
        PrintAssemblyTerminal("[ASM] JMP " + r1);
        SetRegister(RegisterAddress.R_PC, GetRegister(r1));
        break;
      }
      case Opcode.OP_RES: {
        PrintAssemblyTerminal("[ASM] RES ");
        break;
      }
      case Opcode.OP_LEA: {
        let r0 = (instruction >> 9) & 0x7;
        let pc_offset = SignExtend(instruction & 0x1ff, 9);
        PrintAssemblyTerminal("[ASM] LEA " + r0 + " " + pc_offset);
        SetRegister(r0, GetRegister(RegisterAddress.R_PC) + pc_offset);
        UpdateFlags(r0);
        break;
      }
      case Opcode.OP_TRAP: {
        PrintAssemblyTerminal("[ASM] TRAP " + instruction);
        handleTrap(instruction);
        break;
      }
      default:
        PrintAssemblyTerminal("[ASM] Error: Invalid opcode. Aborting.");
        abort();
        break;
    }
  }
}
