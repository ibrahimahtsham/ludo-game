import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { HOME, TRACK_LENGTH } from "../constants/game";

const GRID_SIZE = 15;

// Hardcoded path geometry: outer loop (52 cells) + 6-cell home lanes per color.
const trackCoords = [
  // left edge, left to right
  { r: 6, c: 0 },
  { r: 6, c: 1 },
  { r: 6, c: 2 },
  { r: 6, c: 3 },
  { r: 6, c: 4 },
  { r: 6, c: 5 },

  // top edge, bottom to top
  { r: 5, c: 6 },
  { r: 4, c: 6 },
  { r: 3, c: 6 },
  { r: 2, c: 6 },
  { r: 1, c: 6 },
  { r: 0, c: 6 },

  // top middle
  { r: 0, c: 7 },

  // top edge, top to bottom
  { r: 0, c: 8 },
  { r: 1, c: 8 },
  { r: 2, c: 8 },
  { r: 3, c: 8 },
  { r: 4, c: 8 },
  { r: 5, c: 8 },

  // right edge, left to right
  { r: 6, c: 9 },
  { r: 6, c: 10 },
  { r: 6, c: 11 },
  { r: 6, c: 12 },
  { r: 6, c: 13 },
  { r: 6, c: 14 },

  // right edge, middle
  { r: 7, c: 14 },

  // right edge, right to left
  { r: 8, c: 14 },
  { r: 8, c: 13 },
  { r: 8, c: 12 },
  { r: 8, c: 11 },
  { r: 8, c: 10 },
  { r: 8, c: 9 },

  // bottom edge, top to bottom
  { r: 9, c: 8 },
  { r: 10, c: 8 },
  { r: 11, c: 8 },
  { r: 12, c: 8 },
  { r: 13, c: 8 },
  { r: 14, c: 8 },

  // bottom middle
  { r: 14, c: 7 },

  // bottom edge, bottom to top
  { r: 14, c: 6 },
  { r: 13, c: 6 },
  { r: 12, c: 6 },
  { r: 11, c: 6 },
  { r: 10, c: 6 },
  { r: 9, c: 6 },

  // left edge, right to left
  { r: 8, c: 5 },
  { r: 8, c: 4 },
  { r: 8, c: 3 },
  { r: 8, c: 2 },
  { r: 8, c: 1 },
  { r: 8, c: 0 },

  // left edge, middle
  { r: 7, c: 0 },
];

const trackKeys = new Set(trackCoords.map((p) => `${p.r}-${p.c}`));

const homeLanes = {
  p1: [
    { r: 7, c: 5 },
    { r: 7, c: 4 },
    { r: 7, c: 3 },
    { r: 7, c: 2 },
    { r: 7, c: 1 },
  ],
  p2: [
    { r: 5, c: 7 },
    { r: 4, c: 7 },
    { r: 3, c: 7 },
    { r: 2, c: 7 },
    { r: 1, c: 7 },
  ],
  p3: [
    { r: 7, c: 9 },
    { r: 7, c: 10 },
    { r: 7, c: 11 },
    { r: 7, c: 12 },
    { r: 7, c: 13 },
  ],
  p4: [
    { r: 9, c: 7 },
    { r: 10, c: 7 },
    { r: 11, c: 7 },
    { r: 12, c: 7 },
    { r: 13, c: 7 },
  ],
};

const laneOwnerByKey = Object.entries(homeLanes).reduce(
  (acc, [pid, coords]) => {
    coords.forEach((pos) => {
      acc[`${pos.r}-${pos.c}`] = pid;
    });
    return acc;
  },
  {}
);

// Final home cells (one per color)
const centerHomes = {
  p1: { r: 7, c: 6 }, // left of center
  p2: { r: 6, c: 7 }, // above center
  p3: { r: 7, c: 8 }, // right of center
  p4: { r: 8, c: 7 }, // below center
};
const centerHomeByKey = Object.entries(centerHomes).reduce(
  (acc, [pid, pos]) => {
    acc[`${pos.r}-${pos.c}`] = pid;
    return acc;
  },
  {}
);

// Start cells (one per color) on the loop
const starts = {
  p1: { r: 6, c: 1 }, // left entry
  p2: { r: 1, c: 8 }, // top entry
  p3: { r: 8, c: 13 }, // right entry
  p4: { r: 13, c: 6 }, // bottom entry
};

const startByKey = Object.entries(starts).reduce((acc, [pid, pos]) => {
  acc[`${pos.r}-${pos.c}`] = pid;
  return acc;
}, {});

