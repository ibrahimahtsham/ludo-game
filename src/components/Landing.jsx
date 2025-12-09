import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

function Landing({
  username,
  onUsernameChange,
  roomCode,
  onRoomCodeChange,
  onHost,
  onJoin,
  error,
}) {
  const canHost = Boolean(username.trim());
  const canJoin = username.trim() && roomCode.trim().length === 6;

  return (
    <Card sx={{ maxWidth: 600, mx: "auto" }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h4" align="center">
            Ludo Online
          </Typography>

          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}

          <TextField
            label="Username"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            fullWidth
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="contained"
              onClick={onHost}
              disabled={!canHost}
              fullWidth
            >
              Host Game
            </Button>
            <TextField
              label="Room Code"
              value={roomCode}
              onChange={(e) =>
                onRoomCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputProps={{ maxLength: 6 }}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={onJoin}
              disabled={!canJoin}
              fullWidth
            >
              Join Game
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Landing;
