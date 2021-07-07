import React, { Component, useState } from "react";
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

// storage method for cross screen
// not very secure using global but it was easy. Any javascript in our code can acces it.
global.name = "";
global.userId = -1;
global.token = "";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#00ff",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#007",
  },
  loginText: {
    color: "white",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});

const AuthContext = React.createContext();

export default class Homescreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      username: "",
      password: "",
      isLoading: false,
    };
  }

  render() {
    return (
      // Container View
      <View style={styles.container}>
        <Image
          style={{ width: 300, height: 200 }}
          source={require("../assets/SwypeLogo.png")}
        />
        {this.state.message != "" && (
          <Text style={styles.errorMessage}>{this.state.message}</Text>
        )}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Username"
            placeholderTextColor="#fff"
            onChangeText={(username) => this.setState({ username: username })}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password: password })}
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={this.loginHandler}>
          {this.state.isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.loginText}>LOGIN</Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ marginTop: 4 }}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Register")}
          >
            <Text>Register Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  loginHandler = async () => {
    try {
      this.state.isLoading = true;
      let requestBody = {
        query: `
              query {
                  login(login: "${this.state.username}", password: "${this.state.password}") {
                      userId
                      token
                      tokenExpiration
                  }
              }
          `,
      };

      const response = await fetch("http://largeproject.herokuapp.com/api", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      });
      // for other requests pass the webtoken to the header
      // headers: { "Content-Type": "application/json", "Authorization", "Bearer" + \n + jontoken}

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something happened on our end, try again later!");
      }

      const result = await JSON.parse(await response.text());
      //var result = JSON.parse(await response.text());
      console.log(result);

      // error hadnling could use work
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      // store token
      if (result.data.login.userId <= 0) {
        this.setState({ message: "Usere/Password combination incorrect" });
      } else {
        // set global variables for logged in use
        global.userId = result.data.login.userId;
        global.login = this.state.username;
        global.token = result.data.login.token;
        this.props.navigation.navigate("Main");
      }
    } catch (error) {
      this.state.message = error.message;
      this.state.isLoading = false;
      this.forceUpdate();
    }
  };
}
