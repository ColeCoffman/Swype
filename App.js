import "react-native-gesture-handler";

import * as React from "react";
import { View, TouchableOpacity, Image } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { CardStyleInterpolators } from "@react-navigation/stack";

// Import Custom Sidebar
import SidebarMenu from "./components/SidebarMenu";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MainScreen from "./screens/MainScreen";
import PostScreen from "./screens/PostScreen";
import ForgetPasswordScreen from "./screens/ForgetPasswordScreen";

// Add Post Button
import { HeaderButton } from "./components/AddPostButton";
import CommentsScreen from "./screens/CommentsScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png",
          }}
          style={{ width: 35, height: 35, marginRight: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

// Login and Register Scren Stack
function loginScreenStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Login", //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: "#f4511e", //Set Header color
          },
          headerTintColor: "#fff", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Register", //Set Header Title
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPasswordScreen}
        options={{
          title: "ForgetPassword", //Set Header Title
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Main Screen Stack
function mainScreenStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerRight: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerLeft: () => (
          // Logo. Leads to main page.
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
            <Image
              style={{ flex: 1, height: 3, width: 80 }}
              resizeMode="contain"
              source={require("./assets/logo-sm.png")}
            ></Image>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "#00ccff", //Set Header color
        },
        headerTintColor: "#fff", //Set Header text color
        headerTitleStyle: {
          fontWeight: "bold", //Set Header text style
        },
        headerTitleAlign: "center",
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerTitle: (props) => <HeaderButton {...props} />, //Set Header Title as add post button
        }}
      />
      <Stack.Screen
        name="Posts"
        component={PostScreen}
        options={{
          headerTitle: (props) => <HeaderButton {...props} />, //Set Header Title as add post button
        }}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          headerTitle: (props) => <HeaderButton {...props} />, //Set Header Title as add post button
        }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: "#00ff",
          itemStyle: { marginVertical: 5 },
        }}
        drawerContent={(props) => <SidebarMenu {...props} />}
      >
        <Drawer.Screen
          name="loginScreenStack"
          options={{ gestureEnabled: false }}
          component={loginScreenStack}
        />
        <Drawer.Screen
          name="mainScreenStack"
          // initialParams={{ params: navigation.params }}
          component={mainScreenStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
