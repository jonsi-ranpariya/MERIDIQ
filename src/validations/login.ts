import strings from "@lang/Lang";
import { FormikErrors } from "formik";

export interface LoginFormValues {
  email: string,
  password: string,
  server?: string,
  device_token?: string,
  otp?: string,
}

export interface DeviceTokens {
  email: string,
  token: string,
}


export const loginValidation = (values: LoginFormValues): void | object | Promise<FormikErrors<LoginFormValues>> => {
  const errors: FormikErrors<LoginFormValues> = {};
  if (!values.email) {
    errors.email = strings.email_is_required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = strings.please_provide_valid_email;
  }

  if (!values.password) {
    errors.password = strings.password_is_required;
  }

  return errors;
}