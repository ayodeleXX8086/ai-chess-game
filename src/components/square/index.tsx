import { Position, SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";
import React, { useRef } from "react";
import { RenderPiece } from "../pieces";
import styles from "./chess_piece.module.css";

interface SquareProps {
  squareKey: string;
  color: string;
  squareRef: React.Ref<any>;
  pieceType: PieceType;
  position: Position;
  pieceId: number;
  onSelectSquare?: (position: Position) => void;
  onDropSquare?: (position: Position) => void;
  onHoverSquare?: (position: Position) => void;
  onUnHoverSquare?: (position: Position) => void;
}

const SquareComponent: React.FC<SquareProps> = ({
  squareKey,
  squareRef,
  color,
  pieceType,
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
      <RenderPiece color={color} pieceType={pieceType} />
    </section>
  );
};

const Square = React.memo(SquareComponent);
export { Square, SquareID, PieceType };
