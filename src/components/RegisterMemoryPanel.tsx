import { Box, Typography } from "@mui/material";
import MemoryView from "./MemoryView";
import RegisterPanel from "./RegisterPanel";

export default function RegisterMemoryPanel() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography
        sx={{
          margin: 0,
          padding: "0.5rem",
          backgroundColor: "#202225",
          color: "white",
          height: "100%",
        }}
        variant="h6"
      >
        Registers
      </Typography>
      <RegisterPanel />
      <Typography
        sx={{
          margin: 0,
          padding: "0.5rem",
          backgroundColor: "#202225",
          color: "white",
          height: "100%",
        }}
        variant="h6"
      >
        Memory
      </Typography>
      <MemoryView />
    </Box>
  );
}
