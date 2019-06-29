import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import Styles from "./styles/RegisterScreenStyles";
import { Formik } from "formik";
import * as yup from "yup";
import { connect } from "react-redux";
import AuthActions from "../redux/AuthRedux";
import FormInput from "../components/FormInput";
import { Button, Icon } from "react-native-elements";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
    ),
  confirmPassword: yup
    .string()
    .required()
    .label("Confirm password")
    .test("passwords-match", "Passwords must match ya fool", function(value) {
      return this.parent.password === value;
    })
});

class RegisterScreen extends Component {
  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={Styles.container}>
          <Text style={{ fontSize: 56 }}>Register</Text>
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: ""
            }}
            onSubmit={(values, action) => {
              this.props.registerWithEmail(
                values.email,
                values.password,
                () => action.setSubmitting(false),
                (routeName, params) =>
                  this.props.navigation.navigate({ routeName, params })
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

                <FormInput
                  label="Password"
                  formikProps={formikProps}
                  formikKey="password"
                  placeholder="password123"
                  secureTextEntry
                />

                <FormInput
                  label="Confirm Password"
                  formikProps={formikProps}
                  formikKey="confirmPassword"
                  placeholder="password123"
                  secureTextEntry
                />

                <Button
                  title="Register"
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
                    onPress={() =>
                      this.props.registerWithGoogle((routeName, params) =>
                        this.props.navigation.navigate({ routeName, params })
                      )
                    }
                    size={18}
                  />
                  <Icon
                    name="facebook-f"
                    type="font-awesome"
                    color="blue"
                    reverse
                    onPress={() =>
                      this.props.registerWithFacebook((routeName, params) =>
                        this.props.navigation.navigate({ routeName, params })
                      )
                    }
                    size={18}
                  />
                </View>

                <View style={[Styles.row]}>
                  <Text>Already have an account</Text>
                  <Button
                    type="clear"
                    title="Login"
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
      </KeyboardAwareScrollView>

    );
  }
}

const mapStateToProps = ({ auth: { loading, error } }) => ({
  error,
  loading
});

const mapDispatchToProps = dispatch => ({
  registerWithEmail: (email, password, actions, navigate) =>
    dispatch(
      AuthActions.registerWithEmailRequest(email, password, actions, navigate)
    ),
  registerWithGoogle: navigate =>
    dispatch(AuthActions.logInWithGoogleRequest(navigate)),
  registerWithFacebook: navigate =>
    dispatch(AuthActions.logInWithFacebookRequest(navigate))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterScreen);
