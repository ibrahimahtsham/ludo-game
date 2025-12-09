import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

function UsernameInput({ username, onChange }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems="center"
    >
      <TextField
        label="Username"
        value={username}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
      />
    </Stack>
  );
}

export default UsernameInput;
