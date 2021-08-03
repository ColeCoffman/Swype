import React, { useState, Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";

import t from 'tcomb-form-native'; // 0.6.9
import { getPersistantData } from "../context/Storage";
import { setPersistantData } from "../context/Storage";

const Form = t.form.Form;

const User = t.struct({
  title: t.String,
  url: t.String,
  caption: t.maybe(t.String),
  agreeToTerms: t.Boolean
});

export default function AddPostScreen({}){

const [token, setToken] = useState("");

getPersistantData("token")
.then((result) => {
setToken(result);
})
.catch((err) => console.error(err));

  handleSubmit = () => {  
	  	
    const value = this._form.getValue(); // use that ref to get the form value
    console.log('value: ', value);	
	sendPost(value);
  }

const sendPost = async function(value){
	
	try {

	let requestBody = {
			
	query: `
	mutation {createPost(postInput: {title: "${value.title}", Image: "${value.url}", Content: "${value.caption}"}) { 
		_id 
		poster{ _id login email verified } 
		title 
		Image 
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
		headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token},
	  });  

	if (response.status !== 200 && response.status !== 201) {
		throw new Error("Something happened on our end, try again later!");
	}
	

	const result = await JSON.parse(await response.text());
	
	//not returning a token
	setPersistantData("token", result.extensions.token);


} catch (error) {
  console.log(error.message);
}

};
    return (
      <View style={styles.container}>
        <Form
          ref={c => this._form = c} // assign a ref
          type={User}
        />
        <Button
          title="Share Post"
          onPress={this.handleSubmit}
        />
      </View>
    );

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
});

  