const startIndexByPlayer = Object.fromEntries(
  Object.entries(starts).map(([pid, pos]) => {
    const idx = trackCoords.findIndex((p) => p.r === pos.r && p.c === pos.c);
    return [pid, idx >= 0 ? idx : 0];
  })
);

// Garage blocks (token take-out areas), 2x2 per player
const garages = {
  p1: [
    { r: 2, c: 2 },
    { r: 2, c: 3 },
    { r: 3, c: 2 },
    { r: 3, c: 3 },
  ],
  p2: [
    { r: 2, c: 11 },
    { r: 2, c: 12 },
    { r: 3, c: 11 },
    { r: 3, c: 12 },
  ],
  p3: [
    { r: 11, c: 11 },
    { r: 11, c: 12 },
    { r: 12, c: 11 },
    { r: 12, c: 12 },
  ],
  p4: [
    { r: 11, c: 2 },
    { r: 11, c: 3 },
    { r: 12, c: 2 },
    { r: 12, c: 3 },
  ],
};
const garageOwnerByKey = Object.entries(garages).reduce(
  (acc, [pid, coords]) => {
    coords.forEach((pos) => {
      acc[`${pos.r}-${pos.c}`] = pid;
    });
    return acc;
  },
  {}
);

// Garage framing cells (explicit per cell)
const garageFrames = {
  p1: [
    // top left corner
    { r: 0, c: 0 },

    // top edge
    { r: 0, c: 1 },
    { r: 0, c: 2 },
    { r: 0, c: 3 },
    { r: 0, c: 4 },

    // top right corner
    { r: 0, c: 5 },

    // right edge
    { r: 1, c: 5 },
    { r: 2, c: 5 },
    { r: 3, c: 5 },
    { r: 4, c: 5 },

    // bottom right corner
    { r: 5, c: 5 },

    // bottom edge
    { r: 5, c: 4 },
    { r: 5, c: 3 },
    { r: 5, c: 2 },
    { r: 5, c: 1 },

    // bottom left corner
    { r: 5, c: 0 },

    // left edge
    { r: 4, c: 0 },
    { r: 3, c: 0 },
    { r: 2, c: 0 },
    { r: 1, c: 0 },
  ],
  p2: [
    { r: 0, c: 9 },

    // top edge
    { r: 0, c: 10 },
    { r: 0, c: 11 },
    { r: 0, c: 12 },
    { r: 0, c: 13 },

    // top right corner
    { r: 0, c: 14 },

    // right edge
    { r: 1, c: 14 },
    { r: 2, c: 14 },
    { r: 3, c: 14 },
    { r: 4, c: 14 },

    // bottom right corner
    { r: 5, c: 14 },

    // bottom edge
    { r: 5, c: 13 },
    { r: 5, c: 12 },
    { r: 5, c: 11 },
    { r: 5, c: 10 },

    // bottom left corner
    { r: 5, c: 9 },

    // left edge
    { r: 4, c: 9 },
    { r: 3, c: 9 },
    { r: 2, c: 9 },
    { r: 1, c: 9 },
  ],
  p3: [
    // top left corner
    { r: 9, c: 9 },

    // top edge
    { r: 9, c: 10 },
    { r: 9, c: 11 },
    { r: 9, c: 12 },
    { r: 9, c: 13 },

    // top right corner
    { r: 9, c: 14 },

    // right edge
    { r: 10, c: 14 },
    { r: 11, c: 14 },
    { r: 12, c: 14 },
    { r: 13, c: 14 },

    // bottom right corner
    { r: 14, c: 14 },

    // bottom edge
    { r: 14, c: 13 },
    { r: 14, c: 12 },
    { r: 14, c: 11 },
    { r: 14, c: 10 },

    // bottom left corner
    { r: 14, c: 9 },

    // left edge
    { r: 13, c: 9 },
    { r: 12, c: 9 },
    { r: 11, c: 9 },
    { r: 10, c: 9 },
  ],
  p4: [
    { r: 9, c: 0 },

    // top edge
    { r: 9, c: 1 },
    { r: 9, c: 2 },
    { r: 9, c: 3 },
    { r: 9, c: 4 },

    // top right corner
    { r: 9, c: 5 },

    // right edge
    { r: 10, c: 5 },
    { r: 11, c: 5 },
    { r: 12, c: 5 },
    { r: 13, c: 5 },

    // bottom right corner
    { r: 14, c: 5 },

    // bottom edge
    { r: 14, c: 4 },
    { r: 14, c: 3 },
    { r: 14, c: 2 },
    { r: 14, c: 1 },

    // bottom left corner
    { r: 14, c: 0 },

    // left edge
    { r: 13, c: 0 },
    { r: 12, c: 0 },
    { r: 11, c: 0 },
    { r: 10, c: 0 },
  ],
};

