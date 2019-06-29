import React from "react";
import { TextInput } from "react-native";
import Styles from "./styles/FormInputStyles";
import FieldWrapper from "./FieldWrapper";

export default ({ label, formikProps, formikKey, style, ...rest }) => {
  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <TextInput
        style={[
          Styles.container,
          style,
          formikProps.touched[formikKey] && formikProps.errors[formikKey]
            ? { borderColor: "red" }
            : null
        ]}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        {...rest}
      />
    </FieldWrapper>
  );
};
