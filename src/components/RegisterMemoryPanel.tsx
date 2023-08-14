import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import MemoryView from "./MemoryView";
import RegisterPanel from "./RegisterPanel";
import { useEffect, useState } from "react";
import { MEMORY_MAX, useMemoryStore } from "../stores/MemoryStore";

function countNonZeroElements(arr: number[]): number {
  let count = 0;
  for (const num of arr) {
    if (num !== 0) {
      count++;
    }
  }
  return count;
}

export default function RegisterMemoryPanel() {
  const memory = useMemoryStore((state: any) => state.Memory);
  const normalise = (value: any) => (value * 100) / MEMORY_MAX;
  const [memoryCapacity, setMemoryCapacity] = useState(0);

  useEffect(() => {
    setMemoryCapacity(countNonZeroElements(memory));
  }, [memory]);
  return (
    <Stack sx={{ height: "100vh" }}>
      <Typography
        sx={{
          margin: 0,
          padding: "0.5rem",
          backgroundColor: "#36393F",
          color: "white",
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
          backgroundColor: "#36393F",
          color: "white",
        }}
        variant="h6"
      >
        Memory
        <Typography variant="body2">
          {"Used: " + memoryCapacity + " / " + MEMORY_MAX}
        </Typography>
      </Typography>
      <Box>
        <LinearProgress
          variant="determinate"
          value={normalise(memoryCapacity)}
        />
      </Box>
      <MemoryView />
    </Stack>
  );
}