const frameOwnerByKey = Object.entries(garageFrames).reduce(
  (acc, [pid, coords]) => {
    coords.forEach((pos) => {
      acc[`${pos.r}-${pos.c}`] = pid;
    });
    return acc;
  },
  {}
);

const colors = {
  p1: "#e53935",
  p2: "#1e88e5",
  p3: "#43a047",
  p4: "#fbc02d",
};
const tokenSlots = [
  { top: "8%", left: "8%" },
  { top: "8%", right: "8%" },
  { bottom: "8%", left: "8%" },
  { bottom: "8%", right: "8%" },
];

const posToCoord = (pid, pos, tokenIndex) => {
  if (pos === HOME) {
    const garageCells = garages[pid];
    return garageCells ? garageCells[tokenIndex % garageCells.length] : null;
  }

  if (pos >= 0 && pos < TRACK_LENGTH) {
    const startOffset = startIndexByPlayer[pid] || 0;
    const idx = (startOffset + pos) % TRACK_LENGTH;
    return trackCoords[idx];
  }

  if (pos >= TRACK_LENGTH) {
    const laneIdx = pos - TRACK_LENGTH;
    const lane = homeLanes[pid] || [];
    if (laneIdx < lane.length) return lane[laneIdx];
    if (laneIdx === lane.length) return centerHomes[pid];
  }

  return null;
};

function Board({ board, playerId, onTokenClick }) {
  const tokensByCell = {};

  Object.entries(board?.tokens || {}).forEach(([pid, tokenPositions]) => {
    tokenPositions.forEach((pos, idx) => {
      const coord = posToCoord(pid, pos, idx);
      if (!coord) return;
      const key = `${coord.r}-${coord.c}`;
      if (!tokensByCell[key]) tokensByCell[key] = [];
      tokensByCell[key].push({ pid, tokenIndex: idx });
    });
  });

  const renderCell = (r, c) => {
    const key = `${r}-${c}`;
    const isTrack = trackKeys.has(key);
    const laneOwner = laneOwnerByKey[key];
    const centerOwner = centerHomeByKey[key];
    const startOwner = startByKey[key];
    const garageOwner = garageOwnerByKey[key];
    const frameOwner = frameOwnerByKey[key];

    const color = isTrack
      ? "rgba(255,255,255,0.12)"
      : laneOwner
      ? `${colors[laneOwner]}55`
      : centerOwner
      ? `${colors[centerOwner]}aa`
      : frameOwner
      ? `${colors[frameOwner]}aa`
      : garageOwner
      ? "transparent"
      : "transparent";

    const border = startOwner
      ? `2px solid ${colors[startOwner]}`
      : garageOwner
      ? `2px solid ${colors[garageOwner]}`
      : frameOwner
      ? `2px solid ${colors[frameOwner]}`
      : isTrack || laneOwner || centerOwner
      ? "1px solid rgba(255,255,255,0.25)"
      : "1px solid rgba(255,255,255,0.08)";

    const tokens = tokensByCell[key] || [];
    const showCountOnly = tokens.length > tokenSlots.length;

    return (
      <Paper
        key={key}
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          bgcolor: color,
          border,
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}
        >
          {showCountOnly ? (
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "white",
              }}
            >
              {tokens.length}
            </Typography>
          ) : (
            tokens.map((t, idx) => {
              const slot = tokenSlots[idx];
              const clickable =
                t.pid === playerId && typeof onTokenClick === "function";
              return (
                <Box
                  key={`${t.pid}-${t.tokenIndex}`}
                  onClick={
                    clickable
                      ? (e) => {
                          e.stopPropagation();
                          onTokenClick(t.tokenIndex);
                        }
                      : undefined
                  }
                  sx={{
                    position: "absolute",
                    width: "44%",
                    height: "44%",
                    borderRadius: "50%",
                    bgcolor: colors[t.pid] || "white",
                    border: "2px solid rgba(0,0,0,0.4)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
                    cursor: clickable ? "pointer" : "default",
                    ...slot,
                  }}
                />
              );
            })
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          mx: "auto",
          aspectRatio: "1 / 1",
          minWidth: 700,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 1,
          p: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gap: 0.25,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const r = Math.floor(idx / GRID_SIZE);
          const c = idx % GRID_SIZE;
          return renderCell(r, c);
        })}
      </Box>
    </Stack>
  );
}

export default Board;
