import { Box } from "@mui/material";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { useTerminalStore } from "../stores/TerminalStore";
import Ansi from "ansi-to-react";

export default function TerminalView() {
  const terminalState = useTerminalStore((state: any) => state.Lines);
  const printTerminal = useTerminalStore((state: any) => state.addText);
  const clearTerminal = useTerminalStore((state: any) => state.clearText);

  const handleTerminalInput = (input: string) => {
    switch (input.toLowerCase()) {
      case "clear": {
        clearTerminal();
        break;
      }
      default: {
        printTerminal("Unknown command: " + input);
      }
    }
  };

  return (
    <Box sx={{ flex: "0 0 60%", height: "100vh" }}>
      <Terminal
        name="NeoLC3 Console"
        colorMode={ColorMode.Dark}
        onInput={(terminalInput) => handleTerminalInput(terminalInput)}
      >
        {terminalState.map((x: any) => {
          return (
            <TerminalOutput>
              <Ansi>{x}</Ansi>
            </TerminalOutput>
          );
        })}
      </Terminal>
    </Box>
  );
}
