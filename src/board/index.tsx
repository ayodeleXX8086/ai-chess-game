import { PieceHistory, Position, SquareID } from "../utils/interfaces";
import { Queen, Bishop, Knight, Rook, Pawn, Piece, King } from "../moves/index";
import { BoardProps, Grid, GridItem } from "@/moves/piece";
import { Empty } from "@/moves/empty";
import { PieceType } from "@/utils/utilites";

export class Board {
  player: SquareID.BLACK | SquareID.WHITE;
  historic: PieceHistory[];
  grid: Grid;
  checkWhiteKing: boolean;
  checkBlackKing: boolean;
  whiteKing: Piece | null = null;
  blackKing: Piece | null = null;
  winner: SquareID | null;
  pieceToPromote: Piece | null;
  whitePromotions: (Queen | Bishop | Knight | Rook)[];
  blackPromotions: (Rook | Knight | Bishop | Queen)[];

  setCheckWhiteKing: (isChecked: boolean) => void;
  setCheckBlackKing: (isChecked: boolean) => void;
  setWinner: (squareID: SquareID | null) => void;
  setPieceToPromote: (piece: Piece | null) => void;

  constructor(props: BoardProps) {
    this.player = props.currPlayer;
    this.historic = [];
    this.grid = props.grid;
    this.checkWhiteKing = props.checkWhiteKing;
    this.checkBlackKing = props.checkBlackKing;
    this.winner = props.winner;
    this.pieceToPromote = props.pieceToPromote;
    this.whitePromotions = props.whitePromotions;
    this.blackPromotions = props.blackPromotions;
    this.whiteKing = props.whiteKing;
    this.blackKing = props.blackKing;
    this.setCheckBlackKing = props.setCheckBlackKing;
    this.setCheckWhiteKing = props.setCheckWhiteKing;
    this.setWinner = props.setWinner;
    this.setPieceToPromote = props.setPieceToPromote;
  }

  forfeit() {
    // resign
  }

  getPreviousMove(piece: Piece): PieceHistory | null {
    return (
      this.historic
        .slice()
        .reverse()
        .find((value) => value.piece_id === piece.pieceId) || null
    );
  }

  getPiece(coord: Position) {
    return this.grid[coord.row][coord.col];
  }

  setPiece(position: Position, piece: any) {
    this.grid[position.row][position.col] = piece;
  }

  switchTurn(isAI = false) {
    this.player =
      SquareID.BLACK === this.player ? SquareID.WHITE : SquareID.BLACK;
    this.isCheckmate();
  }

  recentMove(): PieceHistory[] {
    return this.historic.length > 0
      ? [
          this.historic[this.historic.length - 1],
          this.historic[this.historic.length - 2],
        ]
      : [];
  }

  allowedMoveList(piece: Piece, moves: Position[], isAI: boolean): Position[] {
    const allowedMoves: Position[] = [];
    for (const move of moves) {
      if (this.verifyMove(piece, { ...move }, isAI)) {
        allowedMoves.push({ ...move });
      }
    }
    return allowedMoves;
  }

  getAllowedMoves(piece: any, isAI = false) {
    const [moves, captures] = piece.getMoves(this);
    const allowedMoves = this.allowedMoveList(piece, moves.slice(), isAI);
    const allowedCaptures = this.allowedMoveList(piece, captures.slice(), isAI);
    return [allowedMoves, allowedCaptures];
  }

  move(piece: Piece, position: Position, isSimulation: boolean) {
    position = { ...position };
    if (
      piece.code === PieceType.KING &&
      this.isCastling(piece, { ...position })
    ) {
      this.castleKing(piece as King, { ...position }, isSimulation);
    } else if (this.isEnPassant(piece, { ...position })) {
      this.grid[position.row][piece.getPosition().col] = new Empty({
        position:
          this.grid[position.row][piece.getPosition().col].getPosition(),
        color: SquareID.EMPTY,
        squareRef: this.grid[position.row][piece.getPosition().col].squareRef,
        pieceId: this.grid[position.row][piece.getPosition().col].pieceId,
      });
      this.movePiece(piece, position, isSimulation);
      this.historic[this.historic.length - 1].piece_code = PieceType.SPECIAL;
    } else {
      this.movePiece(piece, position, isSimulation);
    }

    if (
      piece instanceof Pawn &&
      (piece.getPosition().row === 0 || piece.getPosition().row === 7)
    ) {
      this.pieceToPromote = piece;
    } else {
      this.switchTurn();
    }

    this.check();
  }

