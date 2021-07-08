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

// check login for global variables

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
  registerBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#007",
  },
  registerText: {
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
      email: "",
      password1: "",
      password2: "",
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
            placeholder="Email"
            placeholderTextColor="#fff"
            onChangeText={(email) => this.setState({ email: email })}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry={true}
            onChangeText={(password1) =>
              this.setState({ password1: password1 })
            }
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            secureTextEntry={true}
            onChangeText={(password2) =>
              this.setState({ password2: password2 })
            }
          />
        </View>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={this.registerHandler}
        >
          {this.state.isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.registerText}>REGISTER</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  registerHandler = async () => {
    try {
      this.state.isLoading = true;
      if (this.state.username == "") {
        this.state.isLoading = false;
        throw new Error("Please enter a valid username");
      }
      if (this.state.email == "") {
        this.state.isLoading = false;
        throw new Error("Please enter a valid email address");
      }
      if (this.state.password1 !== this.state.password2) {
        this.state.isLoading = false;
        throw new Error("Passwords do not match");
      }
      let requestBody = {
        query: `
            mutation {
                createUser(userInput: {login: "${this.state.username}", email: "${this.state.email}", password: "${this.state.password1}"}) {
                      message
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

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      // store token
      //storage.storeToken(result.data.login.token);
      //this.props.navigation.navigate("Main", {
      //  token: result.data.login.token,
      //});
      // console.log(result.data);
      this.state.message = result.data.createUser.message;
      this.state.isLoading = false;
      this.forceUpdate();
    } catch (error) {
      this.state.message = error.message;
      this.state.isLoading = false;
      this.forceUpdate();
    }
  };
}
