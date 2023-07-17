import React, { RefObject } from "react";
import ReCAPTCHA, { ReCAPTCHAProps } from "react-google-recaptcha";
import useTheme from "../../hooks/useTheme";
import TinyError from "../Error/TinyError";

export interface ReCaptchaComponentProps extends Omit<ReCAPTCHAProps, 'sitekey'> {
    error?: boolean,
    helperText?: string | false | undefined,
}

const ReCaptchaComponent = React.forwardRef(({ error = false, helperText, ...props }: ReCaptchaComponentProps, ref) => {
    const { theme, isSystemDarkTheme } = useTheme();
    return (
        <>
            <ReCAPTCHA
                ref={ref as RefObject<ReCAPTCHA>}
                {...props}
                key={`${theme}_${isSystemDarkTheme}`}
                theme={theme === 'dark' || (theme === 'system' && isSystemDarkTheme) ? 'dark' : 'light'}
                size="normal"
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''}
            />
            <TinyError
                error={error}
                helperText={helperText}
            />
        </>
    );
});

export default ReCaptchaComponent;