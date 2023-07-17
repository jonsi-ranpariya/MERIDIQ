import Avatar from '@components/avatar/Avatar';
import CalendarSelect from '@components/Calendar/Custom/CalendarSelect';
import Button from '@components/form/Button';
import CountrySelect from '@components/form/CountrySelect';
import Input from '@components/form/Input';
import PhoneSelect from '@components/form/PhoneSelect';
import { Formik, getIn } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../configs/api';
import { findCountryByCode, findCountryByName } from '../../configs/countries';
import { commonFetch, convertBase64ToFile, heic2convert, toBase64 } from '../../helper';
import { CompanyClientExtraFieldResponse, SettingResponse } from '../../interfaces/common';
import { Client } from '../../interfaces/model/client';
import strings from '../../lang/Lang';
import ServerError from '../../partials/Error/ServerError';
import TinyError from '../../partials/Error/TinyError';
import FormikErrorFocus from '../../partials/FormikErrorFocus/FormikErrorFocus';

import CancelButton from '../../partials/MaterialButton/CancelButton';
import Modal from '../../partials/MaterialModal/Modal';
import { validateClientStore } from '../../validations';


export interface IClientValues {
    profile_picture: string;
    old_profile_picture: string;
    first_name: string;
    last_name: string;
    social_security_number: string;
    email: string;
    phone_number: string;
    country_code: string;
    personal_id: string;
    occupation: string;
    country: string;
    state: string;
    city: string;
    zip_code: string;
    street_address: string;
    extra: {
        id: number,
        value: string,
        name: string,
        required: boolean,
    }[],
    server?: string,
}

export interface ClientModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedClient?: Client
}

