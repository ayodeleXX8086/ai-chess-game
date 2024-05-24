import { Board } from "@/board/index";
import { Position, SquareID } from "@/utils/interfaces";
import { PieceType } from "@/utils/utilites";
import { Piece } from "./index";
import { PieceProps } from "./piece";

export class Empty extends Piece {
  constructor(props: PieceProps) {
    super(props);
    this.color = SquareID.EMPTY;
    this.move = this.code = PieceType.EMPTY;
  }

  getMoves(board: Board): [Position[], Position[]] {
    return [[], []];
  }
}
