import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    // alignItems: "center",
    // justifyContent: "space-around",
    flex: 1,
    width: "100%"
  },
  form: {
    height: "30%",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "flex-start"
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginVertical: 5,
    width: width - 40
  },
  button: {
    padding: 10
  }
});
