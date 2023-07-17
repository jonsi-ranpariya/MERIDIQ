import Checkbox from "@partials/MaterialCheckbox/MaterialCheckbox";
import { getIn, useFormikContext } from "formik";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import api from "../../../configs/api";
import { commonFetch, consentPermissions } from "../../../helper";
import useRegistrationPortal from "../../../hooks/useRegistrationPortal";
import { CompanyClientExtraFieldResponse, SettingResponse, UsersResponse } from "../../../interfaces/common";
import strings from "../../../lang/Lang";
import TinyError from "../../../partials/Error/TinyError";
import Modal from "../../../partials/MaterialModal/Modal";

export interface RegistrationPortalConsentProps {

}

const RegistrationPortalConsent: React.FC<RegistrationPortalConsentProps> = () => {
  const { companyId }: { companyId?: string } = useParams();
  const { data: companyData } = useSWR<UsersResponse, Error>(api.companyPublicUsers.replace(":id", companyId!), commonFetch);
  const { isLastStep, hasConsent, setHasConsent } = useRegistrationPortal();
  const {
    errors
  } = useFormikContext();
  const { data: settingData } = useSWR<SettingResponse, Error>(api.settingPublic.replace(":id", companyId!), commonFetch);

  const { data: extraFieldData } = useSWR<CompanyClientExtraFieldResponse, Error>(api.companyClientExtraFieldsPublic.replace(":id", companyId!), commonFetch);
  const [openModal, setOpenModel] = useState(false);

  const fields = React.useMemo(() => {
    try {
      return consentPermissions(settingData?.data ?? [], extraFieldData?.data ?? []).map((v) => `•    ${v}<br>`).join('');
    } catch (error) {
      return '';
    }
  }, [settingData?.data, extraFieldData?.data]);

  if (!isLastStep) {
    return <></>;
  }

  return (
    <div>
      <Modal
        open={openModal}
        title={strings.consent}
        handleClose={() => setOpenModel(false)}
      >
        <div className="p-4">
          <div>
            <div className="text-lg">{strings.consent_title}</div>
            <br />
            <div
              dangerouslySetInnerHTML={{
                __html: strings.formatString(strings.consent_body, {
                  company_name: companyData?.data?.find(e => e)?.company?.company_name ?? '',
                  fields: fields,
                }) as string ?? ''
              }}
            />
          </div>
        </div>
      </Modal>
      <br />
      <div className="flex ">
        <Checkbox
          checked={hasConsent}
          onChange={(ev) => {
            setHasConsent(ev.currentTarget.checked);
          }}
          name={`checkbox_consent`}
          color="primary"
          label=""
        />
        <p
          className="cursor-pointer"
          onClick={() => {
            setHasConsent(!hasConsent);
          }}
        >
          {strings.consent_agree0}
          <button onClick={(e) => {
            e.stopPropagation()
            setOpenModel(true)
          }}
            className="font-bold underline">
            {strings.consent_agree1}
          </button>
          {strings.consent_agree2}
        </p>
      </div>
      <TinyError error={!!getIn(errors, 'consent')} helperText={getIn(errors, 'consent')} />
    </div>
  );
}

export default RegistrationPortalConsent;