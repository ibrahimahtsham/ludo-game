export const HOME = -1;
export const TRACK_LENGTH = 52; // shared loop steps 0-51
export const HOME_LANE_LENGTH = 6; // steps 52-57 lead to center
export const FINISH = TRACK_LENGTH + HOME_LANE_LENGTH - 1; // 57
export const BOARD_SIZE = 15;

// track start offsets for each player on the shared loop
export const startIndices = {
  p1: 0,
  p2: 13,
  p3: 26,
  p4: 39,
};

// common safe squares along the loop (including all starts)
export const safeIndices = [0, 8, 13, 21, 26, 34, 39, 47];

// home lane coordinates for each player (steps 52-57 map here, last cell is center)
export const homeLanes = {
  // p1 (left) toward center
  p1: [
    { r: 7, c: 6 },
    { r: 7, c: 5 },
    { r: 7, c: 4 },
    { r: 7, c: 3 },
    { r: 7, c: 2 },
    { r: 7, c: 7 },
  ],
  // p2 (top) toward center
  p2: [
    { r: 6, c: 7 },
    { r: 5, c: 7 },
    { r: 4, c: 7 },
    { r: 3, c: 7 },
    { r: 2, c: 7 },
    { r: 7, c: 7 },
  ],
  // p3 (right) toward center
  p3: [
    { r: 7, c: 8 },
    { r: 7, c: 9 },
    { r: 7, c: 10 },
    { r: 7, c: 11 },
    { r: 7, c: 12 },
    { r: 7, c: 7 },
  ],
  // p4 (bottom) toward center
  p4: [
    { r: 8, c: 7 },
    { r: 9, c: 7 },
    { r: 10, c: 7 },
    { r: 11, c: 7 },
    { r: 12, c: 7 },
    { r: 7, c: 7 },
  ],
};

// Symmetric 52-step loop (clockwise), starting at left edge row 6
export const trackCoords = [
  { r: 6, c: 0 },
  { r: 6, c: 1 },
  { r: 6, c: 2 },
  { r: 6, c: 3 },
  { r: 6, c: 4 },
  { r: 5, c: 4 },
  { r: 4, c: 4 },
  { r: 3, c: 4 },
  { r: 2, c: 4 },
  { r: 1, c: 4 },
  { r: 1, c: 5 },
  { r: 1, c: 6 },
  { r: 1, c: 7 },
  { r: 1, c: 8 },
  { r: 1, c: 9 },
  { r: 1, c: 10 },
  { r: 2, c: 10 },
  { r: 3, c: 10 },
  { r: 4, c: 10 },
  { r: 5, c: 10 },
  { r: 6, c: 10 },
  { r: 6, c: 11 },
  { r: 6, c: 12 },
  { r: 6, c: 13 },
  { r: 6, c: 14 },
  { r: 7, c: 14 },
  { r: 8, c: 14 },
  { r: 8, c: 13 },
  { r: 8, c: 12 },
  { r: 8, c: 11 },
  { r: 8, c: 10 },
  { r: 9, c: 10 },
  { r: 10, c: 10 },
  { r: 11, c: 10 },
  { r: 12, c: 10 },
  { r: 13, c: 10 },
  { r: 13, c: 9 },
  { r: 13, c: 8 },
  { r: 13, c: 7 },
  { r: 13, c: 6 },
  { r: 13, c: 5 },
  { r: 12, c: 5 },
  { r: 11, c: 5 },
  { r: 10, c: 5 },
  { r: 9, c: 5 },
  { r: 8, c: 5 },
  { r: 8, c: 4 },
  { r: 8, c: 3 },
  { r: 8, c: 2 },
  { r: 8, c: 1 },
  { r: 8, c: 0 },
  { r: 7, c: 0 },
];
