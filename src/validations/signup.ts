import strings from "@lang/Lang";
import { FormikErrors } from "formik";

export interface SignupFormValues {
  email: string,
  password: string,
  confirm_password: string,
  recaptcha: string,
  server?: string,
}

export const singUpValidation = (values: SignupFormValues): void | object | Promise<FormikErrors<SignupFormValues>> => {
  const errors: FormikErrors<SignupFormValues> = {};

  if (!values.email) {
    errors.email = strings.email_is_required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = strings.please_provide_valid_email;
  }

  if (!values.password) {
    errors.password = strings.password_is_required;
  } else if (values.password.length <= 8) {
    errors.password = strings.password_length_must_be_greater_then_8;
  } else if (Array.from(values.password.match(/[a-z]/g) || []).length === 0) {
    errors.password = strings.password_must_contain_a_lower_case_letter;
  } else if (Array.from(values.password.match(/[A-Z]/g) || []).length === 0) {
    errors.password = strings.password_must_contain_a_upper_case_letter;
  } else if (Array.from(values.password.match(/[0-9]/g) || []).length === 0) {
    errors.password = strings.password_must_contain_a_number;
  }

  if (!values.confirm_password) {
    errors.confirm_password = strings.confirm_password_is_required;
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = strings.password_not_matched;
  }

  if (!values.recaptcha) {
    errors.recaptcha = strings.validate_captcha;
  }

  return errors;
}