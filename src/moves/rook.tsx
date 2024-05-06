import { RookComponent } from "@/components/pieces/index";
import { PieceType } from "@/utils/utilites";
import { Piece, PieceProps } from "./piece";

export class Rook extends Piece {
  constructor(props: PieceProps) {
    super(props);
    this.code = PieceType.ROOK;
    this.component = RookComponent;
    this.value = this.value * 50;
  }

  getMoves(board: any) {
    return this.vertHorzMoves(board);
  }

  vertHorzMoves(board: any) {
    const patterns = [
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ];
    const result = this.getPatternMoves(board, patterns);
    return result;
  }
}
