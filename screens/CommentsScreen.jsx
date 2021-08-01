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



export default function CommentsScreen({ navigation }) {
  const [newComments, setNewComments] = useState("0");
  getPersistantData("newComments")
  .then((result) => {
    setNewComments(result);
  })
  .catch((err) => console.error(err));

  const [token, setToken] = useState("");
  const [postId, setPostId] = useState("");
  const [messageTarget, setTarget] = useState({});
  const COMMENTS = [];
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
                      userVoteStatus
                    }
                }
            `,
      };

      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      //console.log(result);
      const length = result.data.getPostComments.length;
      for (let i=0; i<length; i++) {
        let likeStatus = result.data.getPostComments[i].userVoteStatus;
        var like;
        var dislike;
        if (likeStatus === 'upvote') {
          like = true;
          dislike = false;
        } else if (likeStatus === 'downvote') {
          like = false;
          dislike = true;
        } else if (likeStatus === 'neutral') {
          like = false;
          dislike = false;  
        }
        let loadedComment = {
          id: result.data.getPostComments[i]._id,
          login: result.data.getPostComments[i].commenter.login,
          comment: result.data.getPostComments[i].Content,
          upvotes: result.data.getPostComments[i].upvotes,
          downvotes: result.data.getPostComments[i].downvotes,
          like: like,
          dislike: dislike,
        };
        //console.log("1 comment" + loadedComment);
        COMMENTS.push(loadedComment);   
      }
      //not returning a token
      setPersistantData("token", result.extensions.token);
      //console.log("got all comments");
      setComments(COMMENTS)
    } catch (error) {
        console.log(error.message);
      } 
  }
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
  //setPersistantData("postId", "60f9d295ab3c97001559286a");
  //const [postId, setPostId] = useState("");
  getPersistantData("postId")
  .then((result) => {
    setPostId(result);
    setTarget({nameT: "Post", targetId: result, handler: 1});
  })
  .catch((err) => console.error(err));
  //console.log("PostIdLoadedInComments: " + postId);
  //setNewComments(false);
  //newComments = false;
  setPersistantData("newComments", "0");

   loadComments();
   //console.log(COMMENTS);
} // end of what to load when page opens

  //loadComments();
  const [allComments, setComments] = useState(COMMENTS);
  const [newComment, setComment] = useState('');
  // pass it the array returned by api
  const [allReplies, setReplies] = useState([]);
  const [currentID, setID] = useState(null);

  //const [messageTarget, setTarget] = useState({nameT: "Post", targetId: postId, handler: 1});
  // laod in all replies
  
  const loadReplies = async (commentId) => {
    const REPLIES = [];
    try {
      let requestBody = {
        query: `
                query {
                  getCommentReplies(commentId: "${commentId}") {
                      _id
                      replier{ login }
                      Content
                      upvotes
                      downvotes
                      userVoteStatus
                    }
                }
            `,
      };

      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      //console.log(result);
      const length = result.data.getCommentReplies.length;
      for (let i=0; i<length; i++) {
        let likeStatus = result.data.getCommentReplies[i].userVoteStatus;
        var like;
        var dislike;
        if (likeStatus === 'upvote') {
          like = true;
          dislike = false;
        } else if (likeStatus === 'downvote') {
          like = false;
          dislike = true;
        } else if (likeStatus === 'neutral') {
          like = false;
          dislike = false;  
        }
        let loadedReply = {
          id: result.data.getCommentReplies[i]._id,
          login: result.data.getCommentReplies[i].replier.login,
          comment: result.data.getCommentReplies[i].Content,
          upvotes: result.data.getCommentReplies[i].upvotes,
          downvotes: result.data.getCommentReplies[i].downvotes,
          like: like,
          dislike: dislike,
        };
        //console.log("1 comment" + loadedComment);
        REPLIES.push(loadedReply);   
      }
      //not returning a token
      setPersistantData("token", result.extensions.token);
      //setID(commentId)
      
      //console.log("got all replies");
      setReplies(REPLIES);
      return commentId;
    } catch (error) {
        console.log(error.message);
      } 
  }
  // neutral update start
  const neutralStatus = async (replyId, type) => {
    // change to neutral start
    try {
      let requestBody = {
        query: `
                mutation {
                  upDownNeutralvote(voteStatus: "neutral" contentType: "${type}" contentId: "${replyId}") {
                     contentType
                    }
                }
            `,
      };
  
      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      
        //console.log(" add replie token" + token);
        if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      //console.log(result);
        
      setPersistantData("token", result.extensions.token);
      setToken(result.extensions.token);
      //loadReplies(currentID);
      //console.log("cleared like");
    } catch (error) {
        console.log(error.message);
      } 
  }
  // neutral update end
  // like update start
  const likeStatus = async (replyId, type) => {
    try {
      let requestBody = {
        query: `
                mutation {
                  upDownNeutralvote(voteStatus: "up" contentType: "${type}" contentId: "${replyId}") {
                     contentType
                    }
                }
            `,
      };
  
      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      
        //console.log(" add replie token" + token);
        if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      //console.log(result);
        
      setPersistantData("token", result.extensions.token);
      setToken(result.extensions.token);
      //loadReplies(currentID);
      //console.log("api: added Like");
    } catch (error) {
        console.log(error.message);
      } 
  }
  // add like end
  // add dislike start
  const dislikeStatus = async (replyId, type) => {
    try {
      let requestBody = {
        query: `
                mutation {
                  upDownNeutralvote(voteStatus: "down" contentType: "${type}" contentId: "${replyId}") {
                     contentType
                    }
                }
            `,
      };
  
      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      
        //console.log(" add replie token" + token);
        if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      //console.log(result);
        
      setPersistantData("token", result.extensions.token);
      setToken(result.extensions.token);
      //loadReplies(currentID);
      //console.log("api: added dislike");
    } catch (error) {
        console.log(error.message);
      } 
  }
  // add dislike end

    // update like and dislike start
  //likeReplie(item.like)
  const likeReplie = async (replyId, likeS, dislikeS) => {
    // change to neutral start
    if (likeS === true) {
      await neutralStatus(replyId, "reply");
    } else if (dislikeS === true) {
      await neutralStatus(replyId, "reply");
      await likeStatus(replyId, "reply");
    } else {
      await likeStatus(replyId, "reply");
    }
    loadReplies(currentID);
  }
  const dislikeReplie = async (replyId, likeS, dislikeS) => {
    // change to neutral start
    if (dislikeS === true) {
      await neutralStatus(replyId, "reply");
    } else if (likeS === true) {
      await neutralStatus(replyId, "reply");
      await dislikeStatus(replyId, "reply");
    } else {
      await dislikeStatus(replyId, "reply");
    }
    loadReplies(currentID);
  }
  // update like and dislike end
  // replie falt list start
  const renderReplie = ({ item }) => {
    return (
      <View style={styles.replieIndent}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.login}</Text>
        </View>
        <Text style={styles.bodyOfComment}>{item.comment}</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => likeReplie(item.id, item.like, item.dislike)}>
            {item.like ? (
              <Image
              style={{ marginRight: 5 }}
              resizeMode="contain"
              source={require("../assets/likedIcon.png")}
            />
            ) : <Image
                style={{ marginRight: 5 }}
                resizeMode="contain"
                source={require("../assets/likeIcon.png")}
              />}
          </TouchableOpacity>
          <Text >{item.upvotes} </Text>
          <TouchableOpacity onPress={() => dislikeReplie(item.id, item.like, item.dislike)}>
            {item.dislike ? (
              <Image
              style={{ marginLeft: 15, marginRight: 5}}
              resizeMode="contain"
              source={require("../assets/dislikedIcon.png")}
            />
            ) : <Image
                style={{ marginLeft: 15, marginRight: 5}}
                resizeMode="contain"
                source={require("../assets/dislikeIcon.png")}
              />}
          </TouchableOpacity>
          <Text >{item.downvotes} </Text>
          <TouchableOpacity onPress={() => setTarget({nameT: item.login, targetId: item.id, handler: 3})}>
            <Text style={{ marginLeft: 10}}>REPLY</Text>
          </TouchableOpacity>
        </View>
      </View> 
    )
  }
  // add coment like and dislike start
  const likeComment = async (replyId, likeS, dislikeS) => {
    // change to neutral start
    if (likeS === true) {
      await neutralStatus(replyId, "comment");
    } else if (dislikeS === true) {
      await neutralStatus(replyId, "comment");
      await likeStatus(replyId, "comment");
    } else {
      await likeStatus(replyId, "comment");
    }
    loadComments();
  }
  const dislikeComment = async (replyId, likeS, dislikeS) => {
    // change to neutral start
    if (dislikeS === true) {
      await neutralStatus(replyId, "comment");
    } else if (likeS === true) {
      await neutralStatus(replyId, "comment");
      await dislikeStatus(replyId, "comment");
    } else {
      await dislikeStatus(replyId, "comment");
    }
    loadComments();
  }
  // add coment like and dislike end
  //coment flat list stuf start
  const renderComment = ({ item }) => {
    //const backgroundColor = item.id === currentID ? "#6e3b6e" : "#f9c2ff";
    const show = item.id === currentID ? true : false;
    const replieNum = 0 === allReplies.length ? false : true;
    return (
      <View style={styles.comment}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.login}</Text>
        </View>
        <Text style={styles.bodyOfComment}>{item.comment}</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => likeComment(item.id, item.like, item.dislike)}>
            {item.like ? (
              <Image
              style={{ marginRight: 5 }}
              resizeMode="contain"
              source={require("../assets/likedIcon.png")}
            />
            ) : <Image
                style={{ marginRight: 5 }}
                resizeMode="contain"
                source={require("../assets/likeIcon.png")}
              />}
          </TouchableOpacity>
          <Text >{item.upvotes} </Text>
          <TouchableOpacity onPress={() => dislikeComment(item.id, item.like, item.dislike)}>
            {item.dislike ? (
              <Image
              style={{ marginLeft: 15, marginRight: 5}}
              resizeMode="contain"
              source={require("../assets/dislikedIcon.png")}
            />
            ) : <Image
                style={{ marginLeft: 15, marginRight: 5}}
                resizeMode="contain"
                source={require("../assets/dislikeIcon.png")}
              />}
          </TouchableOpacity>
          <Text >{item.downvotes} </Text>
          <TouchableOpacity onPress={() => setTarget({nameT: item.login, targetId: item.id, handler: 2})}>
            <Text style={{ marginLeft: 10}}>REPLY</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => loadReplies(item.id).then((result) => {
    setID(result);
  })}>
          <Text style={styles.seeReplies}> Replies</Text>
        </TouchableOpacity>
        {show ? (
          replieNum ? (
          <FlatList
          data={allReplies}
          renderItem={renderReplie}
          keyExtractor={(item) => item.id}
          //extraData={currentID}
        />
        ) : <Text >No Replies found</Text>
        ) : null}  
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

;
      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      
        //console.log(" add Comment token" + token);
        if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      //console.log(result);
      // update locally
      setComments(currentComments => [
        ...currentComments,
        {
          id: result.data.createComment._id,
          login: result.data.createComment.commenter.login,
          comment: newComment,
          upvotes: 0,
          downvotes: 0,
          like: false,
          dislike: false,
        }
      ]);
      setPersistantData("token", result.extensions.token);
      setToken(result.extensions.token);

      //console.log("added comment");
    } catch (error) {
        console.log(error.message);
      } 
  }
  const addReplieHandler = async () => {
    // replie to a comment
    // sent api request to add comment here
    let comment = "@" + messageTarget.nameT + " " + newComment;
    try {
      let requestBody = {
        query: `
                mutation {
                    createReply(replyInput: {commentId: "${messageTarget.targetId}" Content: "${comment}"}) {
                      _id
                      replier{ login }
                    }
                }
            `,
      };
  
;
      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      
        //console.log(" add replie token" + token);
        if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      //console.log(result);
      // update locally
      
      if (currentID === messageTarget.targetId) {
        setReplies(currentReplies => [
          ...currentReplies,
          {
            id: result.data.createReply._id,
            login: result.data.createReply.replier.login,
            comment: comment,
            upvotes: 0,
            downvotes: 0,
            like: false,
            dislike: false,
          }
        ]);
      }
      setPersistantData("token", result.extensions.token);
      setToken(result.extensions.token);

      //console.log("added replie");
    } catch (error) {
        console.log(error.message);
      } 
  }
  const addReplieReplieHandler = async () => {
    // replie to a comment
    // sent api request to add comment here
    let comment = "@" + messageTarget.nameT + " " + newComment;
    try {
      let requestBody = {
        query: `
                mutation {
                    createReply(replyInput: {commentId: "${currentID}" Content: "${comment}"}) {
                      _id
                      replier{ login }
                    }
                }
            `,
      };
  
;
      const response = await fetch("http://largeproject.herokuapp.com/api", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
          });
      
        //console.log(" add replie token" + token);
        if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }
  
      const result = await JSON.parse(await response.text());
      //console.log(result);
      // update locally
      
        setReplies(currentReplies => [
          ...currentReplies,
          {
            id: result.data.createReply._id,
            login: result.data.createReply.replier.login,
            comment: comment,
            upvotes: 0,
            downvotes: 0,
            like: false,
            dislike: false,
          }
        ]);
        
      setPersistantData("token", result.extensions.token);
      setToken(result.extensions.token);

      //console.log("added replie");
    } catch (error) {
        console.log(error.message);
      } 
  }
  const addHandler = async () => {
    if (messageTarget.handler === 1) {
      addCommentHandler();
    } else if (messageTarget.handler === 2) {
      addReplieHandler();
    } else if (messageTarget.handler === 3) {
      addReplieReplieHandler();
    } 
    //setComment('');
    //this.state = {text: ""};
  }

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
       <GestureRecognizer
          onSwipeDown={(state) => onSwipeDown(state)}
          config={config}
          style={{
            flex: 1,
          }}
        >
          <TouchableOpacity style={styles.reply} onPress={() => setTarget({nameT: "Post", targetId: postId, handler: 1})}>
              <Text style={styles.reply}>Select Reply to Post</Text>
          </TouchableOpacity>
          <View style={styles.row}>
            <TextInput
              style={styles.TextInput}
              placeholder="Comment"
              //placeholderTextColor="black"
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={() => addHandler()}
              autoCapitalize="none"
              multiline
              numberOfLines={3}
              maxLength={256}
              onChangeText={(commentInput) => setComment(commentInput)}
            />
            <TouchableOpacity style={styles.commentBtn} onPress={() => addHandler()}>
              <Text style={styles.commentText}>Reply to {messageTarget.nameT}</Text>
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
  TextInput: {
    height:80,
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
    justifyContent: "center",
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
  commentSpace : {
    height: "20%",
  },
  comment: {
    //padding: 15,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 10,
  },
  name: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyOfComment: {
    color: "black",
    fontSize: 16,
  },
  seeReplies: {
    color: "blue",
    fontSize: 16,
    marginTop: 10,
  },
  test: {
    width: 20,
    marginRight: 90
  },
  reply: {
    color: "blue",
    marginTop: 10,
    fontSize: 16,
  },
  replieIndent: {
    marginLeft: 25,
  }
});
