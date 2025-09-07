import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { N as GRID_SIZE } from "@/scripts/backtracking";

const SUBGRID_SIZE = 4;
const { width, height } = Dimensions.get("window");

// Calculate the maximum size for the grid to fit on the screen
const availableWidth = width - 40;
const availableHeight = height - 40;
const gridSize = Math.min(availableWidth, availableHeight);

const CELL_SIZE = Math.floor(gridSize / GRID_SIZE);

type SudokuGridProps = {
  board: (number | null)[][];
  onCellPress?: (row: number, col: number) => void;
  selectedCell?: { row: number; col: number } | null;
  mistakes?: Set<string>;
  fixedCells?: Set<string>;
  highlightedRows?: Set<number>;
  highlightedCols?: Set<number>;
  highlightedBoxes?: Set<string>;
  highlightColor?: string;
};

const SudokuGrid: React.FC<SudokuGridProps> = ({
  board,
  onCellPress,
  selectedCell,
  mistakes = new Set(),
  fixedCells = new Set(),
  highlightedRows = new Set(),
  highlightedCols = new Set(),
  highlightedBoxes = new Set(),
  highlightColor = "#d6e4ff",
}) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.grid}>
        {board.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isSelected =
                selectedCell?.row === rowIndex &&
                selectedCell?.col === colIndex;

              const isMistake = mistakes.has(`${rowIndex}-${colIndex}`);
              const isFixed = fixedCells.has(`${rowIndex}-${colIndex}`);

              const boxKey = `${rowIndex - (rowIndex % SUBGRID_SIZE)}-${
                colIndex - (colIndex % SUBGRID_SIZE)
              }`;

              const isHighlighted =
                highlightedRows.has(rowIndex) ||
                highlightedCols.has(colIndex) ||
                highlightedBoxes.has(boxKey);

              const animatedValue = useRef(new Animated.Value(0)).current;

              useEffect(() => {
                if (isHighlighted) {
                  Animated.sequence([
                    Animated.timing(animatedValue, {
                      toValue: 1,
                      duration: 300,
                      useNativeDriver: false,
                    }),
                    Animated.timing(animatedValue, {
                      toValue: 0,
                      duration: 300,
                      delay: 500,
                      useNativeDriver: false,
                    }),
                  ]).start();
                }
              }, [isHighlighted]);

              const backgroundColor = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["#fff", highlightColor],
              });

              const cellStyle = [
                styles.cell,
                {
                  borderTopWidth: rowIndex % SUBGRID_SIZE === 0 ? 2 : 1,
                  borderLeftWidth: colIndex % SUBGRID_SIZE === 0 ? 2 : 1,
                  borderBottomWidth: rowIndex === GRID_SIZE - 1 ? 2 : 0,
                  borderRightWidth: colIndex === GRID_SIZE - 1 ? 2 : 0,
                  transform: [{ scale: isSelected ? 1.2 : 1 }],
                  backgroundColor: isSelected
                    ? "#d6e4ff"
                    : isHighlighted
                    ? highlightColor
                    : "#fff",
                },
              ];

              const displayValue =
                cell === 0 || cell === null ? "" : cell.toString();

              return (
                <Pressable
                  key={`cell-${rowIndex}-${colIndex}`}
                  onPress={() => !isFixed && onCellPress?.(rowIndex, colIndex)}
                >
                  <Animated.View style={[cellStyle, { backgroundColor }]}>
                    <Text
                      style={[
                        styles.cellText,
                        isFixed && { color: "#000", fontWeight: "bold" },
                        isMistake && { color: "red" },
                      ]}
                    >
                      {displayValue}
                    </Text>
                  </Animated.View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#66B2FF",
  },
  grid: {
    flexDirection: "column",
    borderColor: "#333",
    borderWidth: 2,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cellText: {
    fontSize: CELL_SIZE * 0.5,
    fontWeight: "bold",
    color: "#333",
  },
});

export default SudokuGrid;
