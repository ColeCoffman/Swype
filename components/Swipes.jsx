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
  import { getPersistantData } from "../context/Storage";
  import { setPersistantData } from "../context/Storage";


function Swipes({ swipesRef, handleLike, handleDislike}) {
    const [token, setToken] = useState("");
    // Get Token and set state
    getPersistantData("token")
    .then((result) => {
      setToken(result);
    })
    .catch((err) => console.error(err));

    const [postId, setPostId] = useState("");
    const POST = [];

    // placeholder setPers
    //setPersistantData("postId", "60eca4049a0c8f0015b69b56");
    //const [postId, setPostId] = useState("");
    getPersistantData("postId")

    const [willLike, setWillLike] = useState(false)
    const [willPass, setWillPass] = useState(false)
    const [currPost, setPost] = useState({postID: "postID", author: "Author", Title: "Title", score: "Score", Image: "https://i.imgur.com/PgSKex0.png",});

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

      const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
      }, []);

      return (
        <Swipeable
            ref={swipesRef}
            friction={1}
            leftThreshold={60}
            rightThreshold={60}
            overshootRight={false}
            overshootLeft={false}
            overshootFriction={20}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}

            // Left Swipe
            onSwipeableLeftOpen={() => {
            setWillLike(false)
              // Start like
              const likeStatus = async () => {
                try {
                  let requestBody = {
                    query: `
                            mutation {
                              upDownNeutralvote(voteStatus: "up" contentType: "post" contentId: "${currPost.postID}") {
                                 contentType contentId userId { _id login }
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
                    throw new Error("Something happened on our end LIKE , try again later!");
                  }
              
                  const result = await JSON.parse(await response.text());
                  console.log(result);
                    
                  setPersistantData("token", result.extensions.token);
                  setToken(result.extensions.token);
                  //loadReplies(currentID);
                  console.log("api: added Like");
                } catch (error) {
                    console.log(error.message);
                  } 
              }
              // add like end
              likeStatus();
              

            const loadPost = async () => {
              try {
                let requestBody = {
                  query: `
                          query {
                              getRandomPost(currentPostId: "${postId}") {
                                _id
                                poster{ login }
                                title
                                Image
                                upvotes
                                downvotes
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
                console.log(result);
              
                setPost(
                  {
                    postID: result.data.getRandomPost._id, 
                    author: result.data.getRandomPost.poster.login, 
                    Title: result.data.getRandomPost.title, 
                    score: (parseInt(result.data.getRandomPost.upvotes) - parseInt(result.data.getRandomPost.downvotes)), 
                    Image: result.data.getRandomPost.Image,
                    upvotes: result.data.getRandomPost.upvotes,
                    downvotes: result.data.getRandomPost.downvotes,
                  }
                );
                setPersistantData("postId", result.data.getRandomPost._id);
                setPersistantData("token", result.extensions.token);
                console.log("got random Post");
              } catch (error) {
                  console.log(error.message);
                } 
            }
             loadPost();
              handleLike();
            }}

            // Right Swipe
            onSwipeableRightOpen={() => {
            setWillPass(false)
            // start dislike
            const dislikeStatus = async () => {
              try {
                let requestBody = {
                  query: `
                          mutation {
                            upDownNeutralvote(voteStatus: "down" contentType: "post" contentId: "${currPost.postID}") {
                               contentType contentId userId { _id login }
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
                  throw new Error("Something happened on our end DISLIKE , try again later!");
                }
            
                const result = await JSON.parse(await response.text());
                console.log(result);
                  
                setPersistantData("token", result.extensions.token);
                setToken(result.extensions.token);
                //loadReplies(currentID);
                console.log("api: added Like");
              } catch (error) {
                  console.log(error.message);
                } 
            }
            // add dislike end
            dislikeStatus();
            
            const loadPost = async () => {
              try {
                let requestBody = {
                  query: `
                          query {
                              getRandomPost(currentPostId: "${postId}") {
                                _id
                                poster{ login }
                                title
                                Image
                                upvotes
                                downvotes
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
                console.log(result);
              
                setPost(
                  {
                    postID: result.data.getRandomPost._id, 
                    author: result.data.getRandomPost.poster.login, 
                    Title: result.data.getRandomPost.title, 
                    Image: result.data.getRandomPost.Image,
                    upvotes: result.data.getRandomPost.upvotes,
                    downvotes: result.data.getRandomPost.downvotes,
                    score: (parseInt(result.data.getRandomPost.upvotes) - parseInt(result.data.getRandomPost.downvotes)), 
                  }
                );
                setPersistantData("postId", result.data.getRandomPost._id);
                console.log("got random Post");
              } catch (error) {
                  console.log(error.message);
                } 
            }
             loadPost();
            handleDislike();
            }}
            onSwipeableLeftWillOpen={() => setWillLike(true)}
            onSwipeableRightWillOpen={() => setWillPass(true)}
        >
        <SwipeableImage  currPostTitle = {currPost.Title} currPostID = {currPost.postID} 
          currPostAuthor = {currPost.author} currPostScore = {currPost.score} currPostImage = {currPost.Image} 
            willLike={willLike} willPass={willPass}/>
      </Swipeable>
      )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      overflow: 'hidden',
    },
  })

  export default React.forwardRef((props, ref) => <Swipes swipesRef={ref} {...props}></Swipes>)
  
  
