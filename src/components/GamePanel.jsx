import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Board from "./Board";
import ChatBox from "./ChatBox";
import { playerColors } from "../constants/players";

function GamePanel({
  room,
  playerId,
  onRoll,
  onMoveToken,
  chat,
  message,
  onMessageChange,
  onSend,
}) {
  const turn = room?.game?.currentTurn;
  const lastRoll = room?.game?.lastRoll ?? "-";
  const canRoll = turn === playerId && room?.game?.lastRoll == null;
  const players = room?.players || {};
  const board = room?.game?.board;

  const playerEntries = Object.entries(players);

  return (
    <Card
      sx={{
        minHeight: { xs: "72vh", md: "78vh" },
        display: "flex",
        flexDirection: "column",
        border: turn
          ? `2px solid ${playerColors[turn] || "rgba(255,255,255,0.24)"}`
          : undefined,
      }}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Grid
          container
          spacing={2}
          alignItems="stretch"
          sx={{
            flex: 1,
            minHeight: 0,
            display: { xs: "block", md: "grid" },
            gridTemplateColumns: { md: "0.1fr 0.5fr 0.4fr" },
            columnGap: 16,
          }}
        >
          <Grid item xs={12} md="auto">
            <Stack spacing={1.25} sx={{ height: "100%" }}>
              <Typography variant="h6">Players</Typography>
              <Stack spacing={1}>
                {playerEntries.map(([id, info]) => (
                  <Card
                    key={id}
                    variant="outlined"
                    sx={{ bgcolor: playerColors[id], color: "black" }}
                  >
                    <CardContent sx={{ textAlign: "center", py: 2 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {info.username || id}
                      </Typography>
                      <Typography variant="body2">Your color</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md="auto">
            <Stack spacing={2} sx={{ height: "100%", flex: 1, minHeight: 0 }}>
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

              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent sx={{ p: 1, height: "100%", display: "flex" }}>
                  <Board
                    board={board}
                    playerId={playerId}
                    lastRoll={room?.game?.lastRoll}
                    onTokenClick={onMoveToken}
                  />
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md="auto">
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent sx={{ p: 1.5, height: "100%" }}>
                <Stack spacing={2} sx={{ height: "100%" }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Button
                      variant="contained"
                      color={canRoll ? "primary" : "inherit"}
                      onClick={onRoll}
                      disabled={!canRoll}
                      fullWidth
                    >
                      Roll Dice
                    </Button>
                    <Chip
                      label={`Rolled: ${lastRoll}`}
                      color={lastRoll === "-" ? "default" : "secondary"}
                      sx={{ fontWeight: 700 }}
                    />
                  </Stack>
                  <ChatBox
                    chat={chat}
                    message={message}
                    onMessageChange={onMessageChange}
                    onSend={onSend}
                    fillHeight
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default GamePanel;
