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
import { getPersistantData } from "../context/Storage";
import { setPersistantData } from "../context/Storage";

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};
// load in comment data using post ID
/*const COMMENTS = []; // [id, login, comment, upvotes, downvotes, replieNum];
//const [allComments, setComments] = useState([id, login, comment, upvotes, downvotes, replieNum]);
const loadComments = async () => {
  try {
    let requestBody = {
      query: `
              query {
                  getPostComments(postId: "60f8be0511f48a0015d507a0") {
                    _id
                    commenter{ login }
                    Content
                    upvotes
                    downvotes
                  }
              }
          `,
    };
    const token = getPersistantData(token);
    const response = await fetch("http://largeproject.herokuapp.com/api", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
        });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Something happened on our end, try again later!");
    }

    const result = await JSON.parse(await response.text());
    console.log(result);
    const length = result.data.getPostComments.length;
    for (let i=0; i<length; i++) {
      let loadedComment = {
        id: result.data.getPostComments[i]._id,
        login: result.data.getPostComments[i].commenter.login,
        comment: result.data.getPostComments[i].Content,
        upvotes: result.data.getPostComments[i].upvotes,
        downvotes: result.data.getPostComments[i].downvotes,
        replieNum: 0,
      };
      console.log(loadedComment);
      COMMENTS.push(loadedComment);   
      /*setComments(currentComments => [
        ...currentComments,
        {
          id: result.data.getPostComments[i]._id,
          login: result.data.getPostComments[i].commenter.login,
          comment: result.data.getPostComments[i].Content,
          upvotes: result.data.getPostComments[i].upvotes,
          downvotes: result.data.getPostComments[i].downvotes,
          replieNum: 0,
        }
      ]);
    }
    //not returning a token
    //setPersistantData("token", result.extensions.token);
    console.log("got all comments");
  } catch (error) {
      console.log(error.message);
    } 
  }
loadComments();
*/
/*
const COMMENTS = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    login: "test3",
    comment: "wwewewwewewe",
    upvotes: 59,
    downvotes: 55,
    replieNum: 23,
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    login: "test323",
    comment: "wwewewwewewe333",
    upvotes: 529,
    downvotes: 525,
    replieNum: 26,
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    login: "tes77777",
    comment: "wwew55555555333",
    upvotes: 69,
    downvotes: 65,
    replieNum: 0,
  },
];*/

/*const CommentItem = ({ comment, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.comment, backgroundColor]}>
    <Text style={[styles.name, textColor]}>{comment.login}</Text>
  </TouchableOpacity>
);*/
/*      <CommentItem style={styles.test}
        comment={item}
        onPress={() => setID(item.id)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />*/

