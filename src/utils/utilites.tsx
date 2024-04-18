const BLACK_ROOK = "ROOK,black";
const BLACK_KNIGHT = "KNIGHT,black";
const BLACK_BISHOP = "BISHOP,black";
const BLACK_QUEEN = "QUEEN,black";
const BLACK_KING = "KING,black";
const BLACK_PAWN = "PAWN,black";
const WHITE_ROOK = "ROOK,white";
const WHITE_KNIGHT = "KNIGHT,white";
const WHITE_BISHOP = "BISHOP,white";
const WHITE_QUEEN = "QUEEN,white";
const WHITE_KING = "KING,white";
const WHITE_PAWN = "PAWN,white";
const EMPTY_SQUARE = "EMPTY,empty";

const WHITE_ROW: string[] = [
  WHITE_ROOK,
  WHITE_KNIGHT,
  WHITE_BISHOP,
  WHITE_QUEEN,
  WHITE_KING,
  WHITE_BISHOP,
  WHITE_KNIGHT,
  WHITE_ROOK,
];

const BLACK_ROW: string[] = [
  BLACK_ROOK,
  BLACK_KNIGHT,
  BLACK_BISHOP,
  BLACK_QUEEN,
  BLACK_KING,
  BLACK_BISHOP,
  BLACK_KNIGHT,
  BLACK_ROOK,
];

const WHITE_PAWN_ROW: string[] = Array(8).fill(WHITE_PAWN);
const BLACK_PAWN_ROW: string[] = Array(8).fill(BLACK_PAWN);
const EMPTY_ROW: string[] = Array(8).fill(EMPTY_SQUARE);

const GRID: string[][] = [
  WHITE_ROW,
  WHITE_PAWN_ROW,
  EMPTY_ROW,
  EMPTY_ROW,
  EMPTY_ROW,
  EMPTY_ROW,
  BLACK_PAWN_ROW,
  BLACK_ROW,
];

export {
  GRID,
  BLACK_ROOK,
  BLACK_KNIGHT,
  BLACK_BISHOP,
  BLACK_QUEEN,
  BLACK_KING,
  BLACK_PAWN,
  WHITE_ROOK,
  WHITE_KNIGHT,
  WHITE_BISHOP,
  WHITE_QUEEN,
  WHITE_KING,
  WHITE_PAWN,
  EMPTY_SQUARE,
};
