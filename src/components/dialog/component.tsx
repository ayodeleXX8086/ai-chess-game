import React from "react";
import { Modal } from "react-bootstrap";
import styles from "./Modal.module.css";
import {
  KingComponent,
  QueenComponent,
  RookComponent,
  BishopComponent,
  KnightComponent,
} from "../pieces/index";
import { PieceType } from "../square/index";

interface ChessPieceDialogProps {
  pieceColor: string;
  show: boolean;
  onClose: () => void;
  onSelectPiece: (pieceType: PieceType) => void;
}

export const ChessPieceDialog: React.FC<ChessPieceDialogProps> = ({
  pieceColor,
  show,
  onClose,
  onSelectPiece,
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Chess Piece</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          onClick={() => onSelectPiece(PieceType.KING)}
          className={styles.square}
        >
          <KingComponent color={pieceColor} />
        </div>
        <div
          onClick={() => onSelectPiece(PieceType.QUEEN)}
          className={styles.square}
        >
          <QueenComponent color={pieceColor} />
        </div>
        <div
          onClick={() => onSelectPiece(PieceType.ROOK)}
          className={styles.square}
        >
          <RookComponent color={pieceColor} />
        </div>
        <div
          onClick={() => onSelectPiece(PieceType.BISHOP)}
          className={styles.square}
        >
          <BishopComponent color={pieceColor} />
        </div>
        <div
          onClick={() => onSelectPiece(PieceType.KNIGHT)}
          className={styles.square}
        >
          <KnightComponent color={pieceColor} />
        </div>
      </Modal.Body>
      <Modal.Footer>{/* Add footer content if needed */}</Modal.Footer>
    </Modal>
  );
};
