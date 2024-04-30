import { useEffect, useRef, useState } from "react";
import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from "@/moves/index";
import { BoardProps, Grid, GridItem, PieceProps } from "@/moves/piece";
import { GRID, PieceType } from "@/utils/utilites";
import { Position, SquareID, SquareIDMapping } from "@/utils/interfaces";
import { Board } from "@/board/index";
import { EmptyPiece } from "@/components/pieces/index";
import { Empty } from "@/moves/empty";

const BOARD_SIZE = 8;

const initializeBoard = (): [
  Grid,
  Piece[],
  Piece[],
  Piece | null,
  Piece | null
] => {
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
      const pieceProps: PieceProps = {
        position,
        color: squareId,
        squareRef: useRef<HTMLDivElement>(null),
        pieceId: index,
      };

      const currPiece = createPiece(
        pieceType,
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

const createPiece = (
  pieceType: string,
  pieceProps: PieceProps,
  squareId: SquareID,
  blackPiecePromotions: Piece[],
  whitePiecePromotions: Piece[]
) => {
  let currPiece: Piece;
  switch (pieceType) {
    case PieceType.KING:
      currPiece = new King(pieceProps);
      break;
    case PieceType.QUEEN:
      currPiece = new Queen(pieceProps);
      break;
    case PieceType.ROOK:
      currPiece = new Rook(pieceProps);
      break;
    case PieceType.KNIGHT:
      currPiece = new Knight(pieceProps);
      break;
    case PieceType.PAWN:
      currPiece = new Pawn(pieceProps);
      break;
    case PieceType.BISHOP:
      currPiece = new Bishop(pieceProps);
      break;
    default:
      currPiece = new Empty(pieceProps);
      break;
  }

  if (pieceType !== PieceType.EMPTY && pieceType !== PieceType.PAWN) {
    if (squareId === SquareID.BLACK) {
      blackPiecePromotions.push(currPiece);
    } else {
      whitePiecePromotions.push(currPiece);
    }
  }

  return currPiece;
};

export const useGameBoardManagement = (
  currPlayer: SquareID.BLACK | SquareID.WHITE
) => {
  const [grid, whitePromotions, blackPromotions, whiteKing, blackKing] =
    initializeBoard();

  const [winner, setWinner] = useState<SquareID | null>(null);
  const [checkWhiteKing, setCheckWhiteKing] = useState<boolean>(false);
  const [checkBlackKing, setCheckBlackKing] = useState<boolean>(false);
  const [pieceToPromote, setPieceToPromote] = useState<Piece | null>(null);
  const props = {
    whitePromotions,
    blackPromotions,
    grid,
    whiteKing,
    blackKing,
    currPlayer,
    winner,
    setWinner,
    checkWhiteKing,
    setCheckWhiteKing,
    checkBlackKing,
    setCheckBlackKing,
    pieceToPromote,
    setPieceToPromote,
  } as BoardProps;
  const board = new Board(props);

  return board;
};
