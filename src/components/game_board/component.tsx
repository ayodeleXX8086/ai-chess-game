import { Board } from "@/board/index";
import { Position, SquareID } from "@/utils/interfaces";
import React from "react";
import { GameBoardFrame } from "@/components/gameFrame/index";
import SideTab from "@/components/game_side/index";

interface GameBoardContentProps {
  hover: (position: Position) => void;
  unHover: (position: Position) => void;
  select: (position: Position) => void;
  drop: (position: Position) => boolean;
  board: Board;
  setCurrPlayer: (currentPlayer: SquareID.BLACK | SquareID.WHITE) => void;
  gridDomRefs: React.RefObject<HTMLDivElement>[][];
  onClickExit: () => void;
}

export const GameBoardContent: React.FC<GameBoardContentProps> = ({
  hover,
  unHover,
  select,
  drop,
  board,
  setCurrPlayer,
  gridDomRefs,
  onClickExit,
}) => {
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
            gridDomRefs={gridDomRefs}
          />
          <div className="text-center mt-4">
            <button
              className="btn btn-danger"
              onClick={() => {
                onClickExit();
              }}
            >
              Exit
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <SideTab />
        </div>
      </div>
    </div>
  );
};
