import { Board } from "@/board/index";
import { EmptyPiece } from "@/components/pieces/index";
import { OnBoard, PieceType } from "@/utils/utilites";
import { ColorID, Position, SquareID } from "../utils/interfaces";
import { v4 as uuid } from "uuid";
import { Empty } from "./empty";

export type GridItem = Piece;
export type Grid = GridItem[][];

export interface PieceProps {
  position: Position;
  color: SquareID;
  squareRef: React.RefObject<HTMLDivElement>;
  pieceId: number;
}

export interface BoardProps {
  whitePromotions: Piece[];
  blackPromotions: Piece[];
  grid: GridItem[][];
  whiteKing: Piece | null;
  blackKing: Piece | null;
  currPlayer: SquareID.BLACK | SquareID.WHITE;
  checkWhiteKing: boolean;
  checkBlackKing: boolean;
  winner: SquareID | null;
  pieceToPromote: Piece | null;
  setCheckWhiteKing: (isChecked: boolean) => void;
  setCheckBlackKing: (isChecked: boolean) => void;
  setWinner: (squareID: SquareID | null) => void;
  setPieceToPromote: (piece: Piece | null) => void;
}

export abstract class Piece {
  props: PieceProps;
  protected position: Position;
  color: SquareID;
  squareRef: React.RefObject<HTMLDivElement>;
  code: PieceType; // You can specify a more specific type if needed
  value: number;
  protected component: (prop?: any) => React.JSX.Element;
  pieceId: number;

  constructor(props: PieceProps) {
    // 0 -> White, 1 -> Black, -1 -> Empty
    this.props = Object.freeze(props);
    this.position = props.position;
    this.color = props.color;
    this.squareRef = props.squareRef;
    this.code = PieceType.EMPTY;
    this.component = EmptyPiece;
    this.value = 0;
    this.pieceId = props.pieceId;
  }

  updatePosition(newPosition: Position) {
    this.position = newPosition;
  }

  isOpponent(piece: Piece) {
    if (this.color === SquareID.EMPTY || piece.color === SquareID.EMPTY)
      return false;
    return this.color !== piece.color;
  }

  getPosition(): Position {
    return this.position;
  }

  getComponent() {
    return this.component({
      color: this.color === SquareID.BLACK ? ColorID.BLACK : ColorID.WHITE,
    });
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
