import { Box, Button, MenuItem, Select } from "@mui/material";
import RegisterPanel from "./RegisterPanel";
import {
  ReadImageFile,
  PrintTerminal,
  ClearMemory,
  ClearRegisters,
} from "../util/util";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { runLC3, stopLC3 } from "../util/LC3";

export default function ControlPanel() {
  const [delay, setDelay] = useState(250);
  const [loaded, setLoaded] = useState(false);
  const [running, setRunning] = useState(false);

  const handleUploadFile = (e: any) => {
    PrintTerminal("[SYS] Loading: " + e.target.files[0]?.name);
    try {
      setLoaded(false);
      ReadImageFile(e.target.files[0]);
      PrintTerminal(
        "[SYS] Loaded: " + e.target.files[0]?.name + " into memory."
      );
      setLoaded(true);
    } catch {
      PrintTerminal("[ERR] Failed to read: " + e.target.files[0]?.name);
    }
    e.target.value = "";
  };

  const unloadFile = () => {
    stopLC3();
    setTimeout(function () {
      ClearMemory();
      ClearRegisters();
    }, 1000);
  };

  const handleRunBtn = () => {
    PrintTerminal("[SYS] Starting LC3... ");
    runLC3(delay);
    setRunning(true);
  };

  const handleStopBtn = () => {
    unloadFile();
    setLoaded(false);
    setRunning(false);
  };

  const handleChange = (e: any) => {
    setDelay(e.target.value);
  };

  return (
    <Box
      sx={{
        flex: "0 0 25%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        backgroundColor: "#36393F",
        color: "#DCDDDE",
        padding: "1rem",
      }}
    >
      <Typography variant="h4">NeoLC3 Control</Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          width: "100%",
        }}
      >
        <Button variant="contained" component="label">
          Upload (.obj)
          <input type="file" hidden onChange={handleUploadFile} />
        </Button>

        {running ? (
          <Button
            variant="contained"
            component="label"
            color="error"
            onClick={handleStopBtn}
            disabled={!loaded}
          >
            Stop
          </Button>
        ) : (
          <Button
            variant="contained"
            component="label"
            color="success"
            onClick={handleRunBtn}
            disabled={!loaded}
          >
            Run
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          width: "100%",
        }}
      >
        <Typography variant="body1">Delay (ms)</Typography>
        <Select
          id="outlined-number"
          value={delay}
          onChange={handleChange}
          sx={{
            border: "1px solid #2F3136",
            color: "white",
            minWidth: "5rem",
            maxWidth: "50%",
            height: "3rem",
          }}
        >
          <MenuItem value={0}>0</MenuItem>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={250}>250</MenuItem>
          <MenuItem value={500}>500</MenuItem>
          <MenuItem value={1000}>1000</MenuItem>
        </Select>
      </Box>

      <RegisterPanel />
    </Box>
  );
}
