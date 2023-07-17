import LoginSideImage from "@components/auth/LoginSideImage";
import LoginTermsText from "@components/auth/LoginTermsText";
import Button from "@components/form/Button";
import InfoCard from "@components/form/InfoCard";
import Input from "@components/form/Input";
import LanguageSelect from "@components/form/LanguageSelect";
import Heading from "@components/heading/Heading";
import RouterLink from "@components/link/RouterLink";
import api from "@configs/api";
import useAuth from "@hooks/useAuth";
import useTheme from "@hooks/useTheme";
import useTranslation from "@hooks/useTranslation";
import strings from "@lang/Lang";
import LogoWithName from "@partials/Icons/LogoWithName";
import ReCaptchaComponent from "@partials/ReCAPTCHA/ReCaptcha";
import { SignupFormValues, singUpValidation } from "@validations/signup";
import { Formik } from "formik";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export interface SignupProps {

}

const Signup: React.FC<SignupProps> = () => {

  const [language] = useTranslation();
  const { theme } = useTheme();
  const captchaRef = useRef<string | React.RefObject<ReCAPTCHA> | ((instance: ReCAPTCHA | null) => void) | null | undefined>();
  const { user, loggedOut, mutate } = useAuth()

  return (
    <div className="h-full min-h-screen lg:h-screen w-full flex dark:bg-dimGray">
      {user && !loggedOut && (
        <Navigate to="/" replace={true} />
      )}
      <div className="lg:w-4/5 hidden lg:inline-block">
        <LoginSideImage />
      </div>
      <div className="w-full bg-white dark:bg-black px-6">
        <div className="w-full max-w-md lg:max-w-lg mx-auto pt-12">
          <LogoWithName />
          <div className="pt-14">
            <Heading variant="bigTitle" text={strings.createAnAccountForFree} />
            <p className="text-dimGray/60 dark:text-white/60 mt-3 text-sm">{strings.login_subtext}</p>
          </div>
          <Formik<SignupFormValues>
            initialValues={{
              email: '',
              password: '',
              confirm_password: '',
              recaptcha: '',
            }}
            validate={singUpValidation}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting }) => {
              const formData = new FormData();
              formData.set('email', values.email);
              formData.set('password', values.password);
              formData.set('password_confirmation', values.confirm_password);


              const response = await fetch(api.signup, {
                method: 'POST',
                headers: {
                  "Accept": 'application/json',
                  'X-App-Locale': strings.getLanguage(),
                },
                credentials: 'include',
                body: formData,
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
            {({ errors, values, touched, handleChange, handleBlur, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, submitForm }) => (
              <form className="py-12 space-y-5" onSubmit={handleSubmit}>
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
                <Input
                  placeholder={strings.Password}
                  label={strings.Password}
                  type="password"
                  value={values.password}
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password && touched.password && errors.password}
                />
                <Input
                  placeholder={strings.Password}
                  label={strings.confirmPassword}
                  type="password"
                  value={values.confirm_password}
                  name="confirm_password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirm_password && touched.confirm_password && errors.confirm_password}
                />
                <LanguageSelect />
                <div className="transform scale-75 transition-transform my-2 origin-top-left md:transform-none">
                  <ReCaptchaComponent
                    ref={captchaRef}
                    key={`${language}_${theme}`}
                    hl={language}
                    error={touched?.recaptcha && Boolean(errors.recaptcha)}
                    helperText={touched?.recaptcha && errors.recaptcha}
                    onChange={(data) => {
                      setFieldTouched('recaptcha');
                      setFieldValue('recaptcha', data);
                    }}
                  />
                </div>
                <div className="pb-4"><LoginTermsText /></div>
                <InfoCard
                  variant="error"
                  message={errors.server}
                />
                <Button
                  fullWidth
                  type="submit"
                  onSubmit={submitForm}
                  loading={isSubmitting || isValidating}
                >
                  {strings.createAnAccount}
                </Button>
                <p className="text-center font-medium">{strings.formatString(strings.alreadyHaveAnAccount, <RouterLink to="/login">{strings.Login}</RouterLink>)}</p>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Signup;