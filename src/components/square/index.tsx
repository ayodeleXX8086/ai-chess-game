import { Position, SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";
import React, { useRef } from "react";
import styles from "./chess_piece.module.css";

interface SquareProps {
  type: PieceType;
  squareKey: string;
  squareRef: React.Ref<any>;
  playerId: SquareID;
  component: JSX.Element;
  position: Position;
  pieceId: number;
  onSelectSquare?: (position: Position) => void;
  onDropSquare?: (position: Position) => void;
  onHoverSquare?: (position: Position) => void;
  onUnHoverSquare?: (position: Position) => void;
}

const SquareComponent: React.FC<SquareProps> = ({
  type,
  squareKey,
  squareRef,
  playerId,
  component,
  position,
  pieceId,
  onSelectSquare,
  onDropSquare,
  onHoverSquare,
  onUnHoverSquare,
}) => {
  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    //event.preventDefault();
    const { row, col } = position;
    onSelectSquare?.({ row, col });
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { row, col } = position;
    onDropSquare?.({ row, col });
  };

  const onHover = (event: React.DragEvent<HTMLDivElement>) => {
    const { row, col } = position;
    onHoverSquare?.({ row, col });
  };

  const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onUnHover = (event: React.DragEvent<HTMLDivElement>) => {
    const { row, col } = position;
    onUnHoverSquare?.({ row, col });
  };
  const { row } = position;
  const squareColor = (row % 2 === 0 ? pieceId % 2 === 0 : pieceId % 2 !== 0)
    ? styles.beige
    : styles.brown;

  return (
    <section
      className={`${styles.square} ${squareColor}`}
      id={pieceId + ""}
      key={squareKey}
      ref={squareRef}
      onDragStart={onDrag}
      onDragOver={allowDrop}
      onMouseEnter={onHover}
      onMouseLeave={onUnHover}
      draggable
      onDrop={onDrop}
    >
      {component}
    </section>
  );
};

const Square = React.memo(SquareComponent);
export { Square, SquareID, PieceType };
