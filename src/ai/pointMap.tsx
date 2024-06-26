import { Piece } from "@/moves/piece";
import { SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";

type MapPointType = {
  [key: string]: number[][];
};
const MapPoints: MapPointType = {
  [PieceType.PAWN]: [
    [0.0, 5.0, 1.0, 0.5, 0.0, 0.5, 0.5, 0.0],
    [0.0, 5.0, 1.0, 0.5, 0.0, -0.5, 1.0, 0.0],
    [0.0, 5.0, 2.0, 1.0, 0.0, -1.0, 1.0, 0.0],
    [0.0, 5.0, 3.0, 2.5, 2.0, 0.0, -2.0, 0.0],
    [0.0, 5.0, 3.0, 2.5, 2.0, 0.0, -2.0, 0.0],
    [0.0, 5.0, 2.0, 1.0, 0.0, -1.0, 1.0, 0.0],
    [0.0, 5.0, 1.0, 0.5, 0.0, -0.5, 1.0, 0.0],
    [0.0, 5.0, 1.0, 0.5, 0.0, 0.5, 0.5, 0.0],
  ],
  [PieceType.BISHOP]: [
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.5, 0.0, 1.0, 0.5, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 0.0, 0.0, 0.5, 0.0, 1.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  ],
  [PieceType.KNIGHT]: [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0, 0.0, 0.5, 0.0, 0.5, -2.0, -4.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
    [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
    [-4.0, -2.0, 0.0, 0.5, 0.0, 0.5, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  ],
  [PieceType.ROOK]: [
    [0.0, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.0],
    [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5],
    [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5],
    [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.0, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.0],
  ],
  [PieceType.QUEEN]: [
    [-2.0, -1.0, -1.0, -0.5, 0.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.5, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  ],
  [PieceType.KING]: [
    [-3.0, -3.0, -3.0, -3.0, -2.0, -1.0, 2.0, 2.0],
    [-4.0, -4.0, -4.0, -4.0, -3.0, -2.0, 2.0, 3.0],
    [-4.0, -4.0, -4.0, -4.0, -3.0, -2.0, 0.0, 1.0],
    [-5.0, -5.0, -5.0, -5.0, -4.0, -2.0, 0.0, 0.0],
    [-5.0, -5.0, -5.0, -5.0, -4.0, -2.0, 0.0, 0.0],
    [-4.0, -4.0, -4.0, -4.0, -3.0, -2.0, 0.0, 1.0],
    [-4.0, -4.0, -4.0, -4.0, -3.0, -2.0, 2.0, 3.0],
    [-3.0, -3.0, -3.0, -3.0, -2.0, -1.0, 2.0, 2.0],
  ],
};

const flip = (piece_map: number[][]) => {
  return piece_map
    .slice()
    .reverse()
    .map((row) => {
      return row.slice().reverse();
    });
};

export const PieceMap = (piece: Piece, computerID: SquareID): number[][] => {
  //console.log("Piece code", piece.code);
  const piece_map = MapPoints[piece.code];
  if (!piece_map) {
    console.log("Causing a crash ", piece.code, piece.color, piece.pieceId);
  }
  return piece.color !== computerID ? piece_map : flip(piece_map);
};
