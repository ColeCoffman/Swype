import React, { useState, useEffect } from "react";
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
import { setPersistantData, getPersistantData } from "../context/Storage";

export default function LoginScreen({ navigation }) {
  // States
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // This runs automatically on render

  useEffect(() => {
    async function checkLogin() {
      // Anything in here is fired on component mount.
      // Check Login
      let storedUser = "",
        storedPass = "";
      await getPersistantData("login")
        .then((result) => {
          storedUser = result;
        })
        .catch((err) => console.error(err));

      // Check Password
      await getPersistantData("password")
        .then((result) => {
          storedPass = result;
        })
        .catch((err) => console.error(err));

      if (storedPass && storedUser) {
        await LoginHandler(storedUser, storedPass);
      }

      // console.log(storedUser, storedPass);
    }
    checkLogin();
  }, []);

  // LoginHandler
  const LoginHandler = async (username, password) => {
    try {
      setIsLoading(true);
      let requestBody = {
        query: `
                query {
                    login(login: "${username}", password: "${password}") {
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

      //   console.log(result);

      // error hadnling could use work
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      // store token
      if (result.data.login.userId <= 0) {
        setMessage("User/Password combination incorrect");
      } else {
        // set global variables for logged in use

        setPersistantData("userId", result.data.login.userId);
        setPersistantData("login", username);
        setPersistantData("token", result.data.login.token);
        setPersistantData("password", password);
        navigation.navigate("mainScreenStack", { screen: "Main" });
        setIsLoading(false);
      }
    } catch (error) {
      setMessage(error.message);
      setIsLoading(false);
      //   forceUpdate();
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
          placeholder="Username"
          placeholderTextColor="black"
          autoCapitalize="none"
          onChangeText={(usernameInput) => setUsername(usernameInput)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={(passwordInput) => setPassword(passwordInput)}
        />
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("loginScreenStack", { screen: "ForgetPassword" })
        }
      >
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => LoginHandler(username, password)}
      >
        {isLoading ? (
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
          onPress={() =>
            navigation.navigate("loginScreenStack", { screen: "Register" })
          }
        >
          <Text>Register Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#0000cc",
  },
  loginText: {
    color: "white",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});
