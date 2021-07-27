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
    backgroundColor: "#00ccff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "white",
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
  resetBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#0000cc",
  },
  submitText: {
    color: "white",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});

const AuthContext = React.createContext();

export default function ForgetPasswordScreen({ navigation }) {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ResetHandler = async () => {
    try {
      setIsLoading(true);
      if (email == "") {
        setIsLoading(false);
        throw new Error("Please enter a valid email address");
      }
      let requestBody = {
        query: `
            mutation {
				sendReset(email: "${email}") {
					token
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
      setMessage("Email was sent.");
      setIsLoading(false);
      //this.state.message = result.data.createUser.message;
      //this.state.isLoading = false;
      //this.forceUpdate();
    } catch (error) {
      setMessage(error.message);
      setIsLoading(false);
      //this.forceUpdate();
    }
  };

  return (
    // Container View
    <View style={styles.container}>
      <Image
        style={{ width: 250, height: 200 }}
        resizeMode="contain"
        source={require("../assets/logo-lg.png")}
      />
      {message != "" && <Text style={styles.errorMessage}>{message}</Text>}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="black"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={() => ResetHandler()}
          onChangeText={(emailInput) => setEmail(emailInput)}
        />
      </View>
      <TouchableOpacity style={styles.resetBtn} onPress={() => ResetHandler()}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.submitText}>SUBMIT</Text>
        )}
      </TouchableOpacity>
      <Text style={{ marginTop: 4 }}>Ready to Login? </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("loginScreenStack", { screen: "Login" })
        }
      >
        <Text>Login Here</Text>
      </TouchableOpacity>
    </View>
  );
}
