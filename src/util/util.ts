import { useRegisterStore } from "../stores/RegisterStore";
import { MEMORY_MAX, useMemoryStore } from "../stores/MemoryStore";
import { useTerminalStore } from "../stores/TerminalStore";
import { RegisterAddress } from "../enums/RegisterAddress";

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
  console.log(data.map((e) => String.fromCharCode(e)).join(""));
  PrintTerminal(data.map((e) => String.fromCharCode(e)).join(""));
}

export function PrintTerminal(text: string) {
  useTerminalStore.setState({
    Lines: useTerminalStore.getState().Lines.concat(text),
  });
}

export function ReadImageFile(imageFile: any, delay: number) {
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
