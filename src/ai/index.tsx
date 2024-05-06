import { Piece } from "@/moves/index";
import { Position, SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";
import { Board } from "../board/index";
import { PieceMap } from "./pointMap";

export class Minimax {
  depth: number;
  board: Board;
  alphaBetaPruning: boolean;
  usePointMaps: boolean;
  computerID: SquareID;

  constructor(
    depth: number,
    board: Board,
    alphaBetaPruning = true,
    usePointMaps = true
  ) {
    this.depth = depth;
    this.board = board;
    this.computerID = board.computerPlayerID;
    this.alphaBetaPruning = alphaBetaPruning;
    this.usePointMaps = usePointMaps;
  }

  start() {
    let bestMove: Position | null = null;
    let currentPiece: Piece | null = null;
    const isMaximizer = this.board.player === this.computerID;
    let bestScore = isMaximizer ? -9999 : 9999;
    const possibleMoves = this.board.grid;

    for (const pieces of possibleMoves) {
      for (const piece of pieces) {
        if (piece.color !== this.board.player) continue;
        const [moves, captures] = this.board.getAllowedMoves(piece);
        const possibleMoves = [...moves, ...captures];
        for (const move of possibleMoves) {
          const prevPosition = { ...piece.getPosition() };
          const currentPosition = move;
          this.board.move(prevPosition, currentPosition);
          let score = this.minimax(this.depth - 1, !isMaximizer, -10000, 10000);
          if (
            piece.code === PieceType.PAWN &&
            (move.row === 7 || move.row === 0)
          ) {
            score += 80;
          } else if (this.board.isEnPassant(piece, move)) {
            score += 10;
          }

          if (!isMaximizer) {
            score *= -1;
          }

          if (score >= bestScore && isMaximizer) {
            bestScore = score;
            bestMove = move;
            currentPiece = piece;
          }
          this.board.undoLastMove();
        }
      }
    }

    return { piece: currentPiece, move: bestMove };
  }

  minimax(
    depth: number,
    isMaximizer: boolean,
    alpha: number,
    beta: number
  ): number {
    if (depth === 0 || this.board.isCheckmate()) {
      return this.evaluate() * (isMaximizer ? 1 : -1);
    }
    const possibleMoves = this.legalMoves(
      this.board.player,
      this.board.player === SquareID.BLACK ? 0 : 7
    );
    if (isMaximizer) {
      let bestScore = -9999;
      for (const move of possibleMoves) {
        const prev_position = move[1].getPosition();
        const position = move[2];
        this.board.move(prev_position, position);
        const score = this.minimax(depth - 1, false, alpha, beta);
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, bestScore);
        this.board.undoLastMove();
        if (beta <= alpha && this.alphaBetaPruning) {
          break;
        }
      }
      return bestScore;
    } else {
      let bestScore = 9999;
      for (const move of possibleMoves) {
        const prev_position = move[1].getPosition();
        const position = move[2];
        this.board.move(prev_position, position);
        const score = this.minimax(depth - 1, true, alpha, beta);
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, bestScore);
        this.board.undoLastMove();
        if (beta <= alpha && this.alphaBetaPruning) {
          break;
        }
      }
      return bestScore;
    }
  }

  getMoves(piece: Piece, rowIndex: number) {
    const bestMoves: [number, Piece, Position][] = [];

    const [moves, captures] = this.board.getAllowedMoves(piece);
    for (const pos of captures) {
      bestMoves.push([
        10 * this.board.grid[pos.row][pos.col].value - piece.value,
        piece,
        pos,
      ]);
      if (piece.code === PieceType.PAWN && pos.row === rowIndex) {
        bestMoves[bestMoves.length - 1][0] += 90;
      } else {
        bestMoves.push([piece.value, piece, pos]);
      }
    }

    for (const pos of moves) {
      if (piece.code === PieceType.PAWN && pos.row === rowIndex) {
        bestMoves.push([90, piece, pos]);
      } else {
        bestMoves.push([0, piece, pos]);
      }
    }

    return bestMoves;
  }

  legalMoves(color: SquareID, rowIndex: number): [number, Piece, Position][] {
    let bestMoves: [number, Piece, Position][] = [];

    for (const pieces of this.board.grid) {
      for (const piece of pieces) {
        if (piece.color !== SquareID.EMPTY && piece.color === color) {
          const betterTempMoves = this.getMoves(piece, rowIndex);
          bestMoves = [...bestMoves, ...betterTempMoves];
        }
      }
    }

    bestMoves.sort((a, b) => a[0] - b[0]);
    return bestMoves;
  }

  evaluate(): number {
    let totalScore = 0;
    for (const pieces of this.board.grid) {
      for (const piece of pieces) {
        if (piece.code !== PieceType.EMPTY) {
          const p_map = PieceMap(piece, this.computerID);
          let score = piece.value;
          if (this.usePointMaps) {
            score += p_map[piece.getPosition().row][piece.getPosition().col];
          }
          totalScore += score;
        }
      }
    }
    return totalScore;
  }
}
