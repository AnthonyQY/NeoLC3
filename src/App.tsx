import TerminalView from "./components/TerminalView";
import { Box } from "@mui/material";
import ControlPanel from "./components/ControlPanel";
import RegisterMemoryPanel from "./components/RegisterMemoryPanel";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <ControlPanel />
      <TerminalView />
      <RegisterMemoryPanel />
    </Box>
  );
}

export default App;