const ClientModal: React.FC<ClientModalProps> = ({
    openModal, setOpenModal, mutate, selectedClient
}) => {

    const profilePictureRef = React.useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
    const navigate = useNavigate();
    const { data: settingData, } = useSWR<SettingResponse, Error>(api.setting, commonFetch);
    const { data: extraFieldData } = useSWR<CompanyClientExtraFieldResponse, Error>(api.companyClientExtraFields, commonFetch);

    const [profileImage, setProfileImage] = React.useState<string>()

    React.useEffect(() => {
        if (!openModal) { setProfileImage(undefined) }
    }, [openModal])

    function findValue(key: string) {
        return !!settings.find((setting) => setting.key === key && setting.value === '1');
    }

    const settings = settingData?.data ?? [];

    let viewProfile = findValue(api.registrationPortal.viewProfile);

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
        <Formik<IClientValues>
            initialValues={!selectedClient ? {
                profile_picture: '',
                first_name: '',
                last_name: '',
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
                old_profile_picture: '',
                extra: extraFieldData?.data.filter(field => field.view).map(field => {
                    return {
                        id: field.id,
                        name: field.name,
                        required: field.required,
                        value: '',
                    };
                }) ?? [],
            } : {
                profile_picture: profileImage ? profileImage : '',
                old_profile_picture: selectedClient?.profile_picture ? `${process.env.REACT_APP_STORAGE_PATH}/${selectedClient.profile_picture || ''}` : '',
                first_name: selectedClient.first_name ?? '',
                last_name: selectedClient.last_name ?? '',
                social_security_number: selectedClient.social_security_number ?? '',
                email: selectedClient.email ?? '',
                personal_id: selectedClient.personal_id ?? '',
                country_code: selectedClient.country_code ?? '',
                phone_number: selectedClient.phone_number ?? '',
                occupation: selectedClient.occupation ?? '',
                city: selectedClient?.addresses?.length ? selectedClient.addresses[0].city ?? '' : '',
                country: selectedClient?.addresses?.length ? selectedClient.addresses[0].country ?? '' : '',
                state: selectedClient?.addresses?.length ? selectedClient.addresses[0].state ?? '' : '',
                street_address: selectedClient?.addresses?.length ? selectedClient.addresses[0].street_address ?? '' : '',
                zip_code: selectedClient?.addresses?.length ? selectedClient.addresses[0].zip_code ?? '' : '',
                extra: extraFieldData?.data.filter(field => field.view).map(field => {
                    return {
                        id: field.id,
                        name: field.name,
                        required: field.required,
                        value: selectedClient.extra_fields?.find(newField => newField.company_client_extra_field_id === field.id)?.value ?? '',
                    };
                }) ?? [],
            }}
            enableReinitialize
            validate={(v) => validateClientStore(v, settingData?.data ?? [], extraFieldData?.data.filter(field => field.view) ?? [])}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {


                const formData = new FormData();
                formData.set('first_name', values.first_name);
                formData.set('last_name', values.last_name);
                formData.set('email', values.email);
                formData.set('social_security_number', values.social_security_number);
                formData.set('phone_number', values.phone_number);
                formData.set('country_code', values.country_code)
                formData.set('occupation', values.occupation);
                formData.set('personal_id', values.personal_id);

                formData.set('addressess[0][street_address]', values.street_address);
                formData.set('addressess[0][city]', values.city);
                formData.set('addressess[0][state]', values.state);
                formData.set('addressess[0][zip_code]', values.zip_code);
                formData.set('addressess[0][country]', values.country || '');

                if (values.profile_picture) {
                    formData.set('profile_picture', convertBase64ToFile(values.profile_picture))
                }

                for (let index = 0; index < (values.extra ?? []).length; index++) {
                    formData.set(`extra[${index}][id]`, values.extra[index].id.toString());
                    formData.set(`extra[${index}][value]`, values.extra[index].value);
                }

                const response = await fetch(!selectedClient ? api.clientStore : api.clientUpdate.replace(':id', selectedClient.id.toString() || ''), {
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
                    if (!selectedClient) {
                        navigate('/clients/' + data?.data?.id);
                    }
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm, handleBlur, handleChange }) => {

                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        loading={isSubmitting}
                        title={!selectedClient ? strings.NEW_CLIENT : strings.UPDATE_CLIENT}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton disabled={isSubmitting} onClick={handleModelClose}>
                                {strings.Cancel}
                            </CancelButton>
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (!dirty && selectedClient && !profileImage) {
                                        toast.success(strings.no_data_changed)
                                        handleModelClose();
                                        return;
                                    }
                                    handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4 grid grid-flow-row grid-cols-1 gap-y-4">
                            {viewProfile &&
                                <div className="grid place-items-center mb-2">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="profile_picture_id"
                                        name="profile_picture"
                                        ref={profilePictureRef}
                                        onChange={async (event) => {
                                            if (!event?.target?.files?.length) return;

                                            let file: File | Blob | null = event.target.files[0];

                                            if (file && !file.type) {
                                                file = await heic2convert(file);
                                            }

                                            const imageData = await toBase64(file);
                                            setFieldTouched('profile_picture')
                                            setProfileImage(imageData)
                                            setFieldValue('profile_picture', imageData)
                                        }}
                                        accept=".png,.jpg,.jpeg,.heic"
                                    />
                                    <label htmlFor="profile_picture_id">
                                        <Avatar
                                            className="h-24 w-24"
                                            src={values.profile_picture || values.old_profile_picture}
                                        />
                                    </label>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        className="mt-3"
                                        color="secondary"
                                        onClick={() => {
                                            if (profilePictureRef?.current) profilePictureRef.current.click();
                                        }}
                                    >{strings.ProfilePicture}</Button>
                                    <div className="text-center mb-4 -ml-5">
                                        <TinyError error={!!(!!errors.profile_picture && !!touched.profile_picture)} helperText={errors.profile_picture} />
                                    </div>
                                </div>
                            }

                            <Input
                                name="first_name"
                                value={values.first_name || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                error={touched?.first_name && errors.first_name}
                                label={strings.Firstname}
                            />


                            <Input
                                name="last_name"
                                value={values.last_name || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                error={touched?.last_name && errors.last_name}
                                label={strings.Lastname}
                            />


                            <Input
                                name="email"
                                value={values.email || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                error={touched?.email && errors.email}
                                label={strings.Email}
                            />

                            {viewDateOfBirth &&
                                <CalendarSelect
                                    selectedDate={values.social_security_number}
                                    onChange={(date) => {
                                        setFieldTouched('social_security_number');
                                        setFieldValue('social_security_number', date || undefined)
                                    }}
                                    maxToday
                                    inputProps={{
                                        label: strings.dateOfBirthLabel,
                                        required: requiredDateOfBirth,
                                    }}
                                />
                            }

                            {viewPersonalID &&
                                <Input
                                    name="personal_id"
                                    value={values.personal_id || ''}
                                    required={requiredPersonalID}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onInput={(e) => {
                                        e.currentTarget.value = e.currentTarget.value.replace(/[^0-9-]/g, '').replace(/(\..*?)\..*/g, '$1');
                                    }}
                                    error={touched?.personal_id && errors?.personal_id}
                                    label={strings.PersonalID_with_format.toUpperCase()}
                                />
                            }
                            {viewPhone &&
                                <PhoneSelect
                                    value={values.phone_number}
                                    countryValue={findCountryByCode(values.country_code)}
                                    required={requiredPhone}
                                    onChangeCountry={(value) => {
                                        setFieldTouched('country_code');
                                        setFieldValue('country_code', value?.code);
                                    }}
                                    onChange={(number) => {
                                        setFieldTouched('phone_number');
                                        setFieldValue('phone_number', number);
                                    }}
                                    error={touched?.phone_number && errors.phone_number}
                                    countryError={touched?.country_code && errors.country_code}
                                />
                            }
                            {viewOccupation &&
                                <Input
                                    name="occupation"
                                    type="text"
                                    value={values.occupation || ''}
                                    required={requiredOccupation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched?.occupation && errors.occupation}
                                    label={strings.Occupation}
                                />
                            }
                            {viewStreetAddress &&
                                <Input
                                    name="street_address"
                                    type="text"
                                    value={values.street_address || ''}
                                    required={requiredStreetAddress}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched?.street_address && errors.street_address}
                                    label={strings.StreetAddress}
                                />
                            }
                            {viewCity &&
                                <Input
                                    name="city"
                                    type="text"
                                    value={values.city || ''}
                                    required={requiredCity}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched?.city && errors.city}
                                    label={strings.City}
                                />
                            }
                            {viewZipcode &&
                                <Input
                                    name="zip_code"
                                    type="text"
                                    value={values.zip_code || ''}
                                    required={requiredZipcode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched?.zip_code && errors.zip_code}
                                    label={strings.ZipCode}
                                />
                            }
                            {viewState &&
                                <Input
                                    name="state"
                                    type="text"
                                    value={values.state || ''}
                                    required={requiredState}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched?.state && errors.state}
                                    label={strings.State}
                                />
                            }
                            {viewCountry &&
                                <CountrySelect
                                    defaultValue={findCountryByName(values.country)}
                                    required={requiredCountry}
                                    onChange={(value) => {
                                        if (!value?.name) return;
                                        setFieldTouched('country');
                                        setFieldValue('country', value.name);
                                    }}
                                    error={touched?.country && errors.country && errors.country}
                                />
                            }

                            {values?.extra?.map((field, index) => {
                                const hasTouch = getIn(touched, `extra.${index}.value`);
                                const hasError = getIn(errors, `extra.${index}.value`);

                                return (
                                    <Input
                                        key={`extra.${index}.value`}
                                        name={`extra.${index}.value`}
                                        type="text"
                                        value={values.extra[index].value || ''}
                                        required={values.extra[index].required}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={hasTouch && hasError}
                                        label={values.extra[index].name}
                                    />
                                )
                            })}

                            <ServerError error={errors?.server} className="mt-4" />
                        </div>
                    </Modal>
                );
            }}
        </Formik>
    );
}

export default ClientModal;