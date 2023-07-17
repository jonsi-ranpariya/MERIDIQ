import LoginSideImage from "@components/auth/LoginSideImage";
import LoginTermsText from "@components/auth/LoginTermsText";
import Button from "@components/form/Button";
import InfoCard from "@components/form/InfoCard";
import Input from "@components/form/Input";
import SelectLanguage from "@components/form/LanguageSelect";
import Heading from "@components/heading/Heading";
import RouterLink from "@components/link/RouterLink";
import api from "@configs/api";
import useAuth from "@hooks/useAuth";
import useLocalStorage from "@hooks/useLocalStorage";
import strings from "@lang/Lang";
import LogoWithNname from "@partials/Icons/LogoWithName";
import { DeviceTokens, LoginFormValues, loginValidation } from "@validations/login";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {

  const { loginUser, mutate, user, loggedOut } = useAuth();

  const { storedValue: deviceTokens, setStorageValue: setDeviceTokens } = useLocalStorage<DeviceTokens[]>('device_tokens', []);
  const [verify, setVerify] = useState(false);

  const [resend, setResend] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const timer = () => setResend((val) => val - 1);
  const { setStorageValue: setUpgradeModalShown } = useLocalStorage("upgrade_plan_showed", false)


  useEffect(() => {
    if (!verify || resend <= 0) return;
    const id = setInterval(timer, 1000);

    return () => clearInterval(id);
  }, [resend, verify])

  return (
    <div className="h-full min-h-screen lg:h-screen w-full flex dark:bg-dimGray">
      {user && !loggedOut && (
        <Navigate to={user.user_role === api.masterAdminRole ? '/admin' : "/"} replace={true} />
      )}
      <div className="lg:w-4/5 hidden lg:inline-block">
        <LoginSideImage />
      </div>
      <div className="w-full bg-white dark:bg-black px-6">
        <div className="w-full max-w-md lg:max-w-lg mx-auto pt-12">
          <LogoWithNname />
          <div className="pt-14">
            <Heading variant="bigTitle" text={strings.LoginNow} />
            <p className="text-dimGray/60 dark:text-white/60 mt-3 text-sm">{strings.login_subtext}</p>
          </div>
          <Formik<LoginFormValues>
            initialValues={{
              email: '',
              password: '',
            }}
            validate={loginValidation}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting }) => {
              const data = await loginUser({
                ...values,
                device_token: (Array.isArray(deviceTokens) && deviceTokens.find((deviceToken) => deviceToken.email === values.email)?.token) || undefined,
              });
              if (data) {
                setUpgradeModalShown(false)
                if (data.status === '4') {
                  setVerify(true);
                  setResend(69);
                  if (Array.isArray(deviceTokens)) {
                    const currentDevice = deviceTokens.find((deviceToken) => deviceToken.email === values.email);
                    const newDeviceTokens = currentDevice ?
                      deviceTokens.map((deviceToken) => {
                        if (deviceToken.email === values.email) {
                          return {
                            email: deviceToken.email,
                            token: data?.data?.device_token || ''
                          };
                        }
                        return deviceToken;
                      })
                      : [...deviceTokens, { email: values.email, token: data?.data?.device_token || '' }];
                    setDeviceTokens(newDeviceTokens);
                  } else {
                    setDeviceTokens([{ email: values.email, token: data?.data?.device_token || '' }]);
                  }
                  toast.success(data.message || 'otp send to your email.');
                }
                if (data.status === '2' || data.status === '3') {
                  setErrors({
                    server: data.message,
                  });
                }
                if (data.status === '4') {
                  await mutate();
                  toast.error(data.message || 'logged in successfully.');
                }
                if (data.status === '1') {
                  await mutate();
                  sessionStorage.removeItem('loggedOutShown')
                  toast.success(data.message || 'logged in successfully.');
                }
                if (data.status === '0') {
                  setErrors({
                    server: data.message,
                  });
                }
              }

              setSubmitting(false);
            }}
          >
            {({ errors, values, touched, handleChange, handleBlur, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError }) => (
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
                <div className="">
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
                  <p className="text-sm text-right mt-1"><RouterLink to="/forgot-password">{strings.login_forgot_password}?</RouterLink></p>
                </div>
                <div className="">
                  {verify
                    ? (<Input
                      label={strings.verification_code_in_email}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\d{4}"
                      placeholder="XXXX"
                      value={values.otp}
                      name="otp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.otp && touched.otp && errors.otp}
                    />
                    ) : ''}
                  {verify && resend === 0
                    ? (
                      <ResendButton
                        disabled={resendLoading}
                        onClick={() => {
                          const currentDevice = deviceTokens?.find((deviceToken) => deviceToken.email === values.email);
                          if (Array.isArray(deviceTokens) && currentDevice) {

                            setResendLoading(true);
                            fetch(api.otpResend, {
                              method: 'POST',
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'X-App-Locale': strings.getLanguage(),
                              },
                              body: JSON.stringify({
                                device_token: currentDevice?.token || undefined,
                              }),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                setResendLoading(false);
                                if (data.status === '4') {
                                  setVerify(true);
                                  setResend(69);
                                  toast.success(data.message || 'otp send to your email.')
                                }
                                if (data.status === '0') {
                                  setFieldError('server', data?.message || undefined);
                                }
                              });
                          }
                        }}
                      />
                    )
                    : verify ? (
                      <ResendIn resend={resend} />
                    ) : ''}
                </div>
                <SelectLanguage />
                <div className="pb-4"><LoginTermsText /></div>
                <InfoCard
                  variant="error"
                  message={errors.server}
                />
                <Button
                  fullWidth
                  type="submit"
                  onSubmit={() => handleSubmit()}
                  loading={isSubmitting || isValidating || resendLoading}
                >
                  {strings.LoginNow}
                </Button>
                <p className="text-center font-medium">{strings.formatString(strings.dontHaveAccountYet, <RouterLink to="/sign-up">{strings.Register}</RouterLink>)}</p>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div >
  );
}


function ResendIn({ resend }: { resend?: number }) {
  return (
    <div className="text-right">
      <button
        className="text-sm text-gray-500 dark:text-gray-400"
        type="button"
        disabled
      >
        {`resend code in ${resend}`}
      </button>
    </div>
  );
}

function ResendButton({ disabled, onClick }: {
  disabled: boolean,
  onClick: () => void,
}) {
  return (
    <div className="text-right">
      <button
        className="text-sm text-gray-400 dark:text-gray-400"
        type="button"
        disabled={disabled}
        onClick={onClick}
      >
        resend code?
      </button>
    </div>
  );
}

export default Login;