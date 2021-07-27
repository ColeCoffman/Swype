import React, { useRef, useState } from "react";
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
  registerBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#0000cc",
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

export default function RegisterScreen({ navigation }) {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const password1TEXTINPUT = useRef();
  const password2TEXTINPUT = useRef();
  const emailTEXTINPUT = useRef();

  const RegisterHandler = async () => {
    try {
      setIsLoading(true);
      if (username == "") {
        setIsLoading(false);
        throw new Error("Please enter a valid username");
      }
      if (email == "") {
        setIsLoading(false);
        throw new Error("Please enter a valid email address");
      }
      if (password1 !== password2) {
        setIsLoading(false);
        throw new Error("Passwords do not match");
      }
      let requestBody = {
        query: `
            mutation {
                createUser(userInput: {login: "${username}", email: "${email}", password: "${password1}"}) {
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
      setMessage(result.data.createUser.message);
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
          placeholder="Username"
          placeholderTextColor="black"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => emailTEXTINPUT.current.focus()}
          onChangeText={(usernameInput) => setUsername(usernameInput)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="black"
          autoCapitalize="none"
          ref={emailTEXTINPUT}
          returnKeyType="next"
          onSubmitEditing={() => password1TEXTINPUT.current.focus()}
          onChangeText={(emailInput) => setEmail(emailInput)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          autoCapitalize="none"
          ref={password1TEXTINPUT}
          returnKeyType="next"
          onSubmitEditing={() => password2TEXTINPUT.current.focus()}
          onChangeText={(password1Input) => setPassword1(password1Input)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Confirm Password"
          placeholderTextColor="black"
          secureTextEntry={true}
          autoCapitalize="none"
          ref={password2TEXTINPUT}
          returnKeyType="done"
          onSubmitEditing={() => RegisterHandler()}
          onChangeText={(password2Input) => setPassword2(password2Input)}
        />
      </View>
      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => RegisterHandler()}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.registerText}>REGISTER</Text>
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