  movePiece(piece: Piece, position: Position, isSimulation: boolean) {
    const newPosition = { ...position };
    const [prevSquareRef, currSquareRef] = [
      piece.squareRef,
      this.grid[position.row][position.col].squareRef,
    ];
    const prevPiece = this.grid[position.row][position.col];
    this.grid[piece.getPosition().row][piece.getPosition().col] = new Empty({
      position: piece.getPosition(),
      color: SquareID.EMPTY,
      squareRef: prevSquareRef,
      pieceId: piece.pieceId,
    });
    const oldPosition = { ...piece.getPosition() };
    piece.updatePosition(position);
    piece.squareRef = currSquareRef;
    this.grid[position.row][position.col] = piece;
    this.historic.push({
      position: oldPosition,
      piece_code: piece.code,
      piece_color: piece.color,
      piece_id: piece.pieceId,
      squareRef: currSquareRef,
    });
    this.historic.push({
      position: newPosition,
      piece_code: prevPiece.code,
      piece_color: prevPiece.color,
      piece_id: prevPiece.pieceId,
      squareRef: prevSquareRef,
    });
    this.checkBlackKing = false;
    this.checkWhiteKing = false;
  }

  verifyMove(piece: Piece, move: Position, isAI: boolean) {
    if (this.player !== piece.color) return false;
    const position = { ...move };
    const oldPosition = { ...piece.getPosition() };
    let captureEnPassant = null;
    const capturedPiece = this.grid[position.row][position.col];
    const _piece = this.grid[position.row][oldPosition.col];
    const emptyPiece = new Empty({
      position: _piece.getPosition(),
      color: SquareID.EMPTY,
      squareRef: _piece.squareRef,
      pieceId: _piece.pieceId,
    });
    if (this.isEnPassant(piece, position)) {
      captureEnPassant = this.grid[position.row][oldPosition.col];
      this.grid[position.row][oldPosition.col] = emptyPiece;
    }

    this.grid[oldPosition.row][oldPosition.col] = emptyPiece;
    this.grid[position.row][position.col] = piece;
    piece.updatePosition(move);

    const enemyCaptures = this.getEnemyCaptures(this.player);
    if (
      this.isCastling(piece, oldPosition) &&
      ((!this.verifyMove(piece, { row: 5, col: position.col }, isAI) &&
        Math.abs(position.row - oldPosition.row) === 2) ||
        (!this.verifyMove(piece, { row: 3, col: position.col }, isAI) &&
          Math.abs(position.row - oldPosition.row) === 3) ||
        this.isInCheck(piece))
    ) {
      this.undoMove(piece, capturedPiece, oldPosition, position);
      return false;
    }

    for (const pos of enemyCaptures) {
      if (
        (this.whiteKing &&
          this.whiteKing?.getPosition() === pos &&
          piece.color === SquareID.BLACK) ||
        (this.blackKing &&
          this.blackKing?.getPosition() === pos &&
          piece.color === SquareID.WHITE)
      ) {
        this.undoMove(piece, capturedPiece, oldPosition, position);
        if (captureEnPassant !== null) {
          this.grid[position.row][oldPosition.col] = captureEnPassant;
        }
        return false;
      }
    }

    this.undoMove(piece, capturedPiece, oldPosition, position);
    if (captureEnPassant !== null) {
      this.grid[position.row][oldPosition.col] = captureEnPassant;
    }
    return true;
  }

  undoMove(piece: any, captured: any, oldPos: any, pos: any) {
    this.grid[oldPos.row][oldPos.col] = piece;
    this.grid[pos.row][pos.col] = captured;
    piece.updatePosition(oldPos);
  }

