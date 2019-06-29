import React from "react";
import { View, Text } from "react-native";
import Styles from "./styles/FieldWrapperStyles";

export default ({ children, label, formikProps, formikKey }) => (
  <View style={Styles.wrapper}>
    <Text style={Styles.label}>{label}</Text>
    {children}
    {formikProps.touched[formikKey] && formikProps.errors[formikKey] ? (
      <Text style={Styles.error}>{formikProps.errors[formikKey]}</Text>
    ) : null}
  </View>
);
