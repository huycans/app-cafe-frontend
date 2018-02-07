import EStyleSheet from "react-native-extended-stylesheet";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const baseFontSize = 16;

const styles = EStyleSheet.create({
  $screenWidth: screenWidth,
  $screenHeight: screenHeight,
  container: {
    flex: 1,
    flexDirection: "column",
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  signinBoxCtn: {
    flex: 0.4,
    marginTop: screenHeight * 0.3,
    backgroundColor: "white",
    borderRadius: 6,
    padding: 10
  },
  logoCtn: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30
  },
  logo: { width: 60, height: 60 },
  forgetPassword: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  signupScreenCtn: {
    flex: 0.6,
    marginTop: 150,
    borderRadius: 6,
    padding: 10
  },
  baseText: {
    textAlign: "center",
    color: "white",
    fontSize: baseFontSize
  },
  smallText: {
    textAlign: "center",
    color: "white",
    fontSize: baseFontSize - 4
  },
  button: {
    borderRadius: 6,
    margin: 5,
    padding: 5
  },
  signinButton: { backgroundColor: "#cccc00", minWidth: 100, marginTop: 15 },
  signupButton: { backgroundColor: "#DCCC32", borderRadius: 20 },
  returnButton: {
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    borderStyle: "solid"
  },
  input: {
    width: 250,
    alignItems: "center",
    borderRadius: 4
  },
  signupInput: {
    backgroundColor: "transparent",
    textAlign: "center",
    color: "white"
  },
  error: {
    marginBottom: 5,
    textAlign: "center",
    color: "red",
    fontSize: baseFontSize + 10
  }
});
export default styles;
