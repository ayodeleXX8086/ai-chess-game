import { Bishop } from "./bishop";
import { Rook } from "./rook";
import { Piece, PieceProps } from "./piece";
import { Board } from "@/board/index";
import { Position, SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";
import { QueenComponent } from "@/components/pieces/index";

export class Queen extends Piece {
  private rook: Rook;
  private bishop: Bishop;

  constructor(props: PieceProps) {
    super(props);
    this.code = PieceType.QUEEN;
    this.component = QueenComponent;
    this.value = this.value * 90;
    this.rook = new Rook(props);
    this.bishop = new Bishop(props);
  }

  getMoves(board: Board): [Position[], Position[]] {
    const [diagonalMoves, diagonalCaptures] = this.bishop.getMoves(board);
    const [rMoves, rCaptures] = this.rook.getMoves(board);
    const moves = diagonalMoves.concat(rMoves);
    const captures = diagonalCaptures.concat(rCaptures);

    return [moves, captures];
  }
}
