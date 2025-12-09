import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Board from "./Board";
import { playerColors } from "../constants/players";

function GamePanel({ room, playerId, onRoll, onMoveToken }) {
  const turn = room?.game?.currentTurn;
  const lastRoll = room?.game?.lastRoll ?? "-";
  const canRoll = turn === playerId && room?.game?.lastRoll == null;
  const players = room?.players || {};
  const board = room?.game?.board;

  const playerEntries = Object.entries(players);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              Ludo Board
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`Turn: ${players[turn]?.username || turn || "-"}`}
                sx={{ bgcolor: playerColors[turn], color: "black" }}
              />
              <Chip label={`Last roll: ${lastRoll}`} />
            </Stack>
          </Stack>

          <Grid container spacing={2}>
            {playerEntries.map(([id, info]) => (
              <Grid item xs={6} sm={3} key={id}>
                <Card
                  variant="outlined"
                  sx={{ bgcolor: playerColors[id], color: "black" }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {info.username || id}
                    </Typography>
                    <Typography variant="body2">Your color</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card variant="outlined" sx={{ mt: 1 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="body1" gutterBottom>
                Roll when it is your turn, then click one of your tokens to
                move.
              </Typography>
              <Button variant="contained" onClick={onRoll} disabled={!canRoll}>
                Roll Dice
              </Button>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 1 }}>
            <CardContent>
              <Board
                board={board}
                players={players}
                playerId={playerId}
                lastRoll={room?.game?.lastRoll}
                onTokenClick={onMoveToken}
              />
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default GamePanel;
