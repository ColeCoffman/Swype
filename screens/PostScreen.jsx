import React, { useState, useEffect } from "react";
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

import { getPersistantData } from "../context/Storage";
import { setPersistantData } from "../context/Storage";

export default function PostScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [Array, setArray] = useState([]);
  const [length, setLength] = useState("0");

  useEffect(() => {
    getPostHelper();
  }, []);

  const getPostHelper = () => {
    getPosts()
      .then((ARRAY) => {
        // console.log("getPosts: ", ARRAY);
        setArray(ARRAY);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  async function getPosts() {
    return await getPersistantData("token")
      .then((result) => {
        // console.log("1: ", result);
        return loadPosts(result);
      })
      .then((result) => {
        // console.log("2: ", result);
        return result;
      })
      .catch((err) => console.error(err));
  }

  async function loadPosts(token) {
    let ARRAY = [];
    try {
      let requestBody = {
        query: `
                query { 
        userPosts{ 
        _id 
        poster{ _id login email verified } 
        title 
        Image 
        Content 
        upvotes 
        downvotes 
        userVoteStatus} 
        }
            `,
      };

      const response = await fetch("http://largeproject.herokuapp.com/api", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }

      const result = await JSON.parse(await response.text());
      const length = result.data.userPosts.length;
	  setLength(length);
      for (let i = 0; i < length; i++) {
          ARRAY.push({
          picture: result.data.userPosts[i].Image,
          id: result.data.userPosts[i]._id,
		  score: parseInt(parseInt(result.data.userPosts[i].upvotes) - parseInt(result.data.userPosts[i].downvotes)),
		  title: result.data.userPosts[i].title,
        });
      }
      //not returning a token
      setPersistantData("token", result.extensions.token);

      // console.log("RETURN: ", ARRAY);
      return ARRAY;
    } catch (error) {
      console.log(error.message);
    }
  }

  const renderPost = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={async () => {
            setPersistantData("postId", item.id);
            setPersistantData("newComments", "1");
            navigation.navigate("mainScreenStack", { screen: "Comments" });
          }}
        >
		  
		  <View style={styles.listItem}>
		  <Image source={{uri:item.picture}}  style={{width:120, height:120,borderRadius:60}} />
		  <View style={{alignItems:"center",flex:1}}>
			<Text style={{fontWeight:"bold"}}>{item.title}</Text>
			<Text>{"SCORE: " + item.score}</Text>
		  </View>
		  </View>
		  
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{ alignContent: "center", justifyContent: "center", flex: 1 }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  if(length > 0){
  return (
    <View style={styles.container}>
      <FlatList data={Array} renderItem={renderPost} />
    </View>
  );
  }
  
  return (
		<View style={styles.container}>
		    <Text>You have no posts.</Text>
		</View>
	);
	
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginTop:60
  },
  listItem:{
    margin:10,
    padding:10,
    backgroundColor:"#FFF",
    width:"80%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  row: {
    //backgroundColor: "#fff",
    flexDirection: "row",
    //flex: 1,
    //alignItems: "center",
    //justifyContent: "center",
  },
  inputView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "65%",
    height: 135,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 80,
    flex: 1,
    padding: 10,
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 10,
  },
  commentBtn: {
    width: "35%",
    borderRadius: 25,
    height: 80,
    alignItems: "center",
    //justifyContent: "center",
    marginTop: 25,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: "#007",
  },
  commentText: {
    color: "white",
    alignItems: "center",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
  commentSpace: {
    height: "20%",
  },
  comment: {
    padding: 10,
  },
  name: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
  date: {
    color: "grey",
    fontSize: 13,
    //fontWeight: "bold",
  },
  bodyOfComment: {
    color: "black",
    fontSize: 12,
  },
  seeReplies: {
    color: "blue",
  },
  test: {
    width: 20,
    marginRight: 90,
  },
  reply: {
    color: "blue",
  },
  replieIndent: {
    marginLeft: 25,
  },
});
