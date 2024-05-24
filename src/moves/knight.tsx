import { Board } from "@/board/index";
import { Position } from "@/utils/interfaces";
import { OnBoard, PieceType } from "@/utils/utilites";
import { Piece, PieceProps } from "./piece";

export class Knight extends Piece {
  constructor(props: PieceProps) {
    super(props);
    this.move = this.code = PieceType.KNIGHT;
    this.value = this.value * 30;
  }

  getMoves(board: Board): [Position[], Position[]] {
    const moves: Position[] = [];
    const captures: Position[] = [];

    for (let i = -2; i < 3; i++) {
      if (i !== 0) {
        for (let j = -2; j < 3; j++) {
          if (j !== 0) {
            const dRow = this.position.row + j;
            const dCol = this.position.col + i;
            const temp = { row: dRow, col: dCol } as Position;
            if (Math.abs(i) !== Math.abs(j) && OnBoard(temp)) {
              if (board.grid[dRow][dCol].code === PieceType.EMPTY) {
                moves.push({ ...temp });
              } else {
                if (this.isOpponent(board.grid[dRow][dCol])) {
                  captures.push({ ...temp });
                }
              }
            }
          }
        }
      }
    }
    return [moves, captures];
  }
}
