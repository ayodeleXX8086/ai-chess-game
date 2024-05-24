import { Position, SquareID } from "../utils/interfaces";
import {
  Queen,
  Bishop,
  Knight,
  Rook,
  Pawn,
  Piece,
  King,
  createPiece,
} from "../moves/index";
import { BoardProps, Grid, GridItem } from "@/moves/piece";
import { Empty } from "@/moves/empty";
import { PieceType } from "@/utils/utilites";

export class Board {
  private props: BoardProps;
  player: SquareID.BLACK | SquareID.WHITE;
  computerPlayerID: SquareID.BLACK | SquareID.WHITE;
  historic: Piece[];
  grid: Grid;
  checkWhiteKing: boolean;
  checkBlackKing: boolean;
  whiteKingPosition: Position | null = null;
  blackKingPosition: Position | null = null;
  winner: SquareID;
  pieceToPromote: Piece | null;

  constructor(props: BoardProps) {
    this.props = props;
    this.player = props.currPlayer;
    this.historic = props.history;
    this.grid = props.grid;
    this.checkWhiteKing = props.checkWhiteKing;
    this.checkBlackKing = props.checkBlackKing;
    this.winner = props.winner || SquareID.EMPTY;
    this.pieceToPromote = props.pieceToPromote;
    this.whiteKingPosition = props.whiteKing.getPosition();
    this.blackKingPosition = props.blackKing.getPosition();
    this.computerPlayerID = props.computerPlayerID;
  }

  getBoardProps() {
    return this.props;
  }

  getPreviousMove(piece: Piece): Piece | null {
    return (
      this.historic
        .slice()
        .reverse()
        .find((value) => value.pieceId === piece.pieceId) || null
    );
  }

  getPiece(coord: Position) {
    return this.grid[coord.row][coord.col];
  }

  switchTurn(isAI = false) {
    this.player =
      SquareID.BLACK === this.player ? SquareID.WHITE : SquareID.BLACK;
    this.isCheckmate();
  }

  recentMove(): Piece[] {
    return this.historic.length > 0
      ? [
          this.historic[this.historic.length - 1],
          this.historic[this.historic.length - 2],
        ]
      : [];
  }

  allowedMoveList(piece: Piece, moves: Position[]): Position[] {
    const allowedMoves: Position[] = [];
    for (const move of moves) {
      if (this.validateMove(piece, { ...move })) {
        allowedMoves.push({ ...move });
      }
    }
    return allowedMoves;
  }

  getAllowedMoves(piece: any) {
    const [moves, captures] = piece.getMoves(this);
    const allowedMoves = this.allowedMoveList(piece, moves.slice());
    const allowedCaptures = this.allowedMoveList(piece, captures.slice());
    return [allowedMoves, allowedCaptures];
  }

  move(previousPosition: Position, position: Position): [Position, Position] {
    position = { ...position };
    const piece = this.grid[previousPosition.row][previousPosition.col];

    if (
      piece.code === PieceType.KING &&
      this.isCastling(piece, { ...position })
    ) {
      this.castleKing(piece as King, { ...position });
    } else if (this.isEnPassant(piece, { ...position })) {
      this.grid[position.row][piece.getPosition().col] = new Empty({
        position:
          this.grid[position.row][piece.getPosition().col].getPosition(),
        color: SquareID.EMPTY,
        pieceId: this.grid[position.row][piece.getPosition().col].pieceId,
        computerColor: this.computerPlayerID,
      });
      this.movePiece(piece, position);
      this.historic[this.historic.length - 1].move = PieceType.SPECIAL;
    } else {
      this.movePiece(piece, position);
    }

    if (
      piece.code === PieceType.PAWN &&
      (piece.getPosition().row === 0 || piece.getPosition().row === 7)
    ) {
      this.pieceToPromote = piece;
    } else {
      this.switchTurn();
    }

    this.check();
    if (
      piece.code === PieceType.KING &&
      this.grid[previousPosition.row][previousPosition.col].code !== piece.code
    ) {
      if (this.grid[position.row][position.col].code === PieceType.KING) {
        if (this.grid[position.row][position.col].color === SquareID.BLACK) {
          this.blackKingPosition = position;
        } else {
          this.whiteKingPosition = position;
        }
      }
    }
    return [previousPosition, position];
  }

