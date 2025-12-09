import { db } from "../firebase";
import { child, get, onValue, push, ref, set, update } from "firebase/database";
import { FINISH } from "../constants/game";

const roomsRoot = ref(db, "rooms");

const generateRoomCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const seats = ["p1", "p2", "p3", "p4"];
export const seatOrder = seats;

export const createRoom = async (username) => {
  if (!username) throw new Error("Username is required");

  let code = generateRoomCode();
  let attempts = 0;

  while (attempts < 5) {
    const roomRef = child(roomsRoot, code);
    const snap = await get(roomRef);
    if (!snap.exists()) {
      await set(roomRef, {
        code,
        status: "lobby",
        createdAt: Date.now(),
        players: {
          p1: { username, joinedAt: Date.now(), ready: false },
        },
        chat: {},
        game: {
          currentTurn: "p1",
          lastRoll: null,
        },
      });
      return { code, playerId: "p1" };
    }
    attempts += 1;
    code = generateRoomCode();
  }

  throw new Error("Could not generate a room. Please try again.");
};

export const joinRoom = async (code, username) => {
  if (!code) throw new Error("Room code is required");
  if (!username) throw new Error("Username is required");

  const roomRef = child(roomsRoot, code);
  const snap = await get(roomRef);
  if (!snap.exists()) throw new Error("Room not found");

  const data = snap.val();
  if (data.status === "active") throw new Error("Game already started");

  const occupied = Object.keys(data.players || {});
  const slot = seats.find((s) => !occupied.includes(s));
  if (!slot) throw new Error("Room full (max 4 players)");

  await update(roomRef, {
    [`players/${slot}`]: { username, joinedAt: Date.now(), ready: false },
  });

  return { code, playerId: slot };
};

export const listenToRoom = (code, callback) => {
  const roomRef = child(roomsRoot, code);
  const unsubscribe = onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
};

export const sendChatMessage = async (code, message) => {
  const chatRef = child(roomsRoot, `${code}/chat`);
  await push(chatRef, { ...message, at: Date.now() });
};

export const startGame = async (code) => {
  const roomRef = child(roomsRoot, code);
  const snap = await get(roomRef);
  const data = snap.val();
  const players = data?.players || {};
  const tokens = Object.keys(players).reduce((acc, pid) => {
    acc[pid] = [-1, -1, -1, -1];
    return acc;
  }, {});

  const first = seatOrder.find((s) => players[s]);

  await update(roomRef, {
    status: "active",
    "game/startedAt": Date.now(),
    "game/currentTurn": first || "p1",
    "game/board": {
      tokens,
    },
    "game/winner": null,
    "game/lastRoll": null,
  });
};

export const setReady = async (code, playerId, ready) => {
  const roomRef = child(roomsRoot, code);
  await update(roomRef, {
    [`players/${playerId}/ready`]: ready,
  });
};

export const rollDice = async (code, value, nextTurn) => {
  const roomRef = child(roomsRoot, code);
  const payload = { "game/lastRoll": value };
  if (nextTurn) payload["game/currentTurn"] = nextTurn;
  await update(roomRef, payload);
};

export const moveToken = async (
  code,
  playerId,
  tokenIndex,
  newPos,
  nextTurn,
  winner
) => {
  const roomRef = child(roomsRoot, code);
  const updates = {
    [`game/board/tokens/${playerId}/${tokenIndex}`]: newPos,
    "game/lastRoll": null,
  };
  if (nextTurn) updates["game/currentTurn"] = nextTurn;
  if (winner) updates["game/winner"] = winner;
  await update(roomRef, updates);
};
