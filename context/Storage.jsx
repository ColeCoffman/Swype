import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getPersistantData(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function setPersistantData(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    // console.log("Saved '" + key + "' to local storage! (" + value + ")");
  } catch (e) {
    console.error(e);
  }
}
