import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { playerColors } from "../constants/players";

function Lobby({ roomCode, playerId, room, onReadyToggle, onStart }) {
  const players = room?.players || {};
  const entries = Object.entries(players);
  const meReady = players[playerId]?.ready;
  const allReady = entries.length >= 2 && entries.every(([, p]) => p.ready);
  const canStart = room?.status === "lobby" && playerId === "p1" && allReady;

  const handleCopy = async () => {
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(roomCode);
      } catch (e) {
        // ignore copy failures
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Room {roomCode}</Typography>
            <Button size="small" onClick={handleCopy} variant="outlined">
              Copy code
            </Button>
            <Chip
              label={players[playerId]?.username || "You"}
              size="small"
              sx={{ bgcolor: playerColors[playerId], color: "black" }}
            />
          </Stack>

          <Typography variant="subtitle2">Players</Typography>
          <List dense disablePadding>
            {entries.map(([id, info]) => (
              <ListItem key={id} disablePadding>
                <ListItemText
                  primary={info.username || id}
                  secondary={info.ready ? "Ready" : "Not ready"}
                  primaryTypographyProps={{
                    sx: {
                      color: playerColors[id] || "inherit",
                      fontWeight: 600,
                    },
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      color: info.ready ? "success.main" : "text.secondary",
                    },
                  }}
                />
                <Chip
                  label={info.ready ? "Ready" : "Not ready"}
                  size="small"
                  color={info.ready ? "success" : "default"}
                  sx={{
                    ml: 1,
                    bgcolor: info.ready ? "success.main" : "grey.800",
                    color: "white",
                  }}
                />
              </ListItem>
            ))}
            {entries.length === 0 && (
              <ListItem disablePadding>
                <ListItemText primary="Waiting for players" />
              </ListItem>
            )}
          </List>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant={meReady ? "outlined" : "contained"}
              color={meReady ? "success" : "primary"}
              onClick={() => onReadyToggle(!meReady)}
            >
              {meReady ? "Unready" : "Ready"}
            </Button>
            {canStart && (
              <Button variant="contained" color="secondary" onClick={onStart}>
                Start Game
              </Button>
            )}
          </Stack>

          {room?.status === "active" && (
            <Typography variant="body2" color="success.main">
              Game started
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Lobby;
