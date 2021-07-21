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
];

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
  const [newComment, setComment] = useState('');
  // pass it the array returned by api
  const [allComments, setComments] = useState(COMMENTS);
  const [currentID, setID] = useState(null);
  
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
    // api
    // api
    // api
    // update locally
    // get id returned 
    setComments(currentComments => [
      ...currentComments,
      {
        id: Math.random().toString(),
        login: "tes77777",
        comment: newComment,
        upvotes: 0,
        downvotes: 0,
        replieNum: 0,
      }
    ]);
  }
  return (
    // Container View
    <View>
    {/*<GestureRecognizer
      onSwipeDown={(state) => onSwipeDown(state)}
      config={config}
      style={{
        flex: 1,
      }}
    >*/}
      <SafeAreaView style={styles.container}>
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

        <FlatList
        data={allComments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        extraData={currentID}
        //onEndReached={this._handleLoadMore}
        />
    
      </SafeAreaView>
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
    width: "70%",
    height: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 60,
    flex: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    //multiline=true
  },
  commentBtn: {
    width: "20%",
    borderRadius: 25,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
  comment: {
    padding: 10,
  },
  name: {
    color: "black",
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
  }
});
