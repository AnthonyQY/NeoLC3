import { Box, Typography } from "@mui/material";
import { useMemoryStore } from "../stores/MemoryStore";

export default function MemoryView() {
  const memory = useMemoryStore((state: any) => state.Memory);
  return (
    <Box>
      <Typography variant="body1">{memory.join(" ")}</Typography>
    </Box>
  );
}
