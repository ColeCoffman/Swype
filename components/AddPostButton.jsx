import * as React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
// Using font awesome for the icon
import { FontAwesome5, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/core";

export function HeaderButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("mainScreenStack", { screen: "AddPost" })
      }
    >
      <FontAwesome5 name="plus-square" size={35} color="white"></FontAwesome5>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  Text: {
    color: "white",
  },
});
