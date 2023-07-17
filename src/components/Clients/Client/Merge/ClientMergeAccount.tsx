import CancelButton from '@partials/MaterialButton/CancelButton';
import { Formik, getIn } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '@configs/api';
import strings from '@lang/Lang';
import ServerError from '@partials/Error/ServerError';
import FormikErrorFocus from '@partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import Modal from '@partials/MaterialModal/Modal';
import Label from '@components/form/Label';
import Select from '@components/form/Select';
import { commonFetch, generateClientFullName, generateFullName } from '../../../../../src/helper';
import { ClientResponse, CompanyClientExtraFieldResponse, SettingResponse } from '@interface/common';
import useSWR from 'swr/immutable';
import { validateClientMerge } from '../../../../../src/validations';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import ClientMergeConfirmModal from './ClientMergeConfirm';

export interface IClientMergeValues {
    client_name: string;
    email: string;
    country_code: string;
    personal_id: string;
    country: string;
    state: string;
    city: string;
    zip_code: string;
    street_address: string;
    occupation: string;
    social_security_number: string;
    phone_number: string;
    server?: string,
    extra: {
        id: number,
        value: string,
        name: string,
        required: boolean,
    }[],
}
export interface ClientMergeProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    clientLiistId: number[],
}

const ClientMergeAccountModal: React.FC<ClientMergeProps> = ({
    openModal, setOpenModal, mutate, clientLiistId
}) => {
    const { data: settingData, } = useSWR<SettingResponse, Error>(api.setting, commonFetch);
    const { data: client1 } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientLiistId[0])
    );
    const { data: client2 } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientLiistId[1])
    );
    const { data: extraFieldData } = useSWR<CompanyClientExtraFieldResponse, Error>(api.companyClientExtraFields, commonFetch);
    const [saveOpenModal, setSaveOpenModal] = React.useState(false);
    const loading = !client1?.data && !client2?.data
    const clientDataList = [...(client1?.data ? [client1?.data] : []), ...(client2?.data ? [client2?.data] : [])]

    const navigate = useNavigate();
    function findValue(key: string) {
        return !!settings.find((setting) => setting.key === key && setting.value === '1');
    }
    const settings = settingData?.data ?? [];


    let viewPhone = findValue(api.registrationPortal.viewPhone);
    let requiredPhone = findValue(api.registrationPortal.requiredPhone);

    let viewDateOfBirth = findValue(api.registrationPortal.viewDateOfBirth);
    let requiredDateOfBirth = findValue(api.registrationPortal.requiredDateOfBirth);

    let viewOccupation = findValue(api.registrationPortal.viewOccupation);
    let requiredOccupation = findValue(api.registrationPortal.requiredOccupation);

    let viewStreetAddress = findValue(api.registrationPortal.viewStreetAddress);
    let requiredStreetAddress = findValue(api.registrationPortal.requiredStreetAddress);

    let viewCity = findValue(api.registrationPortal.viewCity);
    let requiredCity = findValue(api.registrationPortal.requiredCity);

    let viewState = findValue(api.registrationPortal.viewState);
    let requiredState = findValue(api.registrationPortal.requiredState);

    let viewCountry = findValue(api.registrationPortal.viewCountry);
    let requiredCountry = findValue(api.registrationPortal.requiredCountry);

    let viewZipcode = findValue(api.registrationPortal.viewZipcode);
    let requiredZipcode = findValue(api.registrationPortal.requiredZipcode);

    let viewPersonalID = findValue(api.registrationPortal.viewPersonalID);
    let requiredPersonalID = findValue(api.registrationPortal.requiredPersonalID);

    return (
        <Formik<IClientMergeValues>
            initialValues={{
                client_name: '',
                social_security_number: '',
                email: '',
                phone_number: '',
                occupation: '',
                city: '',
                country: '',
                country_code: '',
                state: '',
                street_address: '',
                personal_id: '',
                zip_code: '',
                extra: extraFieldData?.data.filter(field => field.view).map(field => {
                    return {
                        id: field.id,
                        name: field.name,
                        required: field.required,
                        value: '',
                    };
                }) ?? [],
            }}
            enableReinitialize
            validate={(v) => validateClientMerge(v, settingData?.data ?? [], extraFieldData?.data.filter(field => field.view) ?? [])}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const clientArray = values.client_name.split(" ");
                const formData = new FormData();
                formData.set('first_name', clientArray[0]);
                formData.set('last_name', clientArray[1]);
                formData.set('email', values.email);
                if (values.social_security_number) {
                    formData.set('social_security_number', values.social_security_number);
                }
                if (values.phone_number) {
                    formData.set('phone_number', values.phone_number);
                    formData.set('country_code', values.country_code);
                }
                formData.set('country_code', values.country_code)
                formData.set('personal_id', values.personal_id);
                formData.set('occupation', values.occupation);
                clientLiistId.forEach((id, index) => {
                    formData.set(`clients[${index}]`, id.toString());
                    formData.set(`clients[${index}]`, id.toString());
                })
                formData.set('addressess[0][street_address]', values.street_address);
                formData.set('addressess[0][city]', values.city);
                formData.set('addressess[0][state]', values.state);
                formData.set('addressess[0][zip_code]', values.zip_code);
                formData.set('addressess[0][country]', values.country || '');

                for (let index = 0; index < (values.extra ?? []).length; index++) {
                    formData.set(`extra[${index}][id]`, values.extra[index].id.toString());
                    formData.set(`extra[${index}][value]`, values.extra[index].value);
                }
                const response = await fetch(api.clientMerge, {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': 'test',
                        'X-App-Locale': strings.getLanguage(),
                    },
                    credentials: "include",
                    body: formData,
                });

                const data = await response.json();

                if (response.status === 401) {
                    navigate('/');
                }

                if (data.status === '1') {
                    await mutate();
                    await resetForm();
                    toast.success(data.message);
                    setOpenModal(false);
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, resetForm, values, touched, setTouched, handleSubmit, isSubmitting, isValidating, validateForm, setFieldTouched, setFieldValue, handleBlur, handleChange }) => {
                const handleClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false);
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={strings.merge_client_accounts}
                        handleClose={handleClose}
                        cancelButton={
                            <CancelButton
                                disabled={isSubmitting}
                                onClick={handleClose}
                            />
                        }
                        submitButton={
                            <Button
                                type='button'
                                loading={isSubmitting}
                                onClick={() => {
                                    setSaveOpenModal(true)
                                }}
                            >{strings.Confirm}
                            </Button>
                        }
                    >
                        <ModalSuspense>
                            {saveOpenModal &&
                                <ClientMergeConfirmModal
                                    handleClose={() => {
                                        setSaveOpenModal(false);
                                    }}

                                    openModal={saveOpenModal}
                                    setOpenModal={setSaveOpenModal}
                                    handleMergeSubmit={() => { setSaveOpenModal(false); handleSubmit(); }}
                                />
                            }
                        </ModalSuspense>
                        <FormikErrorFocus />
                        <div className="p-4 space-y-4">
                            <div className="flex-grow">
                                <Label label={strings.Name} required />
                                <Select
                                    value={values.client_name}
                                    onChange={(value) => {
                                        setFieldTouched('client_name')
                                        setFieldValue('client_name', value)
                                    }}
                                    loading={loading}
                                    error={touched?.client_name && errors.client_name}
                                    placeholder={strings.choose_name}
                                    displayValue={(val) => generateClientFullName(clientDataList?.find((client) => generateFullName(client.first_name, client.last_name) === val))}
                                >
                                    {clientDataList?.map((client) => <Select.Option value={generateFullName(client.first_name, client.last_name)} key={generateFullName(client.first_name, client.last_name)}>{generateFullName(client.first_name, client.last_name)}</Select.Option>)}
                                </Select>
                            </div>
                            <div className="flex-grow">
                                <Label label={strings.EmailAddress} required />
                                <Select
                                    value={values.email}
                                    onChange={(value) => {
                                        setFieldTouched('email')
                                        setFieldValue('email', value)
                                    }}
                                    loading={loading}
                                    error={touched?.email && errors.email}
                                    placeholder={strings.choose_email_address}
                                    displayValue={(val) => val}
                                >
                                    {clientDataList?.map((client) => <Select.Option value={client.email} key={`${client.email}`}>{client.email}</Select.Option>)}
                                </Select>
                            </div>
                            {viewDateOfBirth &&
                                <div className="flex-grow">
                                    <Label label={strings.SocialSecNumber} required={requiredDateOfBirth} />
                                    <Select
                                        value={values.social_security_number}
                                        onChange={(value) => {
                                            setFieldTouched('social_security_number')
                                            setFieldValue('social_security_number', value)
                                        }}
                                        loading={loading}
                                        error={touched?.social_security_number && errors.social_security_number}
                                        placeholder={strings.choose_date_of_birth}
                                        displayValue={(val) => val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client.social_security_number} key={`${client.social_security_number}`}>{client.social_security_number ? client.social_security_number : '-'}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {viewPersonalID &&
                                <div className="flex-grow">
                                    <Label label={strings.PersonalID} required={requiredPersonalID} />
                                    <Select
                                        value={values.personal_id}
                                        onChange={(value) => {
                                            setFieldTouched('personal_id')
                                            setFieldValue('personal_id', value)
                                        }}
                                        loading={loading}
                                        error={touched?.personal_id && errors.personal_id}
                                        placeholder={strings.choose_personal_id}
                                        displayValue={(val) => val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client.personal_id ?? ''} key={`${client.personal_id}`}>{client.personal_id ? client.personal_id : '-'}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {viewPhone &&
                                <div className="flex-grow">
                                    <Label label={strings.PhoneNumber} required={requiredPhone} />
                                    <Select
                                        value={values.phone_number}
                                        onChange={async (value) => {
                                            setFieldTouched('phone_number')
                                            await setFieldValue('phone_number', clientDataList.filter((item) => item.id === Number(value))[0].phone_number)
                                            await setFieldValue('country_code', clientDataList.filter((item) => item.id === Number(value))[0].country_code)
                                        }}
                                        loading={loading}
                                        error={touched?.phone_number && errors.phone_number}
                                        placeholder={strings.choose_phone_number}
                                        displayValue={(val) => values.country_code ? `+${values.country_code} ${val}` : val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client.id} key={client.id}>{client.phone_number ? `${client.country_code ? `+${client.country_code}` : ''} ${client.phone_number}` : '-'}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {viewOccupation &&
                                <div className="flex-grow">
                                    <Label label={strings.Occupation} required={requiredOccupation} />
                                    <Select
                                        value={values.occupation}
                                        onChange={(client) => {
                                            if (!client) return;
                                            setFieldTouched('occupation')
                                            setFieldValue('occupation', client)
                                        }}
                                        loading={loading}
                                        error={touched?.occupation && errors.occupation}
                                        placeholder={strings.choose_occupation}
                                        displayValue={(val) => val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client.occupation} key={`${client.occupation}`}>{client.occupation ? client.occupation : '-'}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {viewStreetAddress &&
                                <div className="flex-grow">
                                    <Label label={strings.StreetAddress} required={requiredStreetAddress} />
                                    <Select
                                        value={values.street_address}
                                        onChange={(value) => {
                                            setFieldTouched('street_address')
                                            setFieldValue('street_address', value)
                                        }}
                                        loading={loading}
                                        error={touched?.street_address && errors.street_address}
                                        placeholder={strings.choose_street_address}
                                        displayValue={(val) => val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client?.addresses?.length ? client.addresses[0].street_address : '-'} key={`${client.addresses?.length && client.addresses[0].street_address}`}>{client?.addresses?.length ? client.addresses[0].street_address ?? '-' : ''}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {viewCity &&
                                <div className="flex-grow">
                                    <Label label={strings.City} required={requiredCity} />
                                    <Select
                                        value={values.city}
                                        onChange={(value) => {
                                            setFieldTouched('city')
                                            setFieldValue('city', value)
                                        }}
                                        loading={loading}
                                        error={touched?.city && errors.city}
                                        placeholder={strings.choose_city}
                                        displayValue={(val) => val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client?.addresses?.length ? client.addresses[0].city : ''} key={`${client.addresses?.length && client.addresses[0].city}`}>{client?.addresses?.length ? client.addresses[0].city ?? '-' : ''}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {viewZipcode &&
                                <div className="flex-grow">
                                    <Label label={strings.ZipCode} required={requiredZipcode} />
                                    <Select
                                        value={values.zip_code}
                                        onChange={(value) => {
                                            setFieldTouched('zip_code')
                                            setFieldValue('zip_code', value)
                                        }}
                                        placeholder={strings.choose_zip_code}
                                        loading={loading}
                                        error={touched?.zip_code && errors.zip_code}
                                        displayValue={(val) => val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client?.addresses?.length ? client.addresses[0].zip_code : ''} key={`${client.addresses?.length && client.addresses[0].zip_code}`}>{client?.addresses?.length ? client.addresses[0].zip_code ?? '-' : ''}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {viewState &&
                                <div className="flex-grow">
                                    <Label label={strings.State} required={requiredState} />
                                    <Select
                                        value={values.state}
                                        onChange={(value) => {
                                            setFieldTouched('state')
                                            setFieldValue('state', value)
                                        }}
                                        placeholder={strings.choose_state}
                                        loading={loading}
                                        error={touched?.state && errors.state}
                                        displayValue={(val) => val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client?.addresses?.length ? client.addresses[0].state : ''} key={`${client.addresses?.length && client.addresses[0].state}`}>{client?.addresses?.length ? client.addresses[0].state ?? '-' : ''}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {viewCountry &&
                                <div className="flex-grow">
                                    <Label label={strings.Country} required={requiredCountry} />
                                    <Select
                                        value={values.country}
                                        onChange={(value) => {
                                            setFieldTouched('country')
                                            setFieldValue('country', value)
                                        }}
                                        placeholder={strings.choose_country}
                                        loading={loading}
                                        error={touched?.country && errors.country}
                                        displayValue={(val) => val}
                                    >
                                        {clientDataList?.map((client) => <Select.Option value={client?.addresses?.length ? client.addresses[0].country : ''} key={`${client.addresses?.length && client.addresses[0].country}`}>{client?.addresses?.length ? client.addresses[0].country ?? '-' : ''}</Select.Option>)}
                                    </Select>
                                </div>
                            }
                            {values?.extra?.map((field, index) => {
                                const hasTouch = getIn(touched, `extra.${index}.value`);
                                const hasError = getIn(errors, `extra.${index}.value`);

                                return (
                                    <div className='flex-grow'>
                                        <Label label={values.extra[index].name} required={values.extra[index].required} />
                                        <Select
                                            value={values.extra[index].value}
                                            onChange={(val) => {
                                                setFieldTouched('extra')
                                                setFieldValue(`extra.${index}.value`, val);
                                            }}
                                            placeholder={strings.Name}
                                            loading={loading}
                                            error={hasTouch && hasError}
                                            displayValue={(val) => val}
                                        >
                                            {clientDataList?.map((client) => <Select.Option value={client?.extra_fields?.length ? client.extra_fields[index].value : ''} key={`${client?.extra_fields?.length && client.extra_fields[index].value}`}>{client?.extra_fields?.length ? client.extra_fields[index].value ? client.extra_fields[index].value : '-' : '-'}</Select.Option>)}
                                        </Select>
                                    </div>
                                )
                            })}
                            <div className='px-8 pt-8 pb-4'>
                                <h4>{strings.merge_client_account_note}</h4>
                            </div>
                            <ServerError className="mt-4" error={errors?.server} />
                        </div>
                    </Modal>
                );
            }}
        </Formik>

    );
}

export default ClientMergeAccountModal;
