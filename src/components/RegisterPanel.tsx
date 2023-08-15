import { Box } from "@mui/material";
import RegisterView from "./RegisterView";

export default function RegisterPanel() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))",
        height: "100%",
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
  );
}
