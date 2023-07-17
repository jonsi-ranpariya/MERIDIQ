import AnchorLink from "@components/link/AnchorLink";
import strings from "@lang/Lang";
import { memo } from "react";

export interface LoginTermsTextProps {

}

const LoginTermsText: React.FC<LoginTermsTextProps> = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-xs">
      {strings.formatString(strings.loginTermsText, <AnchorLink variant="underline" target="_blank" rel="noopener noreferrer" href="https://meridiq.com/privacy-policy">{strings.login_terms_of_use}</AnchorLink>)}
    </p>
  );
}

export default memo(LoginTermsText);