import { useEffect, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ChatBox from "./components/ChatBox";
import Landing from "./components/Landing";
import Lobby from "./components/Lobby";
import GamePanel from "./components/GamePanel";
import {
  createRoom,
  joinRoom,
  listenToRoom,
  rollDice,
  sendChatMessage,
  startGame,
  seatOrder,
  setReady,
  moveToken,
} from "./services/rtdb";
import { FINISH, HOME, TRACK_LENGTH, HOME_LANE_LENGTH } from "./constants/game";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [username, setUsername] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [room, setRoom] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [error, setError] = useState("");

  const activePlayers = useMemo(
    () => seatOrder.filter((s) => room?.players?.[s]),
    [room]
  );

  useEffect(() => {
    if (!roomCode) return undefined;
    const unsubscribe = listenToRoom(roomCode, (data) => setRoom(data));
    return () => unsubscribe?.();
  }, [roomCode]);

  const handleCreateRoom = async () => {
    if (!username.trim()) {
      setError("Enter a username first");
      return;
    }
    try {
      setError("");
      const { code, playerId } = await createRoom(username.trim());
      setRoomCode(code);
      setPlayerId(playerId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoinRoom = async () => {
    if (!username.trim()) {
      setError("Enter a username first");
      return;
    }
    if (roomCodeInput.trim().length !== 6) {
      setError("Enter a 6-digit room code");
      return;
    }
    try {
      setError("");
      const { code, playerId } = await joinRoom(
        roomCodeInput.trim(),
        username.trim()
      );
      setRoomCode(code);
      setPlayerId(playerId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendChat = async () => {
    if (!roomCode || !chatMessage.trim()) return;
    await sendChatMessage(roomCode, {
      from: username || playerId,
      text: chatMessage.trim(),
    });
    setChatMessage("");
  };

  const handleStartGame = async () => {
    if (!roomCode) return;
    if (activePlayers.length < 2) {
      setError("Need at least 2 players to start");
      return;
    }
    await startGame(roomCode);
  };

  const handleRollDice = async () => {
    if (!roomCode || room?.game?.currentTurn !== playerId) return;
    if (room?.game?.lastRoll != null) return; // prevent multiple rolls in one turn

    const value = Math.floor(Math.random() * 6) + 1;
    const consecutive = room?.game?.consecutiveSixes || {};
    const tokens = room?.game?.board?.tokens?.[playerId] || [];
    const prev = consecutive[playerId] || 0;
    const rolledSix = value === 6;
    const nextCount = rolledSix ? prev + 1 : 0;

    // Three 6s in a row: skip the rest of the turn
    if (rolledSix && nextCount >= 3) {
      const nextTurn = computeNextTurn();
      const updatedCounts = { ...consecutive, [playerId]: 0 };
      await rollDice(roomCode, {
        lastRoll: null,
        nextTurn,
        consecutiveSixes: updatedCounts,
      });
      await sendChatMessage(roomCode, {
        from: username || playerId,
        text: `rolled 6 (third in a row, turn skipped)`,
        at: Date.now(),
      });
      return;
    }

    const updatedCounts = { ...consecutive, [playerId]: nextCount };

    // If no move is possible for this roll, auto-pass the turn
    const entryIndex = TRACK_LENGTH - 2; // relative index 50 is home entry
    const hasAnyMove = tokens.some((pos) => {
      if (pos === HOME) return rolledSix; // must roll 6 to leave garage

      if (pos < entryIndex) {
        const stepsToEntry = entryIndex - pos;
        if (value <= stepsToEntry) return true; // still on loop
        const laneSteps = value - stepsToEntry - 1; // step into lane cell 0
        return laneSteps < HOME_LANE_LENGTH; // can land inside lane
      }

      if (pos === entryIndex) {
        const laneSteps = value - 1; // first step enters lane
        return laneSteps < HOME_LANE_LENGTH;
      }

      // In home lane
      const laneIdx = pos - TRACK_LENGTH;
      return laneIdx + value < HOME_LANE_LENGTH; // cannot overshoot center
    });

    if (!hasAnyMove) {
      const nextTurn = computeNextTurn();
      await rollDice(roomCode, {
        lastRoll: null,
        nextTurn,
        consecutiveSixes: updatedCounts,
      });
      await sendChatMessage(roomCode, {
        from: username || playerId,
        text: `rolled ${value} (no moves, turn passed)`,
        at: Date.now(),
      });
      return;
    }

    await rollDice(roomCode, {
      value,
      consecutiveSixes: updatedCounts,
    });

    await sendChatMessage(roomCode, {
      from: username || playerId,
      text: `rolled ${value}`,
      at: Date.now(),
    });
  };

  const computeNextTurn = () => {
    const order = activePlayers;
    const current = room?.game?.currentTurn;
    const idx = order.indexOf(current);
    return order.length > 0 ? order[(idx + 1) % order.length] : null;
  };

  const handleMoveToken = async (tokenIndex) => {
    if (!roomCode || room?.game?.currentTurn !== playerId) return;
    const lastRoll = room?.game?.lastRoll;
    if (!lastRoll) return;

    const tokens = room?.game?.board?.tokens?.[playerId];
    if (!tokens || tokenIndex < 0 || tokenIndex >= tokens.length) return;
    const currentPos = tokens[tokenIndex];

    let nextPos = currentPos;
    const entryIndex = TRACK_LENGTH - 2; // relative index 50 is home entry

    if (currentPos === HOME) {
      // Leaving garage requires a 6
      if (lastRoll === 6) {
        nextPos = 0;
      } else {
        return;
      }
    } else if (currentPos < TRACK_LENGTH) {
      if (currentPos < entryIndex) {
        const stepsToEntry = entryIndex - currentPos;
        if (lastRoll <= stepsToEntry) {
          nextPos = currentPos + lastRoll; // stay on loop
        } else {
          const laneSteps = lastRoll - stepsToEntry - 1; // first step enters lane0
          if (laneSteps >= HOME_LANE_LENGTH) return; // overshoots center
          nextPos = TRACK_LENGTH + laneSteps;
        }
      } else if (currentPos === entryIndex) {
        const laneSteps = lastRoll - 1;
        if (laneSteps >= HOME_LANE_LENGTH) return; // overshoots center
        nextPos = TRACK_LENGTH + laneSteps;
      } else {
        // Should never be > entryIndex on loop, but guard anyway
        return;
      }
    } else {
      // In home lane already
      const laneIdx = currentPos - TRACK_LENGTH;
      const candidateLane = laneIdx + lastRoll;
      if (candidateLane >= HOME_LANE_LENGTH) return; // cannot overshoot center
      nextPos = TRACK_LENGTH + candidateLane;
    }

    const tokensCopy = [...tokens];
    tokensCopy[tokenIndex] = nextPos;

    const finished = tokensCopy.every((p) => p >= FINISH);
    const nextTurn = finished
      ? null
      : lastRoll === 6
      ? playerId // extra turn on rolling 6 (unless finished)
      : computeNextTurn();

    await moveToken(
      roomCode,
      playerId,
      tokenIndex,
      nextPos,
      nextTurn,
      finished ? playerId : null
    );
  };

  const handleReadyToggle = async (ready) => {
    if (!roomCode || !playerId) return;
    await setReady(roomCode, playerId, ready);
  };

  const showLanding = !roomCode;
  const gameActive = room?.status === "active";

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", px: { xs: 1.5, sm: 2 }, py: 3 }}>
        {showLanding ? (
          <Landing
            username={username}
            onUsernameChange={setUsername}
            roomCode={roomCodeInput}
            onRoomCodeChange={setRoomCodeInput}
            onHost={handleCreateRoom}
            onJoin={handleJoinRoom}
            error={error}
          />
        ) : gameActive ? (
          <GamePanel
            room={room}
            playerId={playerId}
            onRoll={handleRollDice}
            onMoveToken={handleMoveToken}
            chat={room?.chat}
            message={chatMessage}
            onMessageChange={setChatMessage}
            onSend={handleSendChat}
          />
        ) : (
          <Stack spacing={3}>
            {room && (
              <Lobby
                roomCode={roomCode}
                playerId={playerId}
                room={room}
                onReadyToggle={handleReadyToggle}
                onStart={handleStartGame}
              />
            )}

            {room && (
              <ChatBox
                chat={room.chat}
                message={chatMessage}
                onMessageChange={setChatMessage}
                onSend={handleSendChat}
              />
            )}
          </Stack>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
