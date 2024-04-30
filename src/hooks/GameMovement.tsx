import { useEffect, useState } from "react";
import { Position, SquareID } from "@/utils/interfaces";
import styles from "../global.module.css";
import { Board } from "@/board/index";
import { useRef } from "react";

interface PieceManagement {
  selectPosition: Position | null;
}

const useBoardManagement = (
  board: Board
): [
  (position: Position) => void,
  (position: Position) => void,
  (position: Position) => void,
  (position: Position) => boolean
] => {
  const currentPieceManagement = useRef<PieceManagement>({
    selectPosition: null,
  });

  // Helper function to add class name to a square
  const addClassToSquare = (position: Position, className: string) => {
    const { row, col } = position;
    board.grid[row][col]?.squareRef?.current?.classList.add(className);
  };

  // Helper function to remove class name from a square
  const removeClassFromSquare = (position: Position, className: string) => {
    const { row, col } = position;
    board.grid[row][col]?.squareRef?.current?.classList.remove(className);
  };

  const hover = (hoverPosition: Position) => {
    const piece = board.grid[hoverPosition.row][hoverPosition.col];
    if (piece.color === board.player) {
      const [moves, captures] =
        board.grid[hoverPosition.row][hoverPosition.col].getMoves(board);
      const totalMoves = [...moves, ...captures];
      totalMoves.forEach((position) => {
        addClassToSquare(position, styles.highlighted_blue);
      });
    }
  };

  const unHover = (unhoverPosition: Position) => {
    const piece = board.grid[unhoverPosition.row][unhoverPosition.col];
    if (piece.color === board.player) {
      const [moves, captures] = piece.getMoves(board);
      const totalMoves = [...moves, ...captures];
      totalMoves.forEach((position) => {
        removeClassFromSquare(position, styles.highlighted_blue);
      });
    }
  };

  const select = (selectPosition: Position) => {
    currentPieceManagement.current = {
      selectPosition,
    };
  };

  const drop = (dropPosition: Position) => {
    if (dropPosition && currentPieceManagement.current?.selectPosition) {
      const [prevPosition, currPosition] = [
        currentPieceManagement.current.selectPosition,
        dropPosition,
      ];
      const piece = board.grid[prevPosition.row][prevPosition.col];
      if (board.verifyMove(piece, currPosition, false)) {
        unHover(currentPieceManagement.current?.selectPosition);
        board.move(piece, currPosition, false);
        return true;
      }
    }
    return false;
  };

  return [hover, unHover, select, drop];
};

export { useBoardManagement };
