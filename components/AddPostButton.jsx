import * as React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
// Using font awesome for the icon
import{FontAwesome5, FontAwesome, MaterialIcons} from'@expo/vector-icons'

export function HeaderButton() {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("mainScreenStack", { screen: "AddPost" })}>
      <FontAwesome5 name = "plus-square" size = {35} color = "white"></FontAwesome5>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  Text: {
    color: "white",
  },
});
