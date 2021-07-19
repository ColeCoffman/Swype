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
import BottomBar from "../components/BottomBar";
import Swipes from "../components/Swipes";

let imagePath = require("../assets/placeholder3.jpg");


export default function MainScreen({ navigation }) {
  const [token, setToken] = useState("");
  const swipesRef = useRef(null);

  // Get Token and set state
  getPersistantData("token")
    .then((result) => {
      setToken(result);
    })
    .catch((err) => console.error(err));

  return (
    <View style={styles.container}>
      <View style ={styles.swipes}> 
                  <Swipes>
                  </Swipes>
      </View>
      <View>
        <BottomBar />
      </View>
    </View>
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

