import EStyleSheet from "react-native-extended-stylesheet";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = EStyleSheet.create({
  $buttonUnderlayColor: "#EBEBEB",
  listContainer: {
    width: "100%",
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: 0
    //backgroundColor: "transparent"
  },
  thumbnailImg: { flex: 1, height: 200 },
  previewText: { textAlign: "left", margin: 10 },
  footerStyle: {
    justifyContent: "flex-end"
  },
  dateText: {
    fontSize: 10
  },
  modalImg: {
    marginTop: 10,
    height: 200,
    width: 400,
    alignSelf: "center"
  },
  messageText: { textAlign: "auto", marginBottom: 15, marginTop: 15 },
  modalScrollview: { paddingLeft: 10, paddingRight: 10 },
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  WebView: {
    alignSelf: "center",
    marginBottom: 15,
    marginTop: 15,
    width: screenWidth - 50,
    flex: 1
  }
});

export { styles };
