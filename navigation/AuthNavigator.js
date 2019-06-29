import { createStackNavigator } from "react-navigation";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPassword from "../screens/ForgotPasswordScreen";

export default createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Register: {
      screen: RegisterScreen
    },
    ForgotPassword: {
      screen: ForgotPassword
    }
  },
  {
    headerMode: "none",
    initialRouteName: "ForgotPassword"
  }
);
