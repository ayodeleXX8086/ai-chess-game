"use client";
import styles from "./game.module.css";
import GameBoard from "@/components/game_board/index";

export default function Game() {
  return (
    <section className={"container" + " " + styles.gameboard_top}>
      <GameBoard />
    </section>
  );
}
