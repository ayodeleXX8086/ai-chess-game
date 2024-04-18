const BOARD_SIZE = 8;

export type Position = {
  row: number;
  col: number;
};

enum SquareID {
  BLACK = "black",
  WHITE = "white",
  EMPTY = "empty",
}

const positionEquality = (position1: Position, position2: Position) => {
  return position1.col === position2.col && position2.row === position2.row;
};

const OnBoard = (pos: Position): boolean => {
  return (
    pos.row >= 0 && pos.col < BOARD_SIZE && pos.row >= 0 && pos.col < BOARD_SIZE
  );
};

export { SquareID, positionEquality, OnBoard };