  getEnemyCaptures(player: SquareID) {
    const captures = [];
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

  getRecentMove(piece: Piece) {}

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

  castleKing(king: King, position: Position, isSimulation: boolean) {
    position = { ...position };
    if (position.col !== 2 && position.col !== 6) return;

    let rook: GridItem =
      position.col === 2
        ? this.grid[king.getPosition().row][0]
        : this.grid[king.getPosition().row][7];
    if (position.col === 2) {
      this.movePiece(king, position, isSimulation);
      let newPiece = new Empty({
        position: { row: rook.getPosition().row, col: 0 },
        color: SquareID.EMPTY,
        squareRef: this.grid[rook.getPosition().row][0].squareRef,
        pieceId: this.grid[rook.getPosition().row][0].pieceId,
      });
      this.grid[rook.getPosition().row][0] = newPiece;
      rook.updatePosition({ col: rook.getPosition().col, row: 3 });
    } else {
      this.movePiece(king, position, isSimulation);
      let newPiece = new Empty({
        position: { row: 0, col: rook.getPosition().col },
        color: SquareID.EMPTY,
        squareRef: this.grid[0][rook.getPosition().col].squareRef,
        pieceId: this.grid[0][rook.getPosition().col].pieceId,
      });
      this.grid[rook.getPosition().row][7] = newPiece;
      rook.updatePosition({ col: rook.getPosition().col, row: 5 });
    }
    this.grid[rook.getPosition().row][rook.getPosition().col] = rook;
    this.historic[this.historic.length - 1].piece_code = PieceType.SPECIAL;
  }

  promotePawn(pawn: Pawn, choice: number) {
    const position = { ...pawn.getPosition() };
    let newPiece = new Empty({
      position: position,
      color: SquareID.EMPTY,
      squareRef: pawn.squareRef,
      pieceId: pawn.pieceId,
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
    this.setPieceToPromote(null);
  }

  moveSimulation(piece: Piece, nextPos: Position) {
    const empty = new Empty({
      position: piece.getPosition(),
      color: SquareID.EMPTY,
      squareRef: piece.squareRef,
      pieceId: piece.pieceId,
    });
    if (this.grid[nextPos.row][nextPos.col].code === PieceType.EMPTY) {
      this.grid[piece.getPosition().row][piece.getPosition().col] = empty;
      piece.updatePosition({ ...nextPos });
      this.grid[nextPos.row][nextPos.col] = piece;
      return null;
    } else {
      const prevPiece = this.grid[nextPos.row][nextPos.col];
      this.grid[piece.getPosition().row][piece.getPosition().col] = empty;
      piece.updatePosition({ ...nextPos });
      this.grid[nextPos.row][nextPos.col] = piece;
      return prevPiece;
    }
  }

  check() {
    let king = this.player === SquareID.BLACK ? this.whiteKing : this.blackKing;
    if (!king) return;
    for (const pieces of this.grid) {
      for (const piece of pieces) {
        if (piece !== null && piece.color !== this.player) {
          const [moves, captures] = this.getAllowedMoves(piece);
          if (captures.includes(king?.getPosition())) {
            if (this.player === SquareID.WHITE) {
              this.setCheckBlackKing(true);
              return;
            } else {
              this.setCheckWhiteKing(true);
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
      squareRef: piece.squareRef,
      pieceId: piece.pieceId,
    });
  }

  isCheckmate() {
    for (const pieces of this.grid) {
      for (const piece of pieces) {
        if (piece !== null && piece.color === this.player) {
          const [moves, captures] = this.getAllowedMoves(piece);
          if (moves.length > 0 || captures.length > 0) {
            return false;
          }
        }
      }
    }

    this.check();
    if (this.checkWhiteKing) {
      this.setWinner(SquareID.BLACK);
    } else if (this.checkBlackKing) {
      this.setWinner(SquareID.WHITE);
    } else {
      this.setWinner(null);
    }

    return true;
  }
}
