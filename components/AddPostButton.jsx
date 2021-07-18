import * as React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export function HeaderButton() {
  return (
    <TouchableOpacity style={styles.addPostBTN}>
      <Text style={styles.Text}>Add Post</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addPostBTN: {
    width: "200%",
    borderRadius: 25,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007",
  },
  Text: {
    color: "white",
  },
});
