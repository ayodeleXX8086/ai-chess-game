import { Board } from "@/board/index";
import { PawnComponent } from "@/components/pieces/index";
import { Position, SquareID } from "@/utils/interfaces";
import { OnBoard, PieceType } from "@/utils/utilites";
import { Piece, PieceProps } from "./piece";

export class Pawn extends Piece {
  constructor(props: PieceProps) {
    super(props);
    this.code = PieceType.PAWN;
    this.component = PawnComponent;
    this.value = this.color === SquareID.BLACK ? 10 : -10;
  }

  enPassant(board: Board, change: number) {
    const moves = [];
    for (const i of [-1, 1]) {
      const tempPos = { row: this.position.row + i, col: this.position.col };
      if (OnBoard(tempPos)) {
        const pieceToCapture = board.grid[tempPos.row][tempPos.col];
        if (
          pieceToCapture instanceof Pawn &&
          this.color !== pieceToCapture.color
        ) {
          const [overrideMove, originalMove] = board.recentMove();
          if (
            overrideMove &&
            originalMove &&
            originalMove.piece_code === this.code &&
            overrideMove.position.col === this.position.col + i &&
            Math.abs(overrideMove.position.row - overrideMove.position.row) ===
              2
          ) {
            moves.push({
              row: this.position.row + change,
              col: this.position.col + i,
            });
          }
        }
      }
    }
    return moves;
  }

  getMoves(board: Board): [Position[], Position[]] {
    const moves = [];
    const captures = [];
    const offset = this.color === SquareID.BLACK ? -1 : 1;
    let dRow = this.position.row + offset;
    // Possible moves
    if (
      OnBoard({ col: this.position.col, row: dRow }) &&
      board.grid[dRow][this.position.col].color === SquareID.EMPTY
    ) {
      moves.push({ row: dRow, col: this.position.col });
      if (!board.getPreviousMove(this)) {
        dRow += offset;
        if (board.grid[dRow][this.position.col].color === SquareID.EMPTY) {
          moves.push({ row: dRow, col: this.position.col });
        }
      }
    }

    dRow = this.position.row + offset;
    // Diagonal captures
    for (const i of [-1, 1]) {
      const dCol = this.position.col + i;
      if (
        OnBoard({ row: dRow, col: dCol }) &&
        this.isOpponent(board.grid[dRow][dCol])
      ) {
        captures.push({ row: dRow, col: dCol });
      }
    }

    // En passant captures
    const specialMoves = this.enPassant(board, offset);
    captures.push(...specialMoves);

    return [moves, captures];
  }
}
