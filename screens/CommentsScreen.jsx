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
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};
// load in comment data using post ID
/*const DATA{id, title} = {
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
  },
};*/
// load in end
export default function CommentsScreen({ navigation }) {
  const [comment, setComment] = useState("");
  // pass it the array returned by api
  const [allComments, setComments] = useState([]);
  const [currentID, setID] = useState(null);

  const onSwipeDown = (gestureState) => {
    navigation.navigate("mainScreenStack", { screen: "Main" });
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
      <View style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Comment"
            placeholderTextColor="black"
            autoCapitalize="none"
            onChangeText={(commentInput) => setComment(commentInput)}
          />
          <TouchableOpacity style={styles.commentBtn} /*onPress={() => LoginHandler()}api for creating comment*/>
          <Text style={styles.commentText}>COMMENT</Text>
          </TouchableOpacity>
        </View>
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
  commentBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#007",
  },
  commentText: {
    color: "white",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});
