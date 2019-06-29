import React from "react";
import { Switch } from "react-native";
import Styles from "./styles/FormSwitchStyles";
import FieldWrapper from "./FieldWrapper";

export default ({ formikKey, formikProps, label, ...rest }) => (
  <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
    <Switch
      value={formikProps.values[formikKey]}
      onValueChange={value => {
        formikProps.setFieldValue(formikKey, value);
      }}
      {...rest}
    />
  </FieldWrapper>
);
