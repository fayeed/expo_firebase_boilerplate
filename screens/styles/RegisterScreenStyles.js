import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    width: width,
    height: height
  },
  icon: {
    width: 150,
    height: 150
  },
  form: {
    height: "80%",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "flex-start"
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginVertical: 5,
    width: width - 40
  },
  registerButtonContainer: {
    margin: 0,
    marginLeft: 20
    // alignItems: "center"
  },
  button: {
    padding: 10
  },
  registeButton: {
    padding: 0
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  registerTextStyle: {
    fontSize: 14
  }
});
