import strings from "@lang/Lang";
import { FormikErrors } from "formik";

export interface ForgotFormValues {
  email: string,
  server?: string,
}

export const forgotValidation = (values: ForgotFormValues): void | object | Promise<FormikErrors<ForgotFormValues>> => {
  const errors: FormikErrors<ForgotFormValues> = {};
  if (!values.email) {
    errors.email = strings.email_is_required;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = strings.please_provide_valid_email;
  }

  return errors;
}