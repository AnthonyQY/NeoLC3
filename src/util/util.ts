import { useRegisterStore } from "../stores/RegisterStore";
import { MEMORY_MAX, useMemoryStore } from "../stores/MemoryStore";
import { useOutputTerminalStore } from "../stores/OutputTerminalStore";
import { RegisterAddress } from "../enums/RegisterAddress";
import { useAssemblyTerminalStore } from "../stores/AssemblyTerminalStore";
import { useSystemTerminalStore } from "../stores/SystemTerminalStore";

export function SignExtend(x: number, bitCount: number): number {
  const m = 1 << (bitCount - 1);
  x &= (1 << bitCount) - 1;
  return (x ^ m) - m;
}

export function SetRegister(address: any, value: any) {
  const Registers = useRegisterStore.getState().Registers;
  useRegisterStore.setState({
    Registers: Registers.map((e: any, i: any) => {
      if (i == address) {
        return value;
      }
      return e;
    }),
  });
}

export function GetRegister(address: any): any {
  const Registers = useRegisterStore.getState().Registers;
  return Registers[address];
}

export function WriteMemory(address: any, value: any) {
  const Memory = useMemoryStore.getState().Memory;
  useMemoryStore.setState({
    Memory: Memory.map((e: any, i: any) => {
      if (i == address) {
        return value;
      }
      return e;
    }),
  });
}

export function ReadMemorySimple(address: any) {
  return useMemoryStore.getState().Memory[address];
}

export function putBuf(data: any[]) {
  PrintOutputTerminal(data.map((e) => String.fromCharCode(e)).join(""));
}

export function PrintSystemTerminal(text: string) {
  useSystemTerminalStore.setState({
    Lines: useSystemTerminalStore.getState().Lines.concat(text),
  });
}

export function PrintAssemblyTerminal(text: string) {
  useAssemblyTerminalStore.setState({
    Lines: useAssemblyTerminalStore.getState().Lines.concat(text),
  });
}

export function PrintOutputTerminal(text: string) {
  useOutputTerminalStore.setState({
    Lines: useOutputTerminalStore.getState().Lines.concat(text),
  });
}

export function ReadImageFile(imageFile: any) {
  const reader = new FileReader();

  reader.onload = function (event: any) {
    const imageBuffer = event.target.result;
    const dataView = new DataView(imageBuffer);

    const origin = dataView.getUint16(0, false);

    let pos = 0;

    while ((pos + 1) * 2 < imageBuffer.byteLength) {
      const value = dataView.getUint16((pos + 1) * 2, false);
      WriteMemory(origin + pos, value);
      pos++;
    }
  };

  reader.readAsArrayBuffer(imageFile);
}

export function ClearMemory() {
  useMemoryStore.setState({ Memory: new Uint16Array(MEMORY_MAX) });
}

export function ClearRegisters() {
  useRegisterStore.setState({
    Registers: new Uint16Array(RegisterAddress.R_COUNT),
  });
}
