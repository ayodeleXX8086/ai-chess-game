import { Position } from "@/utils/interfaces";
import React, { useRef } from "react";
import {
  Queen,
  King,
  Bishop,
  EmptyBoard,
  Knight,
  Pawn,
  Rook,
} from "../pieces/index";
import styles from "./chess_piece.module.css";

enum PieceType {
  KING = "KING",
  QUEEN = "QUEEN",
  ROOK = "ROOK",
  BISHOP = "BISHOP",
  PAWN = "PAWN",
  KNIGHT = "KNIGHT",
  EMPTY = "EMPTY",
}

enum SquareID {
  BLACK = "black",
  WHITE = "white",
  EMPTY = "empty",
}

interface SquareProps {
  type: PieceType;
  squareKey: string;
  squareRef: React.Ref<any>;
  playerId?: SquareID;
  onSelectSquare?: (position: Position) => void;
  onDropSquare?: (position: Position) => void;
  onHoverSquare?: any;
  onUnHoverSquare?: any;
}

const SquareComponent: React.FC<SquareProps> = ({
  type,
  squareKey,
  squareRef,
  playerId,
  onSelectSquare,
  onDropSquare,
  onHoverSquare,
  onUnHoverSquare,
}) => {
  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    //event.preventDefault();
    const [row, col] = squareKey.split(",").map(Number);
    console.log("Dragging Row ", row, "Col ", col);
    onSelectSquare?.({ row: row, col: col });
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const [row, col] = squareKey.split(",").map(Number);
    console.log("Dropping Row", row, "col", col);
    onDropSquare?.({ row: row, col: col });
  };

  const onHover = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const [row, col] = squareKey.split(",").map(Number);
    console.log("Hover on Square", row, col);
    onHoverSquare?.({ x: row, y: col });
  };

  const onUnHover = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const [row, col] = squareKey.split(",").map(Number);
    console.log("unHover on Square", row, col);
    onUnHoverSquare?.({ x: row, y: col });
  };

  const getPieceComponent = () => {
    switch (type) {
      case PieceType.KING:
        return King;
      case PieceType.QUEEN:
        return Queen;
      case PieceType.ROOK:
        return Rook;
      case PieceType.BISHOP:
        return Bishop;
      case PieceType.PAWN:
        return Pawn;
      case PieceType.KNIGHT:
        return Knight;
      default:
        return EmptyBoard;
    }
  };

  const myElementRef = useRef(null);

  const PieceComponent = getPieceComponent();
  const id = playerId ? `${type}-${playerId}` : "empty";
  const [row, col] = squareKey.split(",").map(Number);
  const index = row * 8 + col;
  const squareColor = (row % 2 === 0 ? index % 2 === 0 : index % 2 !== 0)
    ? styles.beige
    : styles.brown;

  return (
    <section
      className={`${styles.square} ${squareColor}`}
      id={id}
      key={squareKey}
      ref={squareRef}
      onDragStart={onDrag}
      onDrop={onDrop}
      onMouseEnter={onHover}
      onMouseLeave={onUnHover}
    >
      {playerId !== SquareID.EMPTY && (
        <PieceComponent color={playerId as string} />
      )}
    </section>
  );
};

const Square = React.memo(SquareComponent);
export { Square, SquareID, PieceType };
