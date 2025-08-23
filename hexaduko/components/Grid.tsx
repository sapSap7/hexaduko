import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { generateSudoku } from "../scripts/backtracking";

const GRID_SIZE = 16;
const SUBGRID_SIZE = 4;
const { width, height } = Dimensions.get("window");

// Calculate the maximum size for the grid to fit on the screen
const availableWidth = width - 40; // Adjust padding as needed
const availableHeight = height - 40; // Adjust padding as needed
const gridSize = Math.min(availableWidth, availableHeight);

const CELL_SIZE = Math.floor(gridSize / GRID_SIZE);

const SudokuGrid = () => {
  const [grid, setGrid] = useState<number[][]>([]);

  useEffect(() => {
    const { puzzleBoard } = generateSudoku(160); // medium difficulty
    setGrid(puzzleBoard);
  }, []);

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.row}>
        {row.map((cell, colIndex) => {
          const cellStyle = [
            styles.cell,
            {
              borderTopWidth: rowIndex % SUBGRID_SIZE === 0 ? 2 : 1,
              borderLeftWidth: colIndex % SUBGRID_SIZE === 0 ? 2 : 1,
              borderBottomWidth: rowIndex === GRID_SIZE - 1 ? 2 : 0,
              borderRightWidth: colIndex === GRID_SIZE - 1 ? 2 : 0,
            },
          ];

          const displayValue =
            cell === 0 || cell === null ? "" : cell.toString();

          return (
            <ThemedView key={`cell-${rowIndex}-${colIndex}`} style={cellStyle}>
              <Text style={styles.cellText}>{displayValue}</Text>
            </ThemedView>
          );
        })}
      </View>
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.grid}>
        {grid.length > 0 && renderGrid()}
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
