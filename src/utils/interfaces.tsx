import { RefObject } from "react";
import { PieceType } from "./utilites";

export interface Position {
  row: number;
  col: number;
}

export interface PieceHistory {
  piece_id: number;
  piece_color: SquareID;
  piece_code: PieceType;
  position: Position;
}

enum ColorID {
  WHITE = "white",
  BLACK = "black",
}

enum SquareID {
  BLACK = "BLACK",
  WHITE = "WHITE",
  EMPTY = "EMPTY",
}
type SquareIDMappingType = {
  [key: string]: SquareID;
};
const SquareIDMapping: SquareIDMappingType = {
  black: SquareID.BLACK,
  white: SquareID.WHITE,
  empty: SquareID.EMPTY,
};

export { SquareID, ColorID, SquareIDMapping };
