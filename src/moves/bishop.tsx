import { Piece } from "./piece"; // Assuming you have a Piece class defined elsewhere

class Bishop extends Piece {
  code: string;
  value: number;
  sprite: any; // You can specify a more specific type if needed
  previousMove: any; // You can specify a more specific type if needed
  pieceMap: any[]; // You can specify a more specific type if needed

  constructor(position: any, color: number) {
    super(position, color);
    this.code = "b";
    this.value = color === 0 ? 30 : -30;
    this.previousMove = null;
    this.pieceMap = [];
  }

  GetMoves(board: any): [any[], any[]] {
    const [moves, captures] = this.DiagonalMoves(board);
    return [moves, captures];
  }

  DiagonalMoves(board: any): [any[], any[]] {
    const patterns = [
      [-1, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
    ];
    const [moves, captures] = this.GetPatternMoves(board, patterns);
    return [moves, captures];
  }
}
