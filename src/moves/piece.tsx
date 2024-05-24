import { Board } from "@/board/index";
import { OnBoard, PieceType } from "@/utils/utilites";
import { Position, SquareID } from "../utils/interfaces";

export type GridItem = Piece;
export type Grid = GridItem[][];

export interface PieceProps {
  position: Position;
  color: SquareID;
  pieceId: string;
  computerColor: SquareID;
}

export interface BoardProps {
  grid: GridItem[][];
  history: Piece[];
  whiteKing: Piece | null;
  blackKing: Piece | null;
  currPlayer: SquareID.BLACK | SquareID.WHITE;
  checkWhiteKing: boolean;
  checkBlackKing: boolean;
  winner: SquareID | null;
  pieceToPromote: Piece | null;
  computerPlayerID: SquareID.BLACK | SquareID.WHITE;
}

export abstract class Piece {
  props: PieceProps;
  protected position: Position;
  color: SquareID;
  code: PieceType;
  move: PieceType;
  value: number;
  protected component: React.FC<any>;
  pieceId: string;
  computerColor: SquareID;

  constructor(props: PieceProps) {
    // 0 -> White, 1 -> Black, -1 -> Empty
    this.props = Object.freeze(props);
    this.position = props.position;
    this.color = props.color;
    this.code = PieceType.EMPTY;
    this.move = PieceType.EMPTY;
    this.value = this.color !== props.computerColor ? 1 : -1;
    this.pieceId = props.pieceId;
    this.computerColor = props.computerColor;
  }

  isOpponent(piece: Piece) {
    if (this.color === SquareID.EMPTY || piece.color === SquareID.EMPTY)
      return false;
    return this.color !== piece.color;
  }

  getPosition(): Position {
    return this.position;
  }

  abstract getMoves(board: Board): [Position[], Position[]];

  getPatternMoves(board: any, patterns: number[][]): [Position[], Position[]] {
    let moves: Position[] = [];
    let captures: Position[] = [];
    for (const pattern of patterns) {
      const [m, c] = this.generator(board, pattern[0], pattern[1]);
      moves = moves.concat(m);
      captures = captures.concat(c);
    }
    return [moves, captures];
  }

  generator(board: Board, dx: number, dy: number): [Position[], Position[]] {
    let moves: Position[] = [];
    let captures: Position[] = [];
    let pos: Position = {
      row: this.position.row + dx,
      col: this.position.col + dy,
    };

    while (
      OnBoard(pos) &&
      board.grid[pos.row][pos.col].color === SquareID.EMPTY
    ) {
      moves.push({ ...pos });
      pos.col += dy;
      pos.row += dx;
    }
    if (OnBoard(pos) && this.isOpponent(board.grid[pos.row][pos.col])) {
      captures.push({ ...pos });
    }

    return [moves, captures];
  }

  toString(): string {
    return `${this.color}, ${this.position}`;
  }
}
