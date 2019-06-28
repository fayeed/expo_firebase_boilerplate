import { createStackNavigator } from "react-navigation";
import AuthScreen from "../screens/AuthScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPassword from "../screens/ForgotPasswordScreen";

export default createStackNavigator(
  {
    Auth: {
      screen: AuthScreen
    },
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
    headerMode: "none"
  }
);
