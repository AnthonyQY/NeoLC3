import { Box, Button, MenuItem, Select } from "@mui/material";

import {
  ReadImageFile,
  ClearMemory,
  ClearRegisters,
  PrintSystemTerminal,
} from "../util/util";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { runLC3, stopLC3 } from "../util/LC3";

export default function ControlPanel() {
  const [delay, setDelay] = useState(250);
  const [loaded, setLoaded] = useState(false);
  const [running, setRunning] = useState(false);

  const handleUploadFile = (e: any) => {
    PrintSystemTerminal("[SYS] Loading: " + e.target.files[0]?.name);
    try {
      setLoaded(false);
      ReadImageFile(e.target.files[0]);
      PrintSystemTerminal(
        "[SYS] Loaded: " + e.target.files[0]?.name + " into memory."
      );
      setLoaded(true);
    } catch {
      PrintSystemTerminal(
        "[SYS] Error: Failed to read: " + e.target.files[0]?.name
      );
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
    PrintSystemTerminal("[SYS] Starting LC3... ");

    setRunning(true);
    runLC3(delay).then(() => {
      setLoaded(false);
      setRunning(false);
      unloadFile();
    });
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
        flex: "0 0 20%",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
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
  );
}
