import { Board } from "@/board/index";
import { Grid } from "@/moves/piece";
import { Position, SquareID } from "@/utils/interfaces";
import React, { useState } from "react";
import { RenderPiece } from "../pieces";
import { Square } from "../square/index";
import styles from "./gameFrame.module.css";

interface GameBoardFramProps {
  board: Board;
  gridDomRefs: React.RefObject<HTMLDivElement>[][];
  hover: (position: Position) => void;
  unHover: (position: Position) => void;
  drop: (position: Position) => boolean;
  select: (position: Position) => void;
  setCurrPlayer: (currentPlayer: SquareID.BLACK | SquareID.WHITE) => void;
}

export const GameBoardFrame: React.FC<GameBoardFramProps> = ({
  board,
  gridDomRefs,
  hover,
  unHover,
  drop,
  select,
  setCurrPlayer,
}) => {
  const [grid, setGrid] = useState<Grid>(board.grid);
  const updateGrid = (position: Position) => {
    if (drop(position)) {
      setGrid([...board.grid.map((row) => [...row])]);
      setCurrPlayer(board.player);
    }
  };
  let index = 0;
  return (
    <div className={styles.gameboard_container}>
      <div className={styles.gameboard}>
        {grid.map((row, rowIndex) =>
          row.map((square, colIndex) => {
            const squareKey = `${rowIndex},${colIndex}`;
            const piece = board.grid[rowIndex][colIndex];
            return (
              <Square
                key={squareKey}
                squareKey={squareKey}
                pieceId={index++}
                squareRef={gridDomRefs[rowIndex][colIndex]}
                onHoverSquare={hover}
                onUnHoverSquare={unHover}
                color={piece.color}
                onDropSquare={updateGrid}
                onSelectSquare={select}
                position={piece.getPosition()}
                pieceType={piece.code}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
