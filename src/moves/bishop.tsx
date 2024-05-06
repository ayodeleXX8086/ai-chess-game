import { BishopComponent } from "@/components/pieces/index";
import { Position, SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";
import { Piece, PieceProps } from "./piece"; // Assuming you have a Piece class defined elsewhere

export class Bishop extends Piece {
  constructor(props: PieceProps) {
    super(props);
    this.code = PieceType.BISHOP;
    this.component = BishopComponent;
    this.value = this.value * 30;
  }

  getMoves(board: any): [Position[], Position[]] {
    const [moves, captures] = this.diagonalMoves(board);
    return [moves, captures];
  }

  diagonalMoves(board: any): [any[], any[]] {
    const patterns = [
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ];
    const [moves, captures] = this.getPatternMoves(board, patterns);
    return [moves, captures];
  }
}
