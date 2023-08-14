import { Box, Typography } from "@mui/material";
import { useMemoryStore } from "../stores/MemoryStore";

export default function MemoryView() {
  const memory = useMemoryStore((state: any) => state.Memory);
  return (
    <Box sx={{ height: "70%", flex: "0 0 20%" }}>
      <Box
        sx={{
          overflowY: "auto",
          height: "100%",
          backgroundColor: "#202225",
          padding: "0.5rem",
          color: "white",
        }}
      >
        <Typography variant="body1">
          {memory.map((x: any) => x !== "0").join(" ")}
        </Typography>
      </Box>
    </Box>
  );
}
