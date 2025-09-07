import { StyleSheet, Alert, Text, Animated } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import SudokuGrid from "@/components/Grid";
import Hint from "@/components/Hint";
import Keyboard from "@/components/Keyboard";
import { useState, useEffect, useRef } from "react";
import {
  generateSudoku,
  isBoardSolved,
  isBoxCorrect,
  isColCorrect,
  isRowCorrect,
  BOX_SIZE,
} from "@/scripts/backtracking";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const [solution, setSolution] = useState<number[][]>([]);
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [fixedCells, setFixedCells] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState<Set<string>>(new Set());
  const [mistakeCount, setMistakeCount] = useState(0);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [highlightedRows, setHighlightedRows] = useState<Set<number>>(
    new Set()
  );
  const [highlightedCols, setHighlightedCols] = useState<Set<number>>(
    new Set()
  );
  const [highlightedBoxes, setHighlightedBoxes] = useState<Set<string>>(
    new Set()
  );

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const { puzzleBoard, solvedBoard } = generateSudoku(160);
    setSolution(solvedBoard);
    setBoard(puzzleBoard);

    const fixed = new Set<string>();
    puzzleBoard.forEach((row: (number | null)[], r: number) =>
      row.forEach((cell: number | null, c: number) => {
        if (cell !== 0 && cell !== null) {
          fixed.add(`${r}-${c}`);
        }
      })
    );
    setFixedCells(fixed);
    setMistakes(new Set());
    setMistakeCount(0);
    setSelectedCell(null);
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCellPress = (row: number, col: number) => {
    if (!fixedCells.has(`${row}-${col}`)) {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyPress = (key: number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const cellKey = `${row}-${col}`;

      if (fixedCells.has(`${row}-${col}`)) return;

      const newBoard = [...board];
      newBoard[row][col] = key;
      setBoard(newBoard);

      const updatedMistakes = new Set(mistakes);

      if (solution[row][col] !== key) {
        updatedMistakes.add(cellKey);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        triggerShake();
        setMistakeCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            Alert.alert("Game Over", "You made 5 mistakes!", [
              { text: "Restart", onPress: () => startNewGame() },
            ]);
          }
          return newCount;
        });
      } else {
        updatedMistakes.delete(cellKey);
      }
      setMistakes(updatedMistakes);

      if (isRowCorrect(newBoard, solution, row)) {
        setHighlightedRows((prev) => new Set([...prev, row]));
        setTimeout(() => {
          setHighlightedRows((prev) => {
            const copy = new Set(prev);
            copy.delete(row);
            return copy;
          });
        }, 800);
      }

      if (isColCorrect(newBoard, solution, col)) {
        setHighlightedCols((prev) => new Set([...prev, col]));
        setTimeout(() => {
          setHighlightedCols((prev) => {
            const copy = new Set(prev);
            copy.delete(col);
            return copy;
          });
        }, 800);
      }

      if (isBoxCorrect(newBoard, solution, row, col)) {
        const boxKey = `${row - (row % BOX_SIZE)}-${col - (col % BOX_SIZE)}`;
        setHighlightedBoxes((prev) => new Set([...prev, boxKey]));
        setTimeout(() => {
          setHighlightedBoxes((prev) => {
            const copy = new Set(prev);
            copy.delete(boxKey);
            return copy;
          });
        }, 800);
      }
      if (isBoardSolved(newBoard, solution)) {
        alert("Congratulations! You've solved the puzzle!");
      }

      setSelectedCell(null);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.Text
        style={[styles.mistakes, { transform: [{ translateX: shakeAnim }] }]}
      >
        Mistakes: {mistakeCount}/5
      </Animated.Text>
      <SudokuGrid
        board={board}
        onCellPress={handleCellPress}
        selectedCell={selectedCell}
        mistakes={mistakes}
        fixedCells={fixedCells}
        highlightedRows={highlightedRows}
        highlightedCols={highlightedCols}
        highlightedBoxes={highlightedBoxes}
        highlightColor="#bbeee9e3"
      />
      <Hint board={board} setBoard={setBoard} solution={solution} />
      <Keyboard onKeyPress={handleKeyPress} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    margin: 20,
  },
  mistakes: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
    textAlign: "center",
  },
});
