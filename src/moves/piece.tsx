import { EMPTY_SQUARE } from "@/utils/utilites";
import { OnBoard, Position } from "../utils/interfaces";

export class Piece {
  position: Position;
  color: number;
  previousMove: any; // You can specify a more specific type if needed
  code: any; // You can specify a more specific type if needed

  constructor(position: Position, color: number) {
    // 0 -> White, 1 -> Black
    this.position = position;
    this.color = color;
    this.previousMove = null;
    this.code = null;
  }

  updatePosition(position: Position): void {
    this.position.row = position.row;
    this.position.col = position.col;
  }

  GetPatternMoves(board: any, patterns: number[][]): [Position[], Position[]] {
    let moves: Position[] = [];
    let captures: Position[] = [];
    for (const pattern of patterns) {
      const [m, c] = this.generator(board, pattern[0], pattern[1]);
      moves = moves.concat(m);
      captures = captures.concat(c);
    }
    return [moves, captures];
  }

  generator(board: any, dx: number, dy: number): [Position[], Position[]] {
    let moves: Position[] = [];
    let captures: Position[] = [];
    let pos: Position = {
      row: this.position.row + dx,
      col: this.position.col + dy,
    };

    while (OnBoard(pos) && board.grid[pos.row][pos.col] == EMPTY_SQUARE) {
      moves.push({ ...pos });
      pos.col += dx;
      pos.row += dy;
    }
    if (
      OnBoard(pos) &&
      board.grid[pos.row][pos.col] != EMPTY_SQUARE &&
      board.grid[pos.row][pos.col].color != this.color
    ) {
      captures.push({ ...pos });
    }

    return [moves, captures];
  }

  toString(): string {
    return `${this.color}, ${this.position}`;
  }
}
