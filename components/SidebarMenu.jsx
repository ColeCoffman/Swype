import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, Text } from "react-native";
import { getPersistantData } from "../context/Storage";

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

let login = "";
getPersistantData("login")
  .then((result) => {
    login = result;
  })
  .catch((err) => console.error(err));

const SidebarMenu = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
          }}
          style={styles.sideMenuProfileIcon}
        />
        <Text style={{ marginLeft: 15 }}>{login}</Text>
      </View>
      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}
        <DrawerItem
          label="POSTS"
          onPress={() =>
            props.navigation.navigate("mainScreenStack", { screen: "Posts" })
          }
        />
        <DrawerItem label="COMMENTS" />
        <DrawerItem
          label="LOGOUT"
          onPress={() =>
            props.useNavigation.navigate("loginScreenStack", {
              screen: "Login",
            })
          }
        />
      </DrawerContentScrollView>
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          color: "grey",
        }}
      >
        Group 3
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: "center",
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: "center",
    marginLeft: 10,
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default SidebarMenu;
