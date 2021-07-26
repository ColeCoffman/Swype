import React, { useState, useRef} from "react";
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
import { setPersistantData } from "../context/Storage";
import BottomBar from "../components/BottomBar";
import Swipes from "../components/Swipes";

import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

export default function MainScreen({ navigation }) {
  const [token, setToken] = useState("");
  const swipesRef = useRef(null);
  const onSwipeUp = (gestureState) => {
    setPersistantData("newComments", "1");
    navigation.navigate("mainScreenStack", { screen: "Comments" });
  };
  // Get Token and set state
  getPersistantData("token")
    .then((result) => {
      setToken(result);
    })
    .catch((err) => console.error(err));

    const [postId, setPostId] = useState("");

    // placeholder setPers
  setPersistantData("postId", "60eca4049a0c8f0015b69b56");
  //const [postId, setPostId] = useState("");
  getPersistantData("postId")


  function handleLike() {
    console.log('like')
    swipesRef.current.close()
  }

  function handleDislike() {
    console.log('dislike')
    swipesRef.current.close()
  }

  return (
    // Container View
    <GestureRecognizer
      onSwipeUp={(state) => onSwipeUp(state)}
      config={config}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style ={styles.swipes}> 
           <Swipes
            ref={swipesRef}
            handleLike={handleLike}
            handleDislike={handleDislike}
            >
          </Swipes>
        </View>
      </View>
  </GestureRecognizer>    
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },

  swipes: {
    flex: 1,
    padding: 10,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
})

