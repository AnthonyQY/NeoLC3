import { Box } from "@mui/material";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { useAssemblyTerminalStore } from "../stores/AssemblyTerminalStore";
import Ansi from "ansi-to-react";

export default function TerminalView() {
  const terminalState = useAssemblyTerminalStore((state: any) => state.Lines);
  const printTerminal = useAssemblyTerminalStore((state: any) => state.addText);
  const clearTerminal = useAssemblyTerminalStore(
    (state: any) => state.clearText
  );

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
    <Box sx={{ height: "30%" }}>
      <Terminal
        name="Assembly Execution"
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
