import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, set, onValue } from "firebase/database";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [value, setValueState] = useState("");
  const [remoteValue, setRemoteValue] = useState("");

  useEffect(() => {
    const valueRef = ref(db, "test/value");
    onValue(valueRef, (snapshot) => {
      const data = snapshot.val();
      setRemoteValue(data || "");
    });
  }, []);

  const handleChange = (e) => {
    setValueState(e.target.value);
    set(ref(db, "test/value"), e.target.value);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={11} sm={8} md={4}>
          <Typography variant="h5" gutterBottom align="center">
            Realtime Test
          </Typography>

          <TextField
            label="Type something..."
            variant="outlined"
            value={value}
            onChange={handleChange}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => set(ref(db, "test/value"), value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            Update
          </Button>

          <Typography variant="body1" sx={{ mt: 2 }} align="center">
            Live value from database: {remoteValue}
          </Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
