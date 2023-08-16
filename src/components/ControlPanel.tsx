import { Box, Button, LinearProgress, MenuItem, Select } from "@mui/material";

import {
  ReadImageFile,
  ClearMemory,
  ClearRegisters,
  PrintSystemTerminal,
} from "../util/util";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { runLC3, stopLC3 } from "../util/LC3";

import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

import "../fonts/fonts.css";

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
    ClearMemory();
    ClearRegisters();
  };

  const unloadFileInterrupt = () => {
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
      if (loaded) {
        unloadFile();
        setLoaded(false);
      }
      setRunning(false);
    });
  };

  const handleStopBtn = () => {
    unloadFileInterrupt();
    setLoaded(false);
    setRunning(false);
  };

  const handleChange = (e: any) => {
    setDelay(e.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: "center",
        backgroundColor: "#36393F",
        color: "#DCDDDE",
        padding: "1rem",
        height: "40%",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Typography
          sx={{ fontFamily: "LEMONMILK" }}
          variant="h4"
          color={"#55C39E"}
        >
          NEO
        </Typography>
        <Typography sx={{ fontFamily: "LEMONMILK" }} variant="h4">
          LC3
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          width: "100%",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Button
            component="label"
            sx={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "#27AE60",
              color: "white",
              ":hover": { backgroundColor: "#219653" },
            }}
            startIcon={<UploadIcon />}
          >
            Upload (.obj)
            <input type="file" hidden onChange={handleUploadFile} />
          </Button>
        </Box>

        <Button
          variant="contained"
          href="../hworld.obj"
          sx={{
            minWidth: "8rem",
            backgroundColor: "#3498DB",
            ":hover": {
              backgroundColor: "#2980B9",
            },
          }}
          startIcon={<DownloadIcon />}
        >
          Example
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
            width: "100%",
            height: "3rem",
          }}
          disabled={running}
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
          onClick={handleStopBtn}
          disabled={!loaded}
          sx={{
            width: "100%",
            backgroundColor: "#E74C3C",
            ":hover": { backgroundColor: "#C0392B" },
            height: "4rem",
          }}
          startIcon={<StopIcon />}
        >
          Stop
        </Button>
      ) : (
        <Button
          variant="contained"
          component="label"
          onClick={handleRunBtn}
          disabled={!loaded}
          sx={{
            width: "100%",
            backgroundColor: "#2ECC71",
            ":hover": { backgroundColor: "#27AE60" },
            height: "4rem",
          }}
          startIcon={<PlayArrowIcon />}
        >
          Run
        </Button>
      )}
      <Box sx={{ width: "100%" }}>
        {running ? (
          <LinearProgress
            variant="indeterminate"
            sx={{ height: "10px", backgroundColor: "#2f3136" }}
          />
        ) : (
          <LinearProgress
            variant="determinate"
            color="success"
            sx={{ height: "10px", backgroundColor: "#2f3136" }}
            value={0}
          />
        )}
      </Box>
    </Box>
  );
}
