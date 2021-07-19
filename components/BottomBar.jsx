import React, { useState } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
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
  
  export default function BottomBar() {
      return (
        <View style={styles.container}>
        <View />
        <TouchableOpacity style={styles.button}>
          <FontAwesome name="times" size={27} color="#F06795"></FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="comment-dots" size={27} color="black" ></FontAwesome5>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <FontAwesome name="heart" size={27} color="#00ccff" ></FontAwesome>
        </TouchableOpacity>
        <View />
      </View>
      )
  }
  
  const styles = StyleSheet.create({
    container: {
      height: 75,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    button: {
      width: 50,
      height: 50,
      backgroundColor: 'white',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.46,
      elevation: 9,
    },
  })