import { Box, Typography } from "@mui/material";
import RegisterView from "./RegisterView";

export default function RegisterPanel() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",

        padding: "1rem",
        width: "100%",
        border: "1px solid #2F3136",

        backgroundColor: "#36393F",
        color: "#DCDDDE",
      }}
    >
      <Typography variant="h5">Registers</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          maxWidth: "fit-content",
        }}
      >
        <RegisterView registerAddress={0} registerName={"R_R0"} />
        <RegisterView registerAddress={1} registerName={"R_R1"} />
        <RegisterView registerAddress={2} registerName={"R_R2"} />
        <RegisterView registerAddress={3} registerName={"R_R3"} />
        <RegisterView registerAddress={4} registerName={"R_R4"} />
        <RegisterView registerAddress={5} registerName={"R_R5"} />
        <RegisterView registerAddress={6} registerName={"R_R6"} />
        <RegisterView registerAddress={7} registerName={"R_R7"} />
        <RegisterView registerAddress={8} registerName={"R_PC"} />
        <RegisterView registerAddress={9} registerName={"R_COND"} />
      </Box>
    </Box>
  );
}
