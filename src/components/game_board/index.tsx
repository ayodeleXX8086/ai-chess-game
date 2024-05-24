import React, { useRef, useState } from "react";
import { PieceType, SquareID } from "../square/index";
import { ChessPieceDialog } from "../dialog/component";
import {
  useGridInitializationDomRef,
  useGameBoardManagement,
} from "@/hooks/GameManagement";
import { useBoardManagement } from "@/hooks/GameMovement";
import { GameBoardContent } from "./component";

const GameBoard: React.FC = () => {
  const gridDomRefs: React.RefObject<HTMLDivElement>[][] =
    useGridInitializationDomRef();
  const currPlayer = useRef<SquareID.BLACK | SquareID.WHITE>(SquareID.BLACK);
  const [board, updateBoard] = useGameBoardManagement(
    currPlayer.current,
    gridDomRefs
  );

  const setCurrPlayer = (currentPlayer: SquareID.BLACK | SquareID.WHITE) => {
    currPlayer.current = currentPlayer;
  };
  const [hover, unHover, select, drop] = useBoardManagement(
    board,
    updateBoard,
    gridDomRefs
  );
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const onClose = () => {
    setShowPopup(false);
  };
  const onSelectPiece = (pieceType: PieceType) => {
    setShowPopup(false);
  };
  return (
    <>
      <GameBoardContent
        hover={hover}
        unHover={unHover}
        select={select}
        drop={drop}
        board={board}
        setCurrPlayer={setCurrPlayer}
        gridDomRefs={gridDomRefs}
        onClickExit={() => setShowPopup(true)}
      />
      {showPopup && (
        <ChessPieceDialog
          onClose={onClose}
          onSelectPiece={onSelectPiece}
          pieceColor={board.player}
          show={showPopup}
        />
      )}
    </>
  );
};

export default GameBoard;
