import { Box, Typography } from "@mui/material";
import { useMemoryStore } from "../stores/MemoryStore";

export default function MemoryView() {
  const memory = useMemoryStore((state: any) => state.Memory);
  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Typography variant="body1" fontFamily={"IBM Plex Mono"}>
        {memory.join(" ")}
      </Typography>
    </Box>
  );
}
