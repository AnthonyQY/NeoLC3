import TerminalView from "./components/OutputTerminalView";
import { Box, Stack, useMediaQuery } from "@mui/material";
import ControlPanel from "./components/ControlPanel";
import RegisterMemoryPanel from "./components/RegisterMemoryPanel";
import SystemTerminalView from "./components/SystemTerminalView";
import AssemblyTerminalView from "./components/AssemblyTerminalView";

function App() {
  const isMobile = useMediaQuery("(max-width:800px)");
  return isMobile ? (
    <Box sx={{ display: "flex", flexDirection: "column", height: "200vh" }}>
      <Stack height={"100%"} sx={{ overflow: "hidden" }}>
        <ControlPanel />
        <SystemTerminalView />
        <TerminalView />
        <AssemblyTerminalView />
        <RegisterMemoryPanel />
      </Stack>
    </Box>
  ) : (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <Stack sx={{ flex: "0 0 25%" }}>
        <ControlPanel />
        <SystemTerminalView />
      </Stack>
      <Stack sx={{ flex: "0 0 55%" }}>
        <TerminalView />
        <AssemblyTerminalView />
      </Stack>

      <RegisterMemoryPanel />
    </Box>
  );
}

export default App;
