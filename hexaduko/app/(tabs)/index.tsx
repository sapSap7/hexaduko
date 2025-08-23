import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";
import SudokuGrid from "@/components/Grid";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Hint from "@/components/Hint";
import { useState } from "react";

export default function HomeScreen() {
  const initialBoard = Array(16).fill(Array(16).fill(null));
  const [board, setBoard] = useState(initialBoard);
  const solution = initialBoard; // Replace with actual solution
  return (
    <ThemedView>
      <SudokuGrid />
      <Hint board={board} setBoard={setBoard} solution={solution} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    margin: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
