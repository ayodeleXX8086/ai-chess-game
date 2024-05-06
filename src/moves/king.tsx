import { Board } from "@/board/index";
import { KingComponent } from "@/components/pieces/index";
import { Position, SquareID } from "@/utils/interfaces";
import { OnBoard, PieceType } from "@/utils/utilites";
import { Piece } from "./index";
import { PieceProps } from "./piece";

export class King extends Piece {
  constructor(props: PieceProps) {
    super(props);
    this.code = PieceType.KING;
    this.component = KingComponent;
    this.value = this.value * 30;
  }

  canCastle(piece: Piece | null, board: Board): boolean {
    return piece !== null && board.getPreviousMove(piece) === null;
  }

  castle(board: Board): Position[] {
    const castles: Position[] = [];
    const rightRook: Piece | null = board.grid[this.position.row][7];
    const leftRook: Piece | null = board.grid[this.position.row][0];

    if (board.getPreviousMove(this)) {
      // Castle Left
      if (
        board.grid[this.position.row][1].color === SquareID.EMPTY &&
        board.grid[this.position.row][2].color === SquareID.EMPTY &&
        board.grid[this.position.row][3].color === SquareID.EMPTY &&
        this.canCastle(leftRook, board)
      ) {
        castles.push({ col: 2, row: this.position.row });
      }
      // Castle Right
      if (
        board.grid[this.position.row][5].color === SquareID.EMPTY &&
        board.grid[this.position.row][6].color === SquareID.EMPTY &&
        this.canCastle(rightRook, board)
      ) {
        castles.push({ col: 6, row: this.position.row });
      }
    }

    return castles;
  }

  getMoves(board: Board): [Position[], Position[]] {
    const moves: Position[] = [];
    const captures: Position[] = [];
    const castles: Position[] = this.castle(board);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const dRow = this.position.row + y;
        const dCol = this.position.col + x;
        const temp = { row: dRow, col: dCol };
        if ((x !== 0 || y !== 0) && OnBoard(temp)) {
          if (board.grid[dRow][dCol].color === SquareID.EMPTY) {
            moves.push(temp);
          } else {
            if (board.grid[dRow][dCol]?.color !== this.color) {
              captures.push(temp);
            }
          }
        }
      }
    }

    moves.push(...castles);
    return [moves, captures];
  }
}
