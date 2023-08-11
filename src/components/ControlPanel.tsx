import { Box, Button } from "@mui/material";
import RegisterPanel from "./RegisterPanel";
import { ReadImageFile, PrintTerminal } from "../util/util";
import Typography from "@mui/material/Typography";

export default function ControlPanel() {
  const handleUploadFile = (e: any) => {
    PrintTerminal("[INF] Loading: " + e.target.files[0]?.name);
    try {
      ReadImageFile(e.target.files[0]);
    } catch {
      PrintTerminal("[ERR] Failed to read: " + e.target.files[0]?.name);
    }
    e.target.value = "";
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

      <RegisterPanel />
    </Box>
  );
}
