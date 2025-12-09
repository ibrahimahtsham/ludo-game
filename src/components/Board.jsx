import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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

const colors = {
  p1: "#e53935",
  p2: "#1e88e5",
  p3: "#43a047",
  p4: "#fbc02d",
};

function Board() {
  const renderCell = (r, c) => {
    const key = `${r}-${c}`;
    const isTrack = trackKeys.has(key);
    const laneOwner = laneOwnerByKey[key];
    const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

    const color = isTrack
      ? "rgba(255,255,255,0.12)"
      : laneOwner
      ? `${colors[laneOwner]}55`
      : isCenter
      ? "rgba(255,255,255,0.16)"
      : "transparent";

    const border =
      isTrack || laneOwner || isCenter
        ? "1px solid rgba(255,255,255,0.25)"
        : "1px solid rgba(255,255,255,0.08)";

    return (
      <Paper
        key={key}
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          bgcolor: color,
          border,
        }}
      />
    );
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Board (path only)</Typography>
      <Box
        sx={{
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
