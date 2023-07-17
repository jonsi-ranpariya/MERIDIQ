import Card from "@components/card";
import Button from "@components/form/Button";
import CountrySelect from "@components/form/CountrySelect";
import InfoCard from "@components/form/InfoCard";
import Input from "@components/form/Input";
import PhoneSelect from "@components/form/PhoneSelect";
import Select from "@components/form/Select";
import Heading from "@components/heading/Heading";
import api from "@configs/api";
import { findCountryByCode, findCountryByName } from "@configs/countries";
import useAuth from "@hooks/useAuth";
import strings from "@lang/Lang";
import LogoWithName from "@partials/Icons/LogoWithName";
import { SignupSetupFormValues, singUpSetupValidation } from "@validations/signup-setup";
import { Formik } from "formik";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface SetUpProps {

}

const employees = Array.from(Array(15).keys())

const SignupSetUp: React.FC<SetUpProps> = () => {
  const { user, mutate } = useAuth()

  const superUser = user?.company?.email === user?.email;
  const companyNotSubscribed = user?.company?.is_subscribed === false;
  const setupIncomplete = [user?.company?.company_name, user?.first_name, user?.last_name, user?.company?.country].includes("")

  return (
    <div className="">
      {
        superUser && !setupIncomplete && companyNotSubscribed && <Navigate to={'/sign-up/subscription'} />
      }
      <div className="container px-6 mt-8">
        <LogoWithName />
      </div>
      <div className="container max-w-4xl mt-6 px-6">
        <Card className="text-dimGray px-6">
          <div className="max-w-lg mx-auto py-4">
            <div className="pb-6"><Heading text={strings.letsSetUpYourAccount} variant="bigTitle" /></div>
            <Formik<SignupSetupFormValues>
              key={"setup_form"}
              initialValues={{
                first_name: user?.first_name ?? '',
                last_name: user?.last_name ?? '',
                company_name: user?.company?.company_name ?? '',
                country: user?.company?.country ?? '',
                country_code: user?.company?.country_code ?? '',
                mobile_number: user?.company?.mobile_number ?? '',
                number_of_employees: user?.company?.settings?.find(s => s.key === "NUMBER_OF_EMPLOYEES")?.value ?? '1',
              }}
              enableReinitialize
              validate={singUpSetupValidation}
              onSubmit={async (values, { resetForm, setErrors, setSubmitting }) => {

                const response = await fetch(api.signupSetup, {
                  method: 'POST',
                  headers: {
                    "Accept": 'application/json',
                    'X-App-Locale': strings.getLanguage(),
                    "Content-Type": "application/json",
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                    ...values
                  }),
                });
                const data = await response.json();
                if (data.status === '1') {
                  resetForm();
                  toast.success(data.message || 'Your account has been registered.');
                  await mutate();
                }
                if (['2', '3', '0'].includes(data.status)) {
                  setErrors({
                    server: data?.message || 'server error. please try contact admin.',
                  });
                }
                setSubmitting(false);
              }}
            >
              {({ errors, values, touched, handleChange, handleBlur, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, submitForm }) => {
                return (
                  <form className="py-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Input
                        placeholder={strings.Firstname}
                        label={strings.Firstname}
                        value={values.first_name}
                        type="first_name"
                        name="first_name"
                        required
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.first_name && touched.first_name && errors.first_name}
                      />
                      <Input
                        placeholder={strings.Lastname}
                        label={strings.Lastname}
                        value={values.last_name}
                        type="last_name"
                        required
                        name="last_name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.last_name && touched.last_name && errors.last_name}
                      />
                    </div>
                    <Input
                      label={strings.CompanyName}
                      placeholder={strings.CompanyName}
                      value={values.company_name}
                      type="company_name"
                      required
                      name="company_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.company_name && touched.company_name && errors.company_name}
                    />
                    <Select
                      value={values.number_of_employees}
                      onChange={(val) => setFieldValue("number_of_employees", val)}
                      label={strings.numberOfEmployees}
                      displayValue={(val) => val}
                    >
                      {employees.map(number => <Select.Option key={number} value={number + 1}>{number + 1}</Select.Option>)}
                    </Select>
                    <InfoCard variant="error" message={errors.server} />
                    <CountrySelect
                      defaultValue={findCountryByName(values.country)}
                      onChange={(val) => {
                        if (val && val?.name !== values.country) {
                          setFieldValue("country", val.name)
                        }
                        if (!values.country_code) {
                          setFieldValue('country_code', val?.code);
                        }
                      }}
                      required
                      error={errors.country && touched.country && errors.country}
                    />
                    <PhoneSelect
                      value={values.mobile_number}
                      countryValue={findCountryByCode(values.country_code)}
                      required
                      onChangeCountry={(value) => {
                        setFieldTouched('country_code');
                        setFieldValue('country_code', value?.code);
                      }}
                      onChange={(number) => {
                        setFieldTouched('mobile_number');
                        setFieldValue('mobile_number', number);
                      }}
                      error={touched?.mobile_number && errors.mobile_number}
                      countryError={touched?.country_code && errors.country_code}
                    />
                    <Button
                      size="big"
                      fullWidth
                      type="submit"
                      loading={isSubmitting || isValidating}
                      onClick={submitForm}
                    >
                      {strings.startJourney}
                    </Button>
                  </form>
                )
              }}
            </Formik>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SignupSetUp;