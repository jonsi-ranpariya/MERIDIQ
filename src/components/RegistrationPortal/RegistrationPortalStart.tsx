import CopyIcon from "@icons/Copy";
import { FC } from "react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useTranslation from "../../hooks/useTranslation";
import strings from "../../lang/Lang";

export interface RegistrationPortalStartProps {

}

const RegistrationPortalStart: FC<RegistrationPortalStartProps> = () => {

  const { user } = useAuth();
  const [language] = useTranslation();

  const PortalUrl = `${process.env.PUBLIC_URL || ''}/registration/${user?.company?.encrypted_id.toString()}?lang=${language}`;
  const PortalUrlView = `${process.env.PUBLIC_URL || ''}/registration/${user?.company?.encrypted_id.toString()}`;

  const onCopyClick = () => {
    navigator.clipboard.writeText(PortalUrl).then(() => {
      toast.success(strings.copiedToClipboard)
    }).catch(() => {
      toast.error(strings.failedToCopy)
    })
  }

  return (
    <div className="px-3 py-2 space-y-4 flex flex-col items-start">
      {p(strings.reg_portal_1)}
      <button
        className="px-6 py-3 rounded-xl hover:bg-primary/20 cursor-pointer transition-all bg-primary/[12%] dark:bg-primaryLight/10 dark:text-white text-dimGray"
        onClick={onCopyClick}
      >
        <p className="flex items-center space-x-4 break-all text-left">
          <span>{PortalUrlView}</span>
          <span>
            <CopyIcon className="text-primary dark:text-primaryLight text-lg" />
          </span>
        </p>
      </button>
      {p(strings.reg_portal_2)}
    </div>
  );

  function p(string: string) {
    return <p className="max-w-6xl text-sm text-mediumGray dark:text-gray-200">{string}</p>
  }
}

export default RegistrationPortalStart;