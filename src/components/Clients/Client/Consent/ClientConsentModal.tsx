import CancelButton from '@partials/MaterialButton/CancelButton';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../../../configs/api';
import { commonFetch, consentPermissions, formatDate } from '../../../../helper';
import useAuth from '../../../../hooks/useAuth';
import useTranslation from '../../../../hooks/useTranslation';
import { CompanyClientExtraFieldResponse, SettingResponse } from '../../../../interfaces/common';
import { Consent } from '../../../../interfaces/model/client';
import strings from '../../../../lang/Lang';
import Button from '@components/form/Button';
import Modal from '../../../../partials/MaterialModal/Modal';

export interface ClientConsentModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
    consent?: Consent,
}

const ClientConsentModal: React.FC<ClientConsentModalProps> = ({
    openModal,
    setOpenModal,
    mutate = async () => {},
    consent,
}) => {
    const navigate = useNavigate();
    const { clientId }: { clientId?: string } = useParams();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCancelSubmitting, setIsCancelSubmitting] = useState(false);
    const { data: settingData } = useSWR<SettingResponse, Error>(api.setting, commonFetch);
    const {
        data: extraFieldData,
    } = useSWR<CompanyClientExtraFieldResponse, Error>(api.companyClientExtraFields, commonFetch);
    const [language] = useTranslation();

    const handleModelClose = () => {
        if (isSubmitting) return;
        setOpenModal(false);
    }

    const fields = React.useMemo(() => {
        try {
            if (consent?.verified_at && consent?.fields) {
                return JSON.parse(consent.fields)[language].map((v: string) => `•    ${v}<br>`).join('');
            }
            return consentPermissions(settingData?.data ?? [], extraFieldData?.data ?? []).map((v) => `•    ${v}<br>`).join('');
        } catch (error) {
            return consentPermissions(settingData?.data ?? [], extraFieldData?.data ?? []).map((v) => `•    ${v}<br>`).join('');
        }
    }, [consent, settingData?.data, language, extraFieldData?.data]);

    return (
        <Modal
            open={openModal}
            loading={isSubmitting || isCancelSubmitting}
            title={strings.consent}
            handleClose={handleModelClose}
            submitButton={
                <Button loading={isSubmitting} disabled={isSubmitting || isCancelSubmitting} onClick={onApproveClick}>
                    {consent?.verified_at ? formatDate(consent.verified_at) : strings.approve_consent}
                </Button>
            }
            cancelButton={
                <CancelButton loading={isCancelSubmitting} disabled={isSubmitting || isCancelSubmitting} onClick={onCancelClick}>
                    {!consent?.verified_at ? strings.send_consent_mail_client : strings.remove_consent}
                </CancelButton>
            }
        >
            <div className="p-4">
                <div>
                    <div className="text-lg">{strings.consent_title}</div>
                    <br />
                    <div
                        dangerouslySetInnerHTML={{
                            __html: strings.formatString(strings.consent_body, {
                                company_name: user?.company?.company_name ?? '',
                                fields: fields,
                            }) as string ?? ''
                        }}
                    />
                </div>
            </div>
        </Modal>
    );

    async function onApproveClick() {
        if (consent?.verified_at) return;
        setIsSubmitting(true);
        const response = await fetch(`${api.clientConsentStore.replace(':id', clientId || '')}`, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'X-CSRF-TOKEN': 'test',
                'X-App-Locale': strings.getLanguage(),
                'Content-Type': 'application/json',
            },
            credentials: "include",
        })

        const data = await response.json();

        if (response.status === 401) {
            navigate('/');
        }

        if (data.status === '1') {
            toast.success(data.message);
            await mutate();
        } else {
            toast.error(data.message || 'server error, please contact admin.');
        }
        setIsSubmitting(false);
        setOpenModal(false);

    }

    async function onCancelClick() {

        setIsCancelSubmitting(true);

        if (consent?.verified_at) {
            const response = await fetch(`${api.clientConsentCancel.replace(':id', clientId || '')}`, {
                method: 'DELETE',
                headers: {
                    "Accept": 'application/json',
                    'X-CSRF-TOKEN': 'test',
                    'X-App-Locale': strings.getLanguage(),
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            })

            const data = await response.json();

            if (response.status === 401) {
                navigate('/');
            }

            if (data.status === '1') {
                toast.success(data.message);
                await mutate();
            } else {
                toast.error(data.message || 'server error, please contact admin.');
            }
            setIsCancelSubmitting(false);
            setOpenModal(false);
            return;
        }

        const response = await fetch(`${api.clientConsentSendMail.replace(':id', clientId || '')}`, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'X-CSRF-TOKEN': 'test',
                'X-App-Locale': strings.getLanguage(),
                'Content-Type': 'application/json',
            },
            credentials: "include",
        })

        const data = await response.json();

        if (response.status === 401) {
            navigate('/');
        }

        if (data.status === '1') {
            toast.success(data.message);
            await mutate();
        } else {
            toast.error(data.message || 'server error, please contact admin.');
        }
        setIsSubmitting(false);
        setOpenModal(false);
    }


}

export default ClientConsentModal; 