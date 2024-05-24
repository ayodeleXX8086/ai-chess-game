import { Position } from "@/utils/interfaces";
import styles from "../global.module.css";
import { Board } from "@/board/index";
import { useCallback, useEffect, useRef } from "react";
import { Minimax } from "@/ai/index";
import { Piece } from "@/moves/piece";

interface PieceManagement {
  selectPosition: Position | null;
}

const useBoardManagement = (
  board: Board,
  updateBoard: any,
  gridDomRefs: React.RefObject<HTMLDivElement>[][]
): [
  (position: Position) => void,
  (position: Position) => void,
  (position: Position) => void,
  (position: Position) => boolean
] => {
  const currentPieceManagement = useRef<PieceManagement>({
    selectPosition: null,
  });

  useEffect(() => {
    if (board.player === board.computerPlayerID) {
      // Perform computer move using minimax algorithm
      const updatedBoard = board.clone(); // Clone the board
      const minimax = new Minimax(3, updatedBoard);
      const { piece: computerPiece, move: computerMove } = minimax.start();

      if (computerPiece && computerMove) {
        const prevPositionComputer = { ...computerPiece?.getPosition() };
        updatedBoard.move(prevPositionComputer, computerMove); // Update the cloned board again
        updateBoard(updatedBoard, prevPositionComputer, computerMove); // Update the state with the new board
      } else {
        alert("Game has ended");
      }
    }
  }, [board, updateBoard]);

  const highlightOrUnHighlightPieceMoves = useCallback(
    (piecePosition: Position, highLight: boolean) => {
      const piece = board.grid[piecePosition.row][piecePosition.col];
      if (piece.color === board.player) {
        const [moves, captures] =
          board.grid[piecePosition.row][piecePosition.col].getMoves(board);
        const totalMoves = [...moves, ...captures];
        totalMoves.forEach((position) => {
          highLight
            ? gridDomRefs[position.row][position.col].current?.classList.add(
                styles.highlighted_blue
              )
            : gridDomRefs[position.row][position.col].current?.classList.remove(
                styles.highlighted_blue
              );
        });
      }
    },
    [board, gridDomRefs]
  );

  const hover = useCallback(
    (hoverPosition: Position) => {
      highlightOrUnHighlightPieceMoves(hoverPosition, true);
    },
    [highlightOrUnHighlightPieceMoves]
  );

  const unHover = useCallback(
    (unhoverPosition: Position) => {
      highlightOrUnHighlightPieceMoves(unhoverPosition, false);
    },
    [highlightOrUnHighlightPieceMoves]
  );

  const select = useCallback((selectPosition: Position) => {
    currentPieceManagement.current = {
      selectPosition,
    };
  }, []);

  const comparePosition = (position1: Position, position2: Position) => {
    return position1.col === position2.col && position2.row === position1.row;
  };

  const drop = useCallback(
    (dropPosition: Position) => {
      if (!dropPosition || !currentPieceManagement.current.selectPosition) {
        return false;
      }

      const { selectPosition } = currentPieceManagement.current;
      const piece = board.grid[selectPosition.row][selectPosition.col];
      highlightOrUnHighlightPieceMoves(selectPosition, false);
      if (
        board.verifyMove(piece, dropPosition, false) &&
        !comparePosition(selectPosition, dropPosition)
      ) {
        const updatedBoard = board.clone(); // Clone the board
        const [prevPosition, currPosition] = [selectPosition, dropPosition];
        updatedBoard.move(prevPosition, currPosition); // Update the cloned board
        updateBoard(updatedBoard, prevPosition, currPosition); // Update the state with the new board
        return true;
      }

      return false;
    },
    [board, updateBoard, highlightOrUnHighlightPieceMoves]
  );

  return [hover, unHover, select, drop];
};

export { useBoardManagement };
