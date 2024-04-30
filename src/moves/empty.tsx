import { Board } from "@/board/index";
import { EmptyPiece } from "@/components/pieces/index";
import { Position, SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";
import { Piece } from "./index";
import { PieceProps } from "./piece";

export class Empty extends Piece {
  constructor(props: PieceProps) {
    super(props);
    this.color = SquareID.EMPTY;
    this.code = PieceType.EMPTY;
    this.component = EmptyPiece;
  }

  getComponent() {
    return this.component();
  }

  getMoves(board: Board): [Position[], Position[]] {
    return [[], []];
  }
}
