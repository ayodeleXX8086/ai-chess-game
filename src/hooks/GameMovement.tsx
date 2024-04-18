import React from "react";
import { useEffect, useRef, useState } from "react";
import { GRID, EMPTY_SQUARE } from "@/utils/utilites";
import { Position, SquareID } from "@/utils/interfaces";
import styles from "../global.module.css";

const useBoardManagement = (): [
  string[][],
  React.Dispatch<React.SetStateAction<{ row: number; col: number }>>,
  React.Dispatch<React.SetStateAction<{ row: number; col: number }>>,
  React.MutableRefObject<React.RefObject<any>[][]>
] => {
  const [grid, setGrid] = useState(GRID);
  const [prevPosition, setPrevPosition] = useState({ row: 0, col: 0 });
  const [currPosition, setCurrPosition] = useState({ row: 0, col: 0 });
  const squareRefs = useRef<any[][]>([]);
  const initializeRefs = () => {
    let gridOfRefs: any[][] = [];
    let gridLength = grid.length;
    for (let i = 0; i < gridLength; i++) {
      let row: any[] = [];
      for (let j = 0; j < gridLength; j++) {
        row.push(React.createRef()); // Replace MyClass with the class you want to instantiate
      }
      gridOfRefs.push(row);
      squareRefs.current = gridOfRefs;
    }
  };
  initializeRefs();
  useEffect(() => {
    const newGrid = grid.map((columns) => columns.slice());
    const prevId = newGrid[prevPosition.row][prevPosition.col];
    newGrid[prevPosition.row][prevPosition.col] = EMPTY_SQUARE;
    newGrid[currPosition.col][currPosition.row] = prevId;
    setGrid(newGrid);
  }, [currPosition]);

  return [grid, setPrevPosition, setCurrPosition, squareRefs];
};

const usePlayerManagement = (squareRefs: any) => {
  const [hoverPosition, setHoverPosition] = useState(null);
  const [unHoverPosition, setUnHoverPosition] = useState(null);
  // Function to add a class name to a square
  const addClassNameToSquare = (
    rowIndex: number,
    colIndex: number,
    className: string
  ) => {
    if (
      squareRefs.current[rowIndex] &&
      squareRefs.current[rowIndex][colIndex]
    ) {
      squareRefs.current[rowIndex][colIndex].current?.classList.add(className);
    }
  };

  // Function to remove a class name from a square
  const removeClassNameFromSquare = (
    rowIndex: number,
    colIndex: number,
    className: string
  ) => {
    if (
      squareRefs.current[rowIndex] &&
      squareRefs.current[rowIndex][colIndex]
    ) {
      squareRefs.current[rowIndex][colIndex].current?.classList.remove(
        className
      );
    }
  };

  useEffect(() => {
    if (hoverPosition) {
      const { row, col } = hoverPosition;
      console.log("Effect ", row, col, squareRefs?.current[row][col]);
      if (squareRefs?.current[row] && squareRefs?.current[row][col]) {
        addClassNameToSquare(row, col, styles.highlighted_blue);
      }
    }
  }, [hoverPosition]);

  useEffect(() => {
    if (unHoverPosition) {
      const { row, col } = unHoverPosition;
      if (
        squareRefs?.current[col] &&
        squareRefs?.current[row][col]?.current?.classList.contains(
          styles.highlighted_blue
        )
      ) {
        removeClassNameFromSquare(row, col, styles.highlighted_blue);
      }
    }
  }, [unHoverPosition]);

  return [setHoverPosition, setUnHoverPosition];
};

export { useBoardManagement as useGrid, usePlayerManagement };
