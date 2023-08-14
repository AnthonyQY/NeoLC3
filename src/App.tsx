import TerminalView from "./components/OutputTerminalView";
import { Box, Stack } from "@mui/material";
import ControlPanel from "./components/ControlPanel";
import RegisterMemoryPanel from "./components/RegisterMemoryPanel";
import SystemTerminalView from "./components/SystemTerminalView";
import AssemblyTerminalView from "./components/AssemblyTerminalView";

function App() {
  return (
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
