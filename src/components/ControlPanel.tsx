import { Box, Button, MenuItem, Select } from "@mui/material";
import RegisterPanel from "./RegisterPanel";
import { ReadImageFile, PrintTerminal } from "../util/util";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function ControlPanel() {
  const [delay, setDelay] = useState(250);
  const handleUploadFile = (e: any) => {
    PrintTerminal("[INF] Loading: " + e.target.files[0]?.name);
    try {
      ReadImageFile(e.target.files[0], delay);
    } catch {
      PrintTerminal("[ERR] Failed to read: " + e.target.files[0]?.name);
    }
    e.target.value = "";
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

      <Button variant="contained" component="label">
        Upload Instructions (.obj)
        <input type="file" hidden onChange={handleUploadFile} />
      </Button>
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
