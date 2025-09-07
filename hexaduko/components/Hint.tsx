import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

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

    setBoard(newBoard);
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={giveHint}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>Get Hint</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4da6ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: "center",
  },
  disabledButton: {
    backgroundColor: "#b3d9ff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Hint;