  clone(): Board {
    const propsClone = { ...this.props };
    const gridClone: Grid = [];
    for (let row = 0; row < this.grid.length; row++) {
      gridClone[row] = [...this.grid[row]];
    }
    const historicClone: Piece[] = this.historic;

    const boardClone = new Board({
      ...propsClone,
      grid: gridClone,
      history: this.historic,
    });

    boardClone.player = this.player;
    boardClone.computerPlayerID = this.computerPlayerID;
    boardClone.checkWhiteKing = this.checkWhiteKing;
    boardClone.checkBlackKing = this.checkBlackKing;
    boardClone.whiteKingPosition = this.whiteKingPosition;
    boardClone.blackKingPosition = this.blackKingPosition;
    boardClone.winner = this.winner;
    boardClone.pieceToPromote = this.pieceToPromote;
    return boardClone;
  }

  private movePiece(piece: Piece, position: Position) {
    const prevPiece = this.grid[position.row][position.col];
    this.grid[piece.getPosition().row][piece.getPosition().col] = new Empty({
      position: piece.getPosition(),
      color: SquareID.EMPTY,
      pieceId: piece.pieceId,
      computerColor: this.computerPlayerID,
    });
    this.grid[position.row][position.col] = createPiece(
      {
        ...piece.props,
        position,
      },
      piece.code
    );
    this.historic.push(prevPiece);
    this.historic.push(piece);
    this.checkBlackKing = false;
    this.checkWhiteKing = false;
  }

  private validateMove(piece: Piece, move: Position) {
    const position = { ...move };
    const oldPosition = { ...piece.getPosition() };
    let captureEnPassant: Piece | null = null;
    const capturedPiece = this.grid[position.row][position.col];
    const empty_piece = this.grid[oldPosition.row][position.col];
    const emptyPiece = new Empty({
      position: empty_piece.getPosition(),
      color: SquareID.EMPTY,
      pieceId: empty_piece.pieceId,
      computerColor: this.computerPlayerID,
    });
    if (this.isEnPassant(piece, position)) {
      captureEnPassant = this.grid[oldPosition.row][position.col];
      this.grid[oldPosition.row][position.col] = emptyPiece;
    }

    this.grid[oldPosition.row][oldPosition.col] = emptyPiece;
    this.grid[position.row][position.col] = createPiece(
      { ...piece.props, position: position },
      piece.code
    );

    const enemyCaptures = this.getEnemyCaptures(this.player);
    if (
      this.isCastling(piece, oldPosition) &&
      ((!this.validateMove(piece, { row: position.row, col: 5 }) &&
        Math.abs(position.col - oldPosition.col) === 2) ||
        (!this.validateMove(piece, { row: position.row, col: 3 }) &&
          Math.abs(position.col - oldPosition.col) === 3) ||
        this.isInCheck(piece))
    ) {
      this.undoMove(piece, capturedPiece, oldPosition, position);
      return false;
    }

    for (const pos of enemyCaptures) {
      if (
        (this.whiteKingPosition?.col === pos.col &&
          this.whiteKingPosition?.row === pos.row &&
          piece.color === SquareID.WHITE) ||
        (this.blackKingPosition?.col === pos.col &&
          this.blackKingPosition?.row === pos.row &&
          piece.color === SquareID.BLACK)
      ) {
        this.undoMove(piece, capturedPiece, oldPosition, position);
        if (
          captureEnPassant !== null &&
          captureEnPassant.color !== SquareID.EMPTY
        ) {
          this.grid[oldPosition.row][position.col] = captureEnPassant;
        }
        return false;
      }
    }

    this.undoMove(piece, capturedPiece, oldPosition, position);
    if (captureEnPassant !== null) {
      this.grid[oldPosition.row][position.col] = captureEnPassant;
    }
    return true;
  }

  verifyMove(piece: Piece, move: Position) {
    if (this.player !== piece.color) return false;
    return this.validateMove(piece, move);
  }

  undoMove(piece: any, captured: any, oldPos: any, pos: any) {
    this.grid[oldPos.row][oldPos.col] = piece;
    this.grid[pos.row][pos.col] = captured;
  }

  getEnemyCaptures(player: SquareID): Position[] {
    const captures: Position[] = [];
    for (const pieces of this.grid) {
      for (const piece of pieces) {
        if (piece !== null && piece.color !== player) {
          const [moves, pieceCaptures] = piece.getMoves(this);
          captures.push(...pieceCaptures);
        }
      }
    }
    return captures;
  }

  isCastling(king: Piece, position: Position) {
    return (
      king.code === PieceType.KING &&
      Math.abs(king.getPosition().col - position.col) > 1
    );
  }

  isEnPassant(piece: any, newPos: any) {
    if (!(piece instanceof Pawn)) {
      return false;
    }
    piece = piece as Pawn;
    let moves = null;
    if (piece.color === SquareID.BLACK) {
      moves = piece.enPassant(this, -1);
    } else {
      moves = piece.enPassant(this, 1);
    }
    return moves.includes(newPos);
  }

