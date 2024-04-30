import React, { useRef } from "react";
import styles from "./game_board.module.css";
import { Square, PieceType, SquareID } from "../square/index";
import SideTab from "../game_side/index";
import { useGameBoardManagement } from "@/hooks/GameManagement";
import { useBoardManagement } from "@/hooks/GameMovement";
import { Grid } from "@/moves/piece";
import { Position } from "@/utils/interfaces";
import { Board } from "@/board/index";
import { useState } from "react";

interface GameBoardFramProps {
  board: Board;
  hover: (position: Position) => void;
  unHover: (position: Position) => void;
  drop: (position: Position) => boolean;
  select: (position: Position) => void;
  setCurrPlayer: (currentPlayer: SquareID.BLACK | SquareID.WHITE) => void;
}

const GameBoardFrame: React.FC<GameBoardFramProps> = ({
  board,
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
                pieceId={piece.pieceId}
                type={piece.code}
                squareRef={piece.squareRef}
                onHoverSquare={hover}
                onUnHoverSquare={unHover}
                playerId={piece.color}
                onDropSquare={updateGrid}
                onSelectSquare={select}
                position={piece.getPosition()}
                component={piece.getComponent()}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

const GameBoard: React.FC = () => {
  const currPlayer = useRef<SquareID.BLACK | SquareID.WHITE>(SquareID.BLACK);
  const board = useGameBoardManagement(currPlayer.current);

  const setCurrPlayer = (currentPlayer: SquareID.BLACK | SquareID.WHITE) => {
    currPlayer.current = currentPlayer;
  };
  const [hover, unHover, select, drop] = useBoardManagement(board);
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <GameBoardFrame
            hover={hover}
            unHover={unHover}
            select={select}
            drop={drop}
            board={board}
            setCurrPlayer={setCurrPlayer}
          />
          <div className="text-center mt-4">
            <button className="btn btn-danger">Exit</button>
          </div>
        </div>
        <div className="col-md-4">
          <SideTab />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
