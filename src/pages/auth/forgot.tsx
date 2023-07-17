import LoginSideImage from "@components/auth/LoginSideImage";
import Button from "@components/form/Button";
import InfoCard from "@components/form/InfoCard";
import Input from "@components/form/Input";
import Heading from "@components/heading/Heading";
import RouterLink from "@components/link/RouterLink";
import api from "@configs/api";
import strings from "@lang/Lang";
import LogoWithName from "@partials/Icons/LogoWithName";
import { ForgotFormValues, forgotValidation } from "@validations/forgot";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface ForgotProps {

}

const Forgot: React.FC<ForgotProps> = () => {

  const navigate = useNavigate()

  return (
    <div className="h-screen w-full flex dark:bg-dimGray">
      <div className="lg:w-4/5 hidden lg:inline-block">
        <LoginSideImage />
      </div>
      <div className="w-full bg-white dark:bg-black px-6">
        <div className="w-full max-w-md lg:max-w-lg mx-auto pt-12">
          <LogoWithName />
          <div className="pt-14">
            <Heading variant="bigTitle" text={`${strings.login_forgot_password}?`} />
            <p className="text-dimGray/60 dark:text-white/60 mt-3 text-sm">{strings.forgot_subtext}</p>
          </div>
          <Formik<ForgotFormValues>
            initialValues={{
              email: '',
            }}
            validate={forgotValidation}
            onSubmit={(values, { resetForm, setErrors, setSubmitting }) => {
              fetch(api.forgot, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'X-App-Locale': strings.getLanguage(),
                },
                body: JSON.stringify(values),
              })
                .then((response) => response.json())
                .then(async (data) => {
                  setSubmitting(false);
                  if (data.status === '1') {
                    resetForm();
                    toast.success(data.message || 'Password has been sent to your email.', {
                      onClose: () => navigate('/login')
                    })
                  } else {
                    setErrors({
                      server: data.message || 'server error, contact admin.',
                    });
                  }
                });
            }}
          >
            {({ errors, values, touched, submitForm, dirty, setFieldValue, handleChange, handleBlur, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError }) => (
              <form onSubmit={handleSubmit} className="py-12 space-y-5">
                <Input
                  placeholder={strings.Email}
                  label={strings.Email}
                  type="email"
                  value={values.email}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email && touched.email && errors.email}
                />
                <InfoCard
                  variant="error"
                  message={errors.server}
                />
                <Button
                  fullWidth
                  size="big"
                  type="submit"
                  loading={isSubmitting || isValidating}
                  onClick={submitForm}
                >
                  {strings.Submit}
                </Button>
                <p className="text-sm max-w-md mx-auto text-center">
                  {strings.formatString(
                    strings.forgot_again_message,
                    <span onClick={submitForm} className="text-primary dark:text-primaryLight hover:underline cursor-pointer">{strings.forgot_again_resend}</span>
                  )}
                </p>
                <p className="text-center text-sm">
                  <RouterLink to="/login" >{strings.back}</RouterLink>
                </p>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Forgot;