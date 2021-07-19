import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { RectButton} from "react-native-gesture-handler";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeableImage from "./SwipeableImage";
import {
    ActivityIndicator,
    Button,
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
  } from "react-native";


  
  export default function Swipes() {

    const [willLike, setWillLike] = useState(false)
    const [willPass, setWillPass] = useState(false)

    const renderLeftActions = () => {
        return (
            // We can pass in the address of the next image in this swipeable call, and it will
            // render under the current image when it is dragged
          <RectButton style={styles.container}>
            <SwipeableImage></SwipeableImage> 
          </RectButton>
        )
      }

      const renderRightActions = () => {
        return (
            // We can pass in the address of the next image in this swipeable call, and it will
            // render under the current image when it is dragged
          <RectButton style={styles.container}>
            <SwipeableImage></SwipeableImage> 
          </RectButton>
        )
      }


      return (
        <Swipeable
            
            friction={2}
            leftThreshold={20}
            rightThreshold={20}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableLeftOpen={() => {
            setWillLike(false)
            // add Like function
            }}
            onSwipeableRightOpen={() => {
            setWillPass(false)
            //add dislike Function
            }}
            onSwipeableLeftWillOpen={() => setWillLike(true)}
            onSwipeableRightWillOpen={() => setWillPass(true)}
        >
        <SwipeableImage  willLike={willLike} willPass={willPass}/>
      </Swipeable>
      )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  })

  