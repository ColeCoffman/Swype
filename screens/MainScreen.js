import React, { Component } from "react";
import { Button, View, Text } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
// check login for avaiable global variables

export default class Mainscreen extends Component {
  /*constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
    //console.log(route.params);
  }*/
  render() {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Token: {global.token}</Text>
        <Button
          title="To Login"
          onPress={() => this.props.navigation.navigate("Login")}
        />
      </View>
    );
  }
}
