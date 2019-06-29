import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginVertical: 5,
    width: width - 40
  },
  label: {
    marginBottom: 3
  },
  error: {
    color: "red"
  }
});
