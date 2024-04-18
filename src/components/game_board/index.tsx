import React, { useRef } from "react";
import styles from "./game_board.module.css";
import { Square, PieceType, SquareID } from "../square/index";
import SideTab from "../game_side/index";
import { useGrid, usePlayerManagement } from "@/hooks/GameMovement";

const GameBoard: React.FC = () => {
  const [grid, setPrevPosition, setCurrPosition, squareRefs] = useGrid();
  const [setHoverPosition, unHoverPosition] = usePlayerManagement(squareRefs);
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className={styles.gameboard_container}>
            <div className={styles.gameboard}>
              {grid.map((row, rowIndex) =>
                row.map((square, colIndex) => {
                  const [type, playerId] = square.split(",");
                  const squareKey = `${rowIndex},${colIndex}`;
                  return (
                    <Square
                      key={squareKey}
                      squareKey={squareKey}
                      type={type as PieceType}
                      squareRef={squareRefs?.current[rowIndex][colIndex]}
                      onHoverSquare={setHoverPosition}
                      onUnHoverSquare={unHoverPosition}
                      playerId={playerId as SquareID}
                      onDropSquare={setCurrPosition}
                      onSelectSquare={setPrevPosition}
                    />
                  );
                })
              )}
            </div>
          </div>
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
