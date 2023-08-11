import TerminalView from "./components/TerminalView";
import { Box } from "@mui/material";
import ControlPanel from "./components/ControlPanel";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      <ControlPanel />
      <TerminalView />
    </Box>
  );
}

export default App;
