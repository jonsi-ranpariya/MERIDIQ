
import Skeleton from '@components/Skeleton/Skeleton';
import CancelButton from '@partials/MaterialButton/CancelButton';
import * as React from 'react';
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useSWR from "swr";
import api from "../../configs/api";
import { commonFetch, deleteCompanyClientExtraField, saveCompanyClientExtraField, saveSetting } from "../../helper";
import { CompanyClientExtraFieldResponse, SettingResponse, SettingTypes } from "../../interfaces/common";
import strings from "../../lang/Lang";
import Button from '@components/form/Button';
import Modal from '../../partials/MaterialModal/Modal';
import SettingClientFieldItem from '../../partials/Setting/Questionary/SettingClientFieldItem';
import SettingPortalItem from "../../partials/Setting/Questionary/SettingPortalItem";
import SettingPortalItemAdd from '../../partials/Setting/Questionary/SettingPortalItemAdd';
import ModalSuspense from '@partials/Loadings/ModalLoading';

export interface RegistrationPortalSettingProps {}

const RegistrationPortalSetting: React.FC<RegistrationPortalSettingProps> = () => {

    const { data, mutate, error } = useSWR<SettingResponse, Error>(api.setting, commonFetch);

    const {
        data: extraFieldData,
        mutate: extraFieldMutate,
        error: extraFieldError,
    } = useSWR<CompanyClientExtraFieldResponse, Error>(api.companyClientExtraFields, commonFetch);

    const [openModal, setOpenModal] = React.useState(false);
    const [savingSetting, setSavingSetting] = React.useState(false);

    const [selectedField, setSelectedField] = React.useState<number | null>(null);

    const navigate = useNavigate();
    const loading = !data && !error && !extraFieldData && extraFieldError;

    const handleClose = () => {
        if (savingSetting) return;
        setOpenModal(false);
    }

    const handleCompanyClientFieldSave = async ({ required, view, name, id }: {
        required?: boolean;
        view?: boolean;
        name?: string;
        id?: number;
    }) => {
        if (savingSetting) return;
        if (name?.length === 0) {
            toast.error(strings.name_field_is_required || 'please try again');
            return
        }
        setSavingSetting(true);
        const data = await saveCompanyClientExtraField({
            name,
            view,
            required,
            id,
        });
        if (data.webStatus === 401) {
            navigate('/');
        }
        if (data.status === '1') {
            await extraFieldMutate();
            toast.success(data.message);
        } else {
            toast.error(data.message || 'please try again');
        }
        setSavingSetting(false);
    };

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (savingSetting) return;
        setSavingSetting(true);
        const data = await saveSetting({
            key: event.target.name as SettingTypes,
            value: event.target.checked ? '1' : '0',
        });
        if (data.webStatus === 401) {
            navigate('/');
        }
        if (data.status === '1') {
            await mutate();
            toast.success(data.message);
        } else {
            toast.error(data.message || 'please try again');
        }
        setSavingSetting(false);
    };

    const handleDelete = async () => {
        setSavingSetting(true);
        const data = await deleteCompanyClientExtraField(selectedField as number);

        if (data.webStatus === 401) {
            navigate('/');
        }

        if (data.status === '1') {
            await extraFieldMutate();
            toast.success(data.message);
        } else {
            toast.error(data.message || 'please try again');
        }
        setOpenModal(false);
        setSavingSetting(false);
    }

    function findValue(key: string) {
        return !!data?.data.find((setting) => setting.key === key && setting.value === '1');
    }

    return (
        <>
            <ModalSuspense>
                {
                    openModal &&
                    <RegistrationPortalSettingItemDeleteModal loading={savingSetting} handleClose={handleClose} handleDelete={handleDelete} />
                }
            </ModalSuspense>
            {
                loading ? <>
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                </> :
                    <div className="divide-y dark:divide-gray-700">
                        <SettingPortalItem
                            title={strings.setting_name}
                            requiredName={strings.setting_name}
                            viewName={strings.setting_name}
                            requiredChecked={true}
                            viewChecked={true}
                            disabled
                        />
                        <SettingPortalItem
                            title={strings.setting_email}
                            requiredName={strings.setting_email}
                            viewName={strings.setting_email}
                            requiredChecked={true}
                            viewChecked={true}
                            disabled
                        />
                        <SettingPortalItem
                            title={strings.setting_profile}
                            viewName={api.registrationPortal.viewProfile}
                            requiredName={api.registrationPortal.requiredProfile}
                            requiredChecked={findValue(api.registrationPortal.requiredProfile)}
                            viewChecked={findValue(api.registrationPortal.viewProfile)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.PersonalID}
                            viewName={api.registrationPortal.viewPersonalID}
                            requiredName={api.registrationPortal.requiredPersonalID}
                            requiredChecked={findValue(api.registrationPortal.requiredPersonalID)}
                            viewChecked={findValue(api.registrationPortal.viewPersonalID)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.setting_date_of_birth}
                            viewName={api.registrationPortal.viewDateOfBirth}
                            requiredName={api.registrationPortal.requiredDateOfBirth}
                            requiredChecked={findValue(api.registrationPortal.requiredDateOfBirth)}
                            viewChecked={findValue(api.registrationPortal.viewDateOfBirth)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.setting_phone}
                            viewName={api.registrationPortal.viewPhone}
                            requiredName={api.registrationPortal.requiredPhone}
                            requiredChecked={findValue(api.registrationPortal.requiredPhone)}
                            viewChecked={findValue(api.registrationPortal.viewPhone)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.setting_occupation}
                            viewName={api.registrationPortal.viewOccupation}
                            requiredName={api.registrationPortal.requiredOccupation}
                            requiredChecked={findValue(api.registrationPortal.requiredOccupation)}
                            viewChecked={findValue(api.registrationPortal.viewOccupation)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.setting_street_address}
                            viewName={api.registrationPortal.viewStreetAddress}
                            requiredName={api.registrationPortal.requiredStreetAddress}
                            requiredChecked={findValue(api.registrationPortal.requiredStreetAddress)}
                            viewChecked={findValue(api.registrationPortal.viewStreetAddress)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.setting_city}
                            viewName={api.registrationPortal.viewCity}
                            requiredName={api.registrationPortal.requiredCity}
                            requiredChecked={findValue(api.registrationPortal.requiredCity)}
                            viewChecked={findValue(api.registrationPortal.viewCity)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.setting_zip_code}
                            viewName={api.registrationPortal.viewZipcode}
                            requiredName={api.registrationPortal.requiredZipcode}
                            requiredChecked={findValue(api.registrationPortal.requiredZipcode)}
                            viewChecked={findValue(api.registrationPortal.viewZipcode)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.setting_state}
                            viewName={api.registrationPortal.viewState}
                            requiredName={api.registrationPortal.requiredState}
                            requiredChecked={findValue(api.registrationPortal.requiredState)}
                            viewChecked={findValue(api.registrationPortal.viewState)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        <SettingPortalItem
                            title={strings.setting_country}
                            viewName={api.registrationPortal.viewCountry}
                            requiredName={api.registrationPortal.requiredCountry}
                            requiredChecked={findValue(api.registrationPortal.requiredCountry)}
                            viewChecked={findValue(api.registrationPortal.viewCountry)}
                            onRequiredChange={handleChange}
                            onViewChange={handleChange}
                        />
                        {extraFieldData?.data.map((field, index) => (
                            <SettingClientFieldItem
                                oldName={field.name}
                                key={field.id}
                                requiredChecked={field.required}
                                viewChecked={field.view}
                                onRequiredChange={(e) => handleCompanyClientFieldSave({ id: field.id, required: e.currentTarget.checked })}
                                onViewChange={(e) => handleCompanyClientFieldSave({ id: field.id, view: e.currentTarget.checked })}
                                updateName={(name) => handleCompanyClientFieldSave({ id: field.id, name: name })}
                                onDelete={() => {
                                    setSelectedField(field.id);
                                    setOpenModal(true);
                                }}
                            />
                        ))}
                        <SettingPortalItemAdd onAdd={(value) => handleCompanyClientFieldSave(value)} />
                    </div>
            }
        </>
    );
}

export interface RegistrationPortalSettingItemDeleteModalProps {
    handleClose?: () => void
    handleDelete?: () => void
    loading: boolean
}

const RegistrationPortalSettingItemDeleteModal: React.FC<RegistrationPortalSettingItemDeleteModalProps> = ({
    handleClose,
    loading,
    handleDelete
}) => {
    return (
        <Modal
            open
            title={strings.DELETE_COMPANY_CLIENT_FIELD_1}
            handleClose={handleClose}
            cancelButton={<CancelButton disabled={loading} onClick={handleClose} />}
            submitButton={
                <Button
                    loading={loading}
                    onClick={handleDelete}
                >{strings.Submit}</Button>
            }
        >
            <div className="p-4">
                <p>{strings.DELETE_COMPANY_CLIENT_FIELD_2}</p>
                <p>{strings.DELETE_COMPANY_CLIENT_FIELD_3}</p>
            </div>
        </Modal>
    );
}

export default RegistrationPortalSetting;


