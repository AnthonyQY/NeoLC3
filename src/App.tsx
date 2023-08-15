import TerminalView from "./components/OutputTerminalView";
import { Box, Stack, useMediaQuery } from "@mui/material";
import ControlPanel from "./components/ControlPanel";
import RegisterMemoryPanel from "./components/RegisterMemoryPanel";
import SystemTerminalView from "./components/SystemTerminalView";
import AssemblyTerminalView from "./components/AssemblyTerminalView";
import { Circle2 } from "react-preloaders";

function App() {
  const isMobile = useMediaQuery("(max-width:800px)");
  return (
    <>
      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
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
      )}
      <Circle2 time={1000} background="#121212" color={"#55C39E"} />
    </>
  );
}

export default App;