// load in end
export default function CommentsScreen({ navigation }) {
  //loadComments();
  const COMMENTS = [];
  /*const loadComments = async () => {
    try {
      let requestBody = {
        query: `
                query {
                    getPostComments(postId: "60f8be0511f48a0015d507a0") {
                      _id
                      commenter{ login }
                      Content
                      upvotes
                      downvotes
                    }
                }
            `,
      };
      const token = getPersistantData(token);
      console.log(token);
      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      console.log(result);
      const length = result.data.getPostComments.length;
      for (let i=0; i<length; i++) {
        let loadedComment = {
          id: result.data.getPostComments[i]._id,
          login: result.data.getPostComments[i].commenter.login,
          comment: result.data.getPostComments[i].Content,
          upvotes: result.data.getPostComments[i].upvotes,
          downvotes: result.data.getPostComments[i].downvotes,
          replieNum: 0,
        };
        console.log(loadedComment);
        COMMENTS.push(loadedComment);   
      }
      //not returning a token
      //setPersistantData("token", result.extensions.token);
      console.log("got all comments");
    } catch (error) {
        console.log(error.message);
      } 
  }*/
  //loadComments();
  const [allComments, setComments] = useState(COMMENTS);

  const [newComment, setComment] = useState('');
  // pass it the array returned by api
  const [allReplies, setReplies] = useState([]);
  const [currentID, setID] = useState(null);
  const [token, setToken] = useState("");
  //coment flat list stuf start

  const renderComment = ({ item }) => {
    const backgroundColor = item.id === currentID ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === currentID ? 'white' : 'black';

    return (
      <View style={styles.comment}>
      <Text style={styles.login}>{item.login}</Text>
      <Text style={styles.bodyOfComment}>{item.comment}</Text>
      <View style={styles.row}>
        <Text /*replace with like icon also add on press api*/>upvotes: </Text>
        <Text >{item.upvotes} </Text>
        <Text /*replace with dislike icon*/>Downvotes: </Text>
        <Text >{item.downvotes} </Text>
        <Text >REPLY</Text>
      </View>
      <Text style={styles.seeReplies}>{item.replieNum} Replies</Text>
      </View>
    );
  };
  //coment flat list stuf end
  const onSwipeDown = (gestureState) => {
    navigation.navigate("mainScreenStack", { screen: "Main" });
  };
  const addCommentHandler = async () => {
    // sent api request to add comment here
    try {
      //let postId = getPersistantData()
      let requestBody = {
        query: `
                mutation {
                    createComment(commentInput: {postId: "60f9d295ab3c97001559286a" Content: "${newComment}"}) {
                      _id
                      commenter{ login }
                    }
                }
            `,
      };
      //const token = getPersistantData("token");
      //let token = "";
      getPersistantData("token")
        .then((result) => {
        setToken(result);
        })
        .catch((err) => console.error(err));

      console.log("token used:" + JSON.stringify(token));
      console.log("token used:" + token);
      console.log("token used:" + getPersistantData("token"));
      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
          console.log( {"Content-Type": "application/json", "Authorization": "Bearer " + token});
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      console.log(result);
      setComments(currentComments => [
        ...currentComments,
        {
          id: result.data.createComment._id,
          login: result.data.createComment.commenter.login,
          comment: newComment,
          upvotes: 0,
          downvotes: 0,
          replieNum: 0,
        }
      ]);
      //not returning a token
      //setPersistantData("token", result.extensions.token);
      console.log("added comment");
    } catch (error) {
        console.log(error.message);
      } 
    // update locally
    // get id returned 
    /*setComments(currentComments => [
      ...currentComments,
      {
        id: Math.random().toString(),
        login: "tes77777",
        comment: newComment,
        upvotes: 0,
        downvotes: 0,
        replieNum: 0,
      }
    ]);*/
  }
  return (
    // Container View
    <View style={styles.container}>
    {/*<GestureRecognizer
      onSwipeDown={(state) => onSwipeDown(state)}
      config={config}
      style={{
        flex: 1,
      }}
    >*/}
      <SafeAreaView style={styles.container}>
        <View style={styles.commentSpace}>
        <GestureRecognizer
          onSwipeDown={(state) => onSwipeDown(state)}
          config={config}
          style={{
            flex: 1,
          }}
        >
          <View style={styles.row}>
            <TextInput
              style={styles.TextInput}
              placeholder="Comment"
              //placeholderTextColor="black"
              autoCapitalize="none"
              multiline
              numberOfLines={5}
              maxLength={256}
              onChangeText={(commentInput) => setComment(commentInput)}
            />
            <TouchableOpacity style={styles.commentBtn} onPress={() => addCommentHandler()}>
              <Text style={styles.commentText}>COMMENT</Text>
            </TouchableOpacity>
          </View>
        </GestureRecognizer>
        </View>
        <View style={{height: "80%",}}>
          <FlatList
            data={allComments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            extraData={currentID}
          //onEndReached={this._handleLoadMore}
          />
        </View>
      </SafeAreaView>
      <View style={{height: ".01%",}}></View>
    {/*</GestureRecognizer>*/}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    //flex: 1,
    //alignItems: "center",
    //justifyContent: "center",
  },
  row: {
    //backgroundColor: "#fff",
    flexDirection: "row"
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
    height:80,
    flex: 1,
    //padding: 25,
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 10,
    //multiline=true
  },
  commentBtn: {
    width: "35%",
   // borderRadius: 25,
    height: 80,
  //  alignItems: "center",
  //justifyContent: "center",
    marginTop: 25,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: "#007",
  },
  commentText: {
    color: "white",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
  commentSpace : {
    height: "20%",
  },
  comment: {
    padding: 10,
  },
  name: {
    color: "red",
    fontSize: 18,
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
    marginRight: 90
  },
  reply: {
    color: "blue",
  }
});
