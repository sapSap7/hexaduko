import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface KeyboardProps {
  onKeyPress: (key: number) => void;
  disabledKeys?: number[];
}

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  disabledKeys = [],
}) => {
  const numbers = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <View style={styles.keyboardContainer}>
      {numbers.map((number) => (
        <TouchableOpacity
          key={number}
          onPress={() => onKeyPress(number)}
          disabled={disabledKeys.includes(number)}
          style={[
            styles.key,
            disabledKeys.includes(number) && styles.disabledKey,
          ]}
        >
          <Text style={styles.keyText}>{number}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
    padding: 5,
    maxWidth: 600,
    marginVertical: 20,
    alignSelf: "center",
  },
  key: {
    width: "22%", // Adjust for desired number of columns (e.g., ~100/4)
    aspectRatio: 1, // Makes the button square
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f7f7f7",
  },
  disabledKey: {
    backgroundColor: "#d3d3d3",
  },
  keyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Keyboard;
