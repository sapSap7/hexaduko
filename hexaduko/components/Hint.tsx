import React from "react";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";

// hint component - reveal a correct number from final solution
type Board = (number | null)[][];

interface HintProps {
  board: Board;
  solution: Board;
  setBoard: (board: Board) => void;
  disabled?: boolean;
}

const Hint: React.FC<HintProps> = ({ board, solution, setBoard, disabled }) => {
  const giveHint = () => {
    const emptyCells: { row: number; col: number }[] = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return; // No empty cells to provide a hint for
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = board.map((row) => [...row]);
    newBoard[randomCell.row][randomCell.col] =
      solution[randomCell.row][randomCell.col];
  };

  return (
    <TouchableOpacity onPress={giveHint} disabled={disabled}>
      <Image
        source={require("../assets/images/lightbulb.jpeg")}
        style={{ width: 40, height: 40 }}
        contentFit="contain"
      />
    </TouchableOpacity>
  );
};

export default Hint;
