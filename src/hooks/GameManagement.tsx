import { createRef, RefObject, useEffect, useRef, useState } from "react";
import {
  Bishop,
  createPiece,
  King,
  Knight,
  Pawn,
  Piece,
  Queen,
  Rook,
} from "@/moves/index";
import { v4 as uuidv4 } from "uuid";
import { BoardProps, Grid, GridItem, PieceProps } from "@/moves/piece";
import { GRID, PieceType } from "@/utils/utilites";
import { Position, SquareID, SquareIDMapping } from "@/utils/interfaces";
import { Board } from "@/board/index";
import { Empty } from "@/moves/empty";

const BOARD_SIZE = 8;

export const initializeBoard = (
  computerPlayerID: SquareID
): [Grid, Piece | null, Piece | null] => {
  const grid: Grid = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );

  let whiteKing = null;
  let blackKing = null;
  GRID.forEach((row, i) => {
    row.forEach((pieceInfo, j) => {
      const [pieceType, playerType] = pieceInfo.split(",");
      const squareId = SquareIDMapping[playerType.toLowerCase()];
      const position: Position = { row: i, col: j } as Position;
      const pieceId = uuidv4();
      const pieceProps: PieceProps = {
        position,
        color: squareId,
        pieceId,
        computerColor: computerPlayerID,
      };

      const currPiece = initializeGridPiece(pieceType as PieceType, pieceProps);

      if (
        currPiece.code === PieceType.KING &&
        currPiece.color === SquareID.BLACK
      ) {
        blackKing = currPiece;
      } else if (
        currPiece.code === PieceType.KING &&
        currPiece.color === SquareID.WHITE
      ) {
        whiteKing = currPiece;
      }

      grid[i][j] = currPiece;
    });
  });

  return [grid, whiteKing, blackKing];
};

const initializeGridPiece = (pieceType: PieceType, pieceProps: PieceProps) => {
  const currPiece: Piece = createPiece(pieceProps, pieceType);
  return currPiece;
};

export const useGridInitializationDomRef = () => {
  const matrix: RefObject<HTMLDivElement>[][] = [];

  for (let i = 0; i < 8; i++) {
    const row: RefObject<HTMLDivElement>[] = [];
    for (let j = 0; j < 8; j++) {
      const ref = createRef<HTMLDivElement>();
      row.push(ref);
    }
    matrix.push(row);
  }

  return matrix;
};

export const useGameBoardManagement = (
  currPlayer: SquareID.BLACK | SquareID.WHITE,
  gridDomRefs: React.RefObject<HTMLDivElement>[][]
): [
  Board,
  (updatedBoard: Board, prevPosition: Position, currPosition: Position) => void
] => {
  const computerPlayerID =
    currPlayer === SquareID.BLACK ? SquareID.WHITE : SquareID.BLACK;
  const [grid, whiteKing, blackKing] = initializeBoard(computerPlayerID);
  const props = {
    grid,
    whiteKing,
    blackKing,
    currPlayer,
    computerPlayerID:
      currPlayer === SquareID.BLACK ? SquareID.WHITE : SquareID.BLACK,
    winner: null,
    checkWhiteKing: false,
    checkBlackKing: false,
    pieceToPromote: null,
    history: [],
  } as BoardProps;
  const [board, setBoard] = useState<Board>(new Board(props));

  const updateBoard = (
    updatedBoard: Board,
    prevPosition: Position,
    currPosition: Position
  ) => {
    // Update the DOM reference for the moved piece
    const prevRef = gridDomRefs[prevPosition.row][prevPosition.col];
    const currRef = gridDomRefs[currPosition.row][currPosition.col];
    gridDomRefs[prevPosition.row][prevPosition.col] = currRef;
    gridDomRefs[currPosition.row][currPosition.col] = prevRef;
    setBoard(updatedBoard);
  };

  return [board, updateBoard];
};
