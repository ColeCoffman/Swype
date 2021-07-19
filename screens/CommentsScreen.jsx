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
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

export default function CommentsScreen({ navigation }) {
  const onSwipeDown = (gestureState) => {
    navigation.navigate("mainScreenStack", { screen: "Posts" });
  };
  return (
    // Container View
    <GestureRecognizer
      onSwipeDown={(state) => onSwipeDown(state)}
      config={config}
      style={{
        flex: 1,
      }}
    >
      <View>
        <Text>Comment Screen</Text>
      </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#00ff",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#007",
  },
  loginText: {
    color: "white",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});
