import React, { Component } from "react";
import { View, Text } from "react-native";
import Styles from "./styles/ForgotPasswordScreenStyles";
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
    .required()
});

class ForgotPasswordScreen extends Component {
  render() {
    return (
      <View style={Styles.container}>
        <Text style={{ fontSize: 48, marginTop: 20, marginHorizontal: 20 }}>
          Forgot Password
        </Text>
        <Text style={{ marginHorizontal: 20 }}>
          Please eneter your email address and we'll send you an email to reset
          your password
        </Text>
        <Formik
          initialValues={{
            email: ""
          }}
          onSubmit={(values, action) => {
            this.props.forgotPassword(values.email, () =>
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

              <Button
                title="Send Email"
                onPress={formikProps.handleSubmit}
                loading={formikProps.isSubmitting}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.button}
              />
            </View>
          )}
        </Formik>
      </View>
    );
  }
}

const mapStateToProps = ({ auth: { loading, error } }) => ({
  loading,
  error
});

const mapDispatchToProps = dispatch => ({
  forgotPassword: email => dispatch(AuthActions.forgotPasswordRequest(email))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordScreen);
