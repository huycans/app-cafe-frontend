import * as React from "react";
import { View, Image, Text } from "react-native";
import styles from "./Styles";
import { Dimensions } from "react-native";

const imageWidth = Dimensions.get("window").width / 2;

export default class SplashScreen extends React.Component {
  render() {
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
  }
}
