import { Box } from "@mui/material";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { useSystemTerminalStore } from "../stores/SystemTerminalStore";
import Ansi from "ansi-to-react";

export default function TerminalView() {
  const terminalState = useSystemTerminalStore((state: any) => state.Lines);
  const printTerminal = useSystemTerminalStore((state: any) => state.addText);
  const clearTerminal = useSystemTerminalStore((state: any) => state.clearText);

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
    <Box sx={{ height: "100%" }}>
      <Terminal
        name="System Log"
        colorMode={ColorMode.Dark}
        onInput={(terminalInput) => handleTerminalInput(terminalInput)}
        height="inherit"
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
