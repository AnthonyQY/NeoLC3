import { Box, useMediaQuery } from "@mui/material";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { useOutputTerminalStore } from "../stores/OutputTerminalStore";
import Ansi from "ansi-to-react";

export default function TerminalView() {
  const terminalState = useOutputTerminalStore((state: any) => state.Lines);
  const printTerminal = useOutputTerminalStore((state: any) => state.addText);
  const clearTerminal = useOutputTerminalStore((state: any) => state.clearText);
  const isMobile = useMediaQuery("(max-width:900px)");
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
    <Box sx={{ height: "70%" }}>
      <Terminal
        name="NeoLC3 Console"
        colorMode={ColorMode.Dark}
        onInput={(terminalInput) => handleTerminalInput(terminalInput)}
        height={isMobile ? "8rem" : "inherit"}
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
