import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { getPersistantData } from "../context/Storage";

export default function MainScreen() {
  const [token, setToken] = useState("");

  // Get Token and set state
  getPersistantData("token")
    .then((result) => {
      setToken(result);
    })
    .catch((err) => console.error(err));

  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Token: {token}</Text>
      <Button title="To Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}
