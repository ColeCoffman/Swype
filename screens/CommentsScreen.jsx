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
//let newComments = true;
export default function CommentsScreen({ navigation }) {
  const [newComments, setNewComments] = useState("0");
  getPersistantData("newComments")
    .then((result) => {
      setNewComments(result);
    })
    .catch((err) => console.error(err));
  //let newComments = true;
  //console.log(newComments)
  //setNewComments(false);

  const [token, setToken] = useState("");
  const [postId, setPostId] = useState("");
  const [messageTarget, setTarget] = useState({});
  const COMMENTS = [];
  // get token
  //const [token, setToken] = useState("");
  if (newComments === "1") {
    //setTarget({nameT: "Post", targetId: postId, handler: 1})

    getPersistantData("token")
      .then((result) => {
        setToken(result);
      })
      .catch((err) => console.error(err));
    console.log("TokenLoadedInComments: " + token);
    // placeholder setPers
    setPersistantData("postId", "60f9d295ab3c97001559286a");
    //const [postId, setPostId] = useState("");
    getPersistantData("postId")
      .then((result) => {
        setPostId(result);
        setTarget({ nameT: "Post", targetId: result, handler: 1 });
      })
      .catch((err) => console.error(err));
    console.log("PostIdLoadedInComments: " + postId);
    //setNewComments(false);
    //newComments = false;
    setPersistantData("newComments", "0");
    //setNewComments(false);
    //loadComments();
    //const COMMENTS = [];
    const loadComments = async () => {
      try {
        let requestBody = {
          query: `
                query {
                    getPostComments(postId: "${postId}") {
                      _id
                      commenter{ login }
                      Content
                      upvotes
                      downvotes
                    }
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
        console.log(result);
        const length = result.data.getPostComments.length;
        for (let i = 0; i < length; i++) {
          //var d = result.data.getPostComments[i].createdAt
          //var date = d.getMonth() + " / " + d.getDate() + " / " + d.getFullYear();
          let loadedComment = {
            id: result.data.getPostComments[i]._id,
            login: result.data.getPostComments[i].commenter.login,
            comment: result.data.getPostComments[i].Content,
            upvotes: result.data.getPostComments[i].upvotes,
            downvotes: result.data.getPostComments[i].downvotes,
          };
          //console.log("1 comment" + loadedComment);
          COMMENTS.push(loadedComment);
        }
        //not returning a token
        setPersistantData("token", result.extensions.token);
        console.log("got all comments");
        setComments(COMMENTS);
      } catch (error) {
        console.log(error.message);
      }
    };
    loadComments();
    //console.log(COMMENTS);
  } // end of what to load when page opens
  //loadComments();
  const [allComments, setComments] = useState(COMMENTS);
  const [newComment, setComment] = useState("");
  // pass it the array returned by api
  const [allReplies, setReplies] = useState([]);
  const [currentID, setID] = useState(null);

  //const [messageTarget, setTarget] = useState({nameT: "Post", targetId: postId, handler: 1});

  //coment flat list stuf start

  const renderComment = ({ item }) => {
    //const backgroundColor = item.id === currentID ? "#6e3b6e" : "#f9c2ff";
    //const color = item.id === currentID ? 'white' : 'black';

    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.name}>{item.login}</Text>
        </View>
        <Text style={styles.bodyOfComment}>{item.comment}</Text>
        <View style={styles.row}>
          <Text /*replace with like icon also add on press api*/>
            upvotes:{" "}
          </Text>
          <Text>{item.upvotes} </Text>
          <Text /*replace with dislike icon*/>Downvotes: </Text>
          <Text>{item.downvotes} </Text>
          <TouchableOpacity
            onPress={() =>
              setTarget({ nameT: item.login, targetId: item.id, handler: 2 })
            }
          >
            <Text>REPLY</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity /*onPress={() => loadReplies()}*/>
          <Text style={styles.seeReplies}> Replies</Text>
        </TouchableOpacity>
      </View>
    );
  };
  //coment flat list stuf end
  const onSwipeDown = (gestureState) => {
    navigation.navigate("mainScreenStack", { screen: "Main" });
  };

  // add coments code start
  // add coments code start
  // add coments code start

  const addCommentHandler = async () => {
    // sent api request to add comment here
    try {
      let requestBody = {
        query: `
                mutation {
                    createComment(commentInput: {postId: "${postId}" Content: "${newComment}"}) {
                      _id
                      commenter{ login }
                    }
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

      console.log(" add Comment token" + token);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }

      const result = await JSON.parse(await response.text());
      console.log(result);
      // update locally
      setComments((currentComments) => [
        ...currentComments,
        {
          id: result.data.createComment._id,
          login: result.data.createComment.commenter.login,
          comment: newComment,
          upvotes: 0,
          downvotes: 0,
        },
      ]);
      setPersistantData("token", result.extensions.token);
      setToken(result.extensions.token);

      console.log("added comment");
    } catch (error) {
      console.log(error.message);
    }
  };
  const addReplieHandler = async () => {
    // replie to a comment
  };
  const addHandler = async () => {
    if (messageTarget.handler === 1) {
      addCommentHandler();
    } else if (messageTarget.handler === 2) {
      addReplieHandler();
    }
  };

  // add coments code End
  // add coments code ENd
  // add coments code end

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
          {/* <GestureRecognizer
          onSwipeDown={(state) => onSwipeDown(state)}
          config={config}
          style={{
            flex: 1,
          }}
        >*/}
          <TouchableOpacity
            style={styles.reply}
            onPress={() =>
              setTarget({ nameT: "Post", targetId: postId, handler: 1 })
            }
          >
            <Text style={styles.reply}>Select Reply to Post</Text>
          </TouchableOpacity>
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
              blurOnSubmit={true}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.commentBtn}
              onPress={() => addHandler()}
            >
              <Text style={styles.commentText}>
                Reply to {messageTarget.nameT}
              </Text>
            </TouchableOpacity>
          </View>
          {/*</GestureRecognizer>*/}
        </View>
        <View style={{ height: "80%" }}>
          <FlatList
            data={allComments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            extraData={currentID}
            //onEndReached={this._handleLoadMore}
          />
        </View>
      </SafeAreaView>
      <View style={{ height: ".01%" }}></View>
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
});