  isInCheck(piece: Piece) {
    return (
      piece.code == PieceType.KING &&
      ((piece.color === SquareID.BLACK && this.checkWhiteKing) ||
        (piece.color === SquareID.WHITE && this.checkBlackKing))
    );
  }

  castleKing(king: King, position: Position) {
    position = { ...position };
    if (position.col !== 2 && position.col !== 6) return;

    let rook: GridItem =
      position.col === 2
        ? this.grid[king.getPosition().row][0]
        : this.grid[king.getPosition().row][7];
    let positionRook: Position;
    if (position.col === 2) {
      this.movePiece(king, position);
      let newPiece = new Empty({
        position: { row: rook.getPosition().row, col: 0 },
        color: SquareID.EMPTY,
        pieceId: this.grid[rook.getPosition().row][0].pieceId,
        computerColor: this.computerPlayerID,
      });
      this.grid[rook.getPosition().row][0] = newPiece;
      positionRook = { col: rook.getPosition().col, row: 3 };
    } else {
      this.movePiece(king, position);
      let newPiece = new Empty({
        position: { row: 0, col: rook.getPosition().col },
        color: SquareID.EMPTY,
        pieceId: this.grid[0][rook.getPosition().col].pieceId,
        computerColor: this.computerPlayerID,
      });
      this.grid[rook.getPosition().row][7] = newPiece;
      positionRook = { col: rook.getPosition().col, row: 5 };
    }
    this.grid[positionRook.row][positionRook.col] = createPiece(
      {
        ...rook.props,
        position: positionRook,
      },
      rook.code
    );
    this.historic[this.historic.length - 1].move = PieceType.SPECIAL;
  }

  undoLastMove() {
    if (this.historic.length < 2) {
      return; // No previous move to undo
    }

    const lastMove = this.historic.pop(); // Remove the last move from the history
    const prevMove = this.historic.pop(); // Get the previous move

    if (!prevMove || !lastMove) {
      return; // Invalid state, cannot undo
    }

    this.grid[lastMove.getPosition().row][lastMove.getPosition().col] =
      lastMove;
    this.grid[prevMove.getPosition().row][prevMove.getPosition().col] =
      prevMove;

    // Switch turn back to the previous player
    this.switchTurn();

    // Check the game state again
    this.check();
  }

  promotePawn(pawn: Pawn, choice: number) {
    const position = { ...pawn.getPosition() };
    let newPiece = new Empty({
      position: position,
      color: SquareID.EMPTY,
      pieceId: pawn.pieceId,
      computerColor: this.computerPlayerID,
    });
    if (choice === 0) {
      newPiece = new Queen(pawn.props);
    } else if (choice === 1) {
      newPiece = new Bishop(pawn.props);
    } else if (choice === 2) {
      newPiece = new Knight(pawn.props);
    } else if (choice === 3) {
      newPiece = new Rook(pawn.props);
    }

    this.grid[position.row][position.col] = newPiece;
    this.switchTurn();
    this.check();
    this.pieceToPromote = null;
  }

  check() {
    let kingPosition =
      this.player === SquareID.BLACK
        ? this.blackKingPosition
        : this.whiteKingPosition;
    if (!kingPosition) return;
    for (const pieces of this.grid) {
      for (const piece of pieces) {
        if (piece.color !== SquareID.EMPTY && piece.color !== this.player) {
          if (piece.code === PieceType.ROOK) {
            console.log("Rook");
          }
          const [moves, captures] = this.getAllowedMoves(piece);
          if (
            captures.find(
              (capture) =>
                capture.row === kingPosition.row &&
                capture.col === kingPosition.col
            )
          ) {
            if (this.player === SquareID.WHITE) {
              this.checkWhiteKing = true;
              return;
            } else {
              this.checkBlackKing = true;
              return;
            }
          }
        }
      }
    }
  }

  makePieceEmpty(piece: Piece) {
    return new Empty({
      position: piece.getPosition(),
      color: SquareID.EMPTY,
      pieceId: piece.pieceId,
      computerColor: this.computerPlayerID,
    });
  }

  isCheckmate() {
    for (const pieces of this.grid) {
      for (const piece of pieces) {
        if (piece.color !== SquareID.EMPTY && piece.color === this.player) {
          const [moves, captures] = this.getAllowedMoves(piece);
          if (moves.length > 0 || captures.length > 0) {
            return false;
          }
        }
      }
    }

    this.check();
    if (this.checkWhiteKing) {
      this.winner = SquareID.BLACK;
    } else if (this.checkBlackKing) {
      this.winner = SquareID.WHITE;
    } else {
      this.winner = SquareID.EMPTY;
    }

    return true;
  }
}
