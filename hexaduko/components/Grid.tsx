import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const GRID_SIZE = 16;
const SUBGRID_SIZE = 4;
const { width } = Dimensions.get("window");
const CELL_SIZE = Math.floor((width - 40) / GRID_SIZE); // Adjust padding as needed

// Create an empty 16x16 grid for demonstration
const initialGrid = Array(GRID_SIZE)
  .fill(null)
  .map(() => Array(GRID_SIZE).fill(null));

const SudokuGrid = () => {
  const renderGrid = () => {
    return initialGrid.map((row, rowIndex) => (
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

          return (
            <ThemedView key={`cell-${rowIndex}-${colIndex}`} style={cellStyle}>
              <Text style={styles.cellText}>{cell}</Text>
            </ThemedView>
          );
        })}
      </View>
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.grid}>{renderGrid()}</ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
