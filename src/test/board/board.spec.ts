import { Board } from "@/board/index";
import { initializeBoard } from "@/hooks/GameManagement";
import { createPiece, Empty, King, Pawn } from "@/moves";
import { BoardProps } from "@/moves/piece";
import { Position, SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";

describe("Board", () => {
  let board: Board;
  const [grid, whiteKing, blackKing] = initializeBoard(SquareID.EMPTY);
  const mockProps = {
    currPlayer: SquareID.WHITE,
    history: [],
    grid,
    checkWhiteKing: false,
    checkBlackKing: false,
    winner: SquareID.EMPTY,
    pieceToPromote: null,
    whitePromotions: [],
    blackPromotions: [],
    whiteKing,
    blackKing,
    computerPlayerID: SquareID.BLACK,
  } as BoardProps;

  beforeEach(() => {
    board = new Board(mockProps);
  });

  it("should initialize properly", () => {
    expect(board.player).toEqual(SquareID.WHITE);
    expect(board.historic).toEqual([]);
    // Add more expectations for other properties
  });

  it("should switch turns correctly", () => {
    const initialPlayer = board.player;
    board.switchTurn();
    expect(board.player).toEqual(
      initialPlayer === SquareID.WHITE ? SquareID.BLACK : SquareID.WHITE
    );
  });

  // Add more tests for other methods as needed

  it("should verify a valid move", () => {
    const startPos: Position = { row: 1, col: 2 };
    const endPos: Position = { row: 3, col: 2 };
    const piece = board.grid[startPos.row][startPos.col];
    const isValidMove = board.verifyMove(piece, endPos);
    expect(isValidMove).toBe(true);
  });

  it("should verify an invalid move", () => {
    const startPos: Position = { row: 6, col: 6 };
    const endPos: Position = { row: 4, col: 6 };
    const piece = board.grid[startPos.row][startPos.col];
    const isValidMove = board.verifyMove(piece, endPos);
    expect(isValidMove).toBe(false);
  });

  it("should move a pawn", () => {
    const pawn = new Pawn({
      position: { row: 1, col: 0 },
      color: SquareID.WHITE,
      pieceId: "p1",
      computerColor: SquareID.BLACK,
    });
    board.grid[1][0] = pawn;
    board.move({ row: 1, col: 0 }, { row: 3, col: 0 });

    expect(board.grid[1][0]).toBeInstanceOf(Empty);
    expect(board.grid[3][0]).toBeInstanceOf(Pawn);
  });

  it("should move a king and switch turn", () => {
    const king = new King({
      position: { row: 0, col: 4 },
      color: SquareID.WHITE,
      pieceId: "k1",
      computerColor: SquareID.BLACK,
    });
    board.grid[0][4] = king;
    board.move({ row: 0, col: 4 }, { row: 1, col: 4 });

    expect(board.grid[0][4]).toBeInstanceOf(Empty);
    expect(board.grid[1][4]).toBeInstanceOf(King);
    expect(board.player).toBe(SquareID.BLACK);
  });

  it("should validate and make a proper move by the computer", () => {
    const pawn = new Pawn({
      position: { row: 1, col: 0 },
      color: SquareID.WHITE,
      pieceId: "p1",
      computerColor: SquareID.BLACK,
    });
    board.grid[1][0] = pawn;
    board.move({ row: 1, col: 0 }, { row: 3, col: 0 });

    const computerPawn = new Pawn({
      position: { row: 6, col: 0 },
      color: SquareID.BLACK,
      pieceId: "cp1",
      computerColor: SquareID.WHITE,
    });
    board.grid[6][0] = computerPawn;
    board.move({ row: 6, col: 0 }, { row: 4, col: 0 });

    expect(board.grid[4][0]).toBeInstanceOf(Pawn);
    expect(board.grid[6][0]).toBeInstanceOf(Empty);
    expect(board.player).toBe(SquareID.WHITE);
  });

  it("should detect check", () => {
    const whiteKing = new King({
      position: { row: 0, col: 4 },
      color: SquareID.WHITE,
      pieceId: "k1",
      computerColor: SquareID.BLACK,
    });
    const blackRook = createPiece(
      {
        position: { row: 1, col: 4 },
        color: SquareID.BLACK,
        pieceId: "r1",
        computerColor: SquareID.WHITE,
      },
      PieceType.ROOK
    );

    board.grid[0][4] = whiteKing;
    board.grid[1][4] = blackRook;
    board.whiteKingPosition = { row: 0, col: 4 };

    board.check();
    expect(board.checkWhiteKing).toBeTruthy();
  });

  // it("should detect checkmate", () => {
  //   const whiteKing = new King({
  //     position: { row: 0, col: 4 },
  //     color: SquareID.WHITE,
  //     pieceId: "k1",
  //     computerColor: board.computerPlayerID,
  //   });
  //   const blackRook1 = createPiece(
  //     {
  //       position: { row: 1, col: 4 },
  //       color: SquareID.BLACK,
  //       pieceId: "r1",
  //       computerColor: board.computerPlayerID,
  //     },
  //     PieceType.ROOK
  //   );
  //   const blackRook2 = createPiece(
  //     {
  //       position: { row: 0, col: 3 },
  //       color: SquareID.BLACK,
  //       pieceId: "r2",
  //       computerColor: board.computerPlayerID,
  //     },
  //     PieceType.ROOK
  //   );
  //   const emptyTheBoard = () => {
  //     for (let row = 0; row < board.grid.length; row++) {
  //       for (let col = 0; col < board.grid[row].length; col++) {
  //         board.grid[row][col] = new Empty({
  //           position: { row, col },
  //           color: SquareID.EMPTY,
  //           computerColor: board.computerPlayerID,
  //           pieceId: "em" + row + "," + col,
  //         });
  //       }
  //     }
  //   };
  //   emptyTheBoard();
  //   board.grid[0][4] = whiteKing;
  //   board.grid[1][4] = blackRook1;
  //   board.grid[0][3] = blackRook2;
  //   board.whiteKing = whiteKing;

  //   board.check();
  //   const isCheckmate = board.isCheckmate();
  //   expect(isCheckmate).toBeTruthy();
  //   expect(board.winner).toBe(SquareID.BLACK);
  // });
});
