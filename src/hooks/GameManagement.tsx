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

const initializeBoard = (
  computerPlayerID: SquareID
): [Grid, Piece[], Piece[], Piece | null, Piece | null] => {
  const grid: Grid = Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(null)
  );

  const whitePromotions: Piece[] = [];
  const blackPromotions: Piece[] = [];

  let index = 0;
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

      const currPiece = initializeGridPiece(
        pieceType as PieceType,
        pieceProps,
        squareId,
        blackPromotions,
        whitePromotions
      );

      grid[i][j] = currPiece;
      index++;
    });
  });

  const whiteKing =
    whitePromotions.find((piece) => piece instanceof King) || null;
  const blackKing =
    blackPromotions.find((piece) => piece instanceof King) || null;

  return [grid, whitePromotions, blackPromotions, whiteKing, blackKing];
};

const initializeGridPiece = (
  pieceType: PieceType,
  pieceProps: PieceProps,
  squareId: SquareID,
  blackPiecePromotions: Piece[],
  whitePiecePromotions: Piece[]
) => {
  const currPiece: Piece = createPiece(pieceProps, pieceType);

  if (pieceType !== PieceType.EMPTY && pieceType !== PieceType.PAWN) {
    if (squareId === SquareID.BLACK) {
      blackPiecePromotions.push(currPiece);
    } else {
      whitePiecePromotions.push(currPiece);
    }
  }

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
  currPlayer: SquareID.BLACK | SquareID.WHITE
) => {
  const computerPlayerID =
    currPlayer === SquareID.BLACK ? SquareID.WHITE : SquareID.BLACK;
  const [grid, whitePromotions, blackPromotions, whiteKing, blackKing] =
    initializeBoard(computerPlayerID);
  const props = {
    whitePromotions,
    blackPromotions,
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
  } as BoardProps;
  const board = new Board(props);

  return board;
};
