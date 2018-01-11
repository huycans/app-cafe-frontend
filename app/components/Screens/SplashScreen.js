import * as React from "react";
import { View, Image, Text } from "react-native";
import styles from "./Styles";
import { Dimensions } from "react-native";

const imageWidth = Dimensions.get("window").width / 2;

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={require("../../img/yama.png")}
        style={{ width: imageWidth }}
      />
      <Text>Loading...</Text>
    </View>
  );
};

export default SplashScreen;
