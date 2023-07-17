import strings from "@lang/Lang";
import { FormikErrors } from "formik";

export interface SignupSetupFormValues {
  first_name: string,
  last_name: string,
  company_name: string,
  number_of_employees: string,
  country: string,
  country_code: string,
  mobile_number: string,
  server?: string,
}

export const singUpSetupValidation = (values: SignupSetupFormValues): void | object | Promise<FormikErrors<SignupSetupFormValues>> => {
  const errors: FormikErrors<SignupSetupFormValues> = {};

  if (!values.first_name) {
    errors.first_name = strings.first_name_is_required;
  }

  if (!values.last_name) {
    errors.last_name = strings.last_name_is_required;
  }

  if (!values.company_name) {
    errors.company_name = strings.company_name_is_required;
  }

  if (!values.number_of_employees) {
    errors.number_of_employees = strings.Required;
  }
  if (!values.country) {
    errors.country = strings.country_is_required;
  }

  if (!values?.mobile_number) {
    errors.mobile_number = strings.phone_number_is_required;
  } else if (values?.mobile_number && Number.isNaN(Number(values.mobile_number))) {
    errors.mobile_number = strings.phone_number_must_be_numeric;
  } else if (!/^[0-9]*$/.test(values.mobile_number)) {
    errors.mobile_number = strings.phone_number_must_be_numeric;
  }

  if (!values?.country_code) {
    errors.country_code = strings.country_code_is_required;
  } else if (values?.mobile_number && !values?.country_code) {
    errors.country_code = strings.country_code_is_required;
  }

  return errors;
}