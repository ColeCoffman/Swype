import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
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

  let imagePath = require("../assets/placeholder3.jpg");
  

  export default function SwipeableImage({willLike, willPass}) {


      return (
          <View>
              <Image source={imagePath} style ={styles.photo}></Image>
                
                {willLike && 
                    <View style={styles.likeBox}>
                    <Text style={{ ...styles.textPrimary, color: '#00ccff' }}>Like</Text>
                    </View>
                }
                {willPass &&(
                    <View style={styles.passBox}>
                    <Text style={{ ...styles.textPrimary, color: '#F06795' }}>Dislike</Text>
                    </View>
                )} 
              <View style ={styles.textContainer}>
                <View style={styles.textRow}>
                    <Text style ={[styles.textPrimary, styles.textShadow]}>Example Title</Text>
                </View>
                <View style={styles.textRow}>
                    <FontAwesome5 name="user" size={18} color="white"></FontAwesome5>
                    <Text style ={[styles.textSecondary, styles.textShadow]}>Example Poster Name</Text>    
                </View>
              </View>
          </View>
      )
  }

  
  const styles = StyleSheet.create({
      photo: {
        height: "100%",
        width: "100%",
        resizeMode: 'cover',
        borderRadius: 20,

      },

      textContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
      },

      textRow: {
        flexDirection: 'row',
        alignItems: 'center',
      },

      textPrimary: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
      },
      textSecondary: {
        color: 'white',
        marginLeft: 10,
        fontSize: 18,
      },
      textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.80)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
      },

      likeBox: {
        position: 'absolute',
        top: '50%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 3,
        borderRadius: 10,
        left: 40,
        borderColor: '#00ccff',
      },
      passBox: {
        position: 'absolute',
        top: '50%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderWidth: 3,
        borderRadius: 10,
        right: 40,
        borderColor: '#F06795',
      },
  })