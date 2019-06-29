import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import Styles from "./styles/LoginScreenStyles";
import { Formik } from "formik";
import * as yup from "yup";
import { connect } from "react-redux";
import AuthActions from "../redux/AuthRedux";
import FormInput from "../components/FormInput";
import { Button, Icon } from "react-native-elements";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .label("Email")
    .email()
    .required(),
  password: yup
    .string()
    .label("Password")
    .required()
    .min(8, "Password must be 8 characters long.")
    .test(
      "password-regex",
      "Password must be a mixture of alphabets and numbers",
      value => {
        const passwordRegex = /^(?=.*\d).{8,20}$/;
        const passwordError = passwordRegex.test(value);
        return !passwordError;
      }
    )
});

class LoginScreen extends Component {
  render() {
    return (
      <View style={Styles.container}>
        <Image
          source={require("../assets/images/icon.png")}
          style={Styles.icon}
        />
        <Formik
          initialValues={{
            email: "",
            password: ""
          }}
          onSubmit={(values, action) => {
            this.props.logInWithEmail(values.email, values.password, () =>
              action.setSubmitting(false)
            );
          }}
          validationSchema={validationSchema}
        >
          {formikProps => (
            <View style={Styles.form}>
              <FormInput
                label="Email"
                formikProps={formikProps}
                formikKey="email"
                placeholder="jhondoe@example.com"
                // autoFocus
              />

              <View style={{ alignItems: "flex-start" }}>
                <FormInput
                  label="Password"
                  formikProps={formikProps}
                  formikKey="password"
                  placeholder="password123"
                  secureTextEntry
                />

                <Button
                  type="clear"
                  title="Forgot Password"
                  onPress={() =>
                    this.props.navigation.navigate({
                      routeName: "ForgotPassword"
                    })
                  }
                  containerStyle={Styles.registerButtonContainer}
                  buttonStyle={Styles.registeButton}
                  titleStyle={Styles.registerTextStyle}
                />
              </View>

              <Button
                title="LogIn"
                onPress={formikProps.handleSubmit}
                loading={formikProps.isSubmitting}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.button}
              />

              <View style={Styles.row}>
                <Icon
                  type="font-awesome"
                  name="google"
                  color="red"
                  reverse
                  onPress={() => this.props.logInWithGoogle()}
                  size={18}
                />
                <Icon
                  name="facebook-f"
                  type="font-awesome"
                  color="blue"
                  reverse
                  onPress={() => this.props.logInWithFacebook()}
                  size={18}
                />
              </View>

              <View style={[Styles.row]}>
                <Text>Don't have an account rgister</Text>
                <Button
                  type="clear"
                  title="Register"
                  onPress={() =>
                    this.props.navigation.navigate({ routeName: "Register" })
                  }
                  containerStyle={Styles.registerButtonContainer}
                  buttonStyle={Styles.registeButton}
                  titleStyle={Styles.registerTextStyle}
                />
              </View>
            </View>
          )}
        </Formik>
      </View>
    );
  }
}

const mapStateToProps = ({ auth: { loading, error } }) => ({ loading, error });

const mapDispatchToProps = dispatch => ({
  logInWithEmail: (email, password, action) =>
    dispatch(AuthActions.logInWithEmailRequest(email, password, action)),
  logInWithGoogle: () => dispatch(AuthActions.logInWithGoogleRequest()),
  logInWithFacebook: () => dispatch(AuthActions.logInWithFacebookRequest())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
