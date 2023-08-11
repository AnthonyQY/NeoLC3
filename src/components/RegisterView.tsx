import { Box, Typography } from "@mui/material";
import { useRegisterStore } from "../stores/RegisterStore";
import { useEffect, useState } from "react";

export default function RegisterView({
  registerAddress,
  registerName,
}: {
  registerAddress: any;
  registerName: string;
}) {
  const registers = useRegisterStore((state: any) => state.Registers);
  const [colorState, setColorState] = useState("#202225");
  const [first, setFirst] = useState(0);

  useEffect(() => {
    if (first > 0) {
      setColorState("#27ae60");
      setTimeout(function () {
        setColorState("#202225");
      }, 2000);
    } else {
      setFirst(first + 1);
    }
  }, [registers[registerAddress]]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        padding: "0.25rem",

        border: "1px solid black",
        backgroundColor: colorState,
        color: "#DCDDDE",
      }}
    >
      <Typography variant="body1">{registers[registerAddress]}</Typography>
      <Typography variant="subtitle1">{registerName}</Typography>
    </Box>
  );
}
