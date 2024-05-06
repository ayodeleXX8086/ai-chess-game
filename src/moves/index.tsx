import { Pawn } from "./pawn";
import { Knight } from "./knight";
import { Bishop } from "./bishop";
import { Piece, PieceProps } from "./piece";
import { Queen } from "./queen";
import { Rook } from "./rook";
import { King } from "./king";
import { Empty } from "./empty";
import { PieceType } from "@/utils/utilites";

const createPiece = (pieceProps: PieceProps, pieceType: PieceType) => {
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
  return currPiece;
};
export { Pawn, Knight, Bishop, Piece, Queen, Rook, King, Empty, createPiece };
