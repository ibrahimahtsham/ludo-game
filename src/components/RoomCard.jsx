import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

function RoomCard({ roomCode, playerId, room, onStart }) {
  const players = room?.players || {};
  const entries = Object.entries(players);
  const canStart =
    room?.status === "lobby" && playerId === "p1" && entries.length >= 2;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1">Room {roomCode}</Typography>
        <Typography variant="body2">You are: {playerId || "-"}</Typography>
        <Typography variant="body2">
          Status: {room?.status || "waiting"}
        </Typography>

        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          Players
        </Typography>
        <List dense disablePadding>
          {entries.map(([id, info]) => (
            <ListItem key={id} disablePadding>
              <ListItemText primary={`${info.username || id} (${id})`} />
            </ListItem>
          ))}
          {entries.length === 0 && (
            <ListItem disablePadding>
              <ListItemText primary="Waiting for players" />
            </ListItem>
          )}
        </List>

        {canStart && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={onStart}>
            Start Game
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default RoomCard;
