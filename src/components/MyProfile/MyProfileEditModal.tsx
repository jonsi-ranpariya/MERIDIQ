import Avatar from '@components/avatar/Avatar';
import Button from '@components/form/Button';
import CountrySelect from '@components/form/CountrySelect';
import InfoCard from '@components/form/InfoCard';
import Input from '@components/form/Input';
import PhoneSelect from '@components/form/PhoneSelect';
import { findCountryByCode, findCountryByName } from '@configs/countries';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { convertBase64ToFile, heic2convert, toBase64 } from '../../helper';
import { User, UserRole } from '../../interfaces/model/user';
import strings from '../../lang/Lang';
import FormikErrorFocus from '../../partials/FormikErrorFocus/FormikErrorFocus';
import CancelButton from '../../partials/MaterialButton/CancelButton';
import Modal from '../../partials/MaterialModal/Modal';

import { validateEditUser } from '../../validations';


export interface ICompantUserValues {
    user_role: UserRole,
    title: string,
    first_name: string,
    last_name: string,
    email: string,
    mobile_number: string,
    profile_photo: string,
    old_profile_photo: string,
    street_address: string,
    country_code: string,
    city: string,
    state: string,
    zip_code: string,
    country: string,
    password: string,
    password_confirmation: string,
    old_password: string,
    server?: string,
}

export interface MyProfileEditModalProps {
    openModal: boolean,
    handleClose: () => void,
    mutate: () => void,
    selectedUser?: User
}

const MyProfileEditModal: React.FC<MyProfileEditModalProps> = ({
    openModal, handleClose, mutate, selectedUser
}) => {
    const profilePhotoRef = React.useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
    const navigate = useNavigate();

    return (
        <Formik<ICompantUserValues>
            initialValues={{
                user_role: selectedUser?.user_role as UserRole,
                title: selectedUser?.title || '',
                first_name: selectedUser?.first_name || '',
                last_name: selectedUser?.last_name || '',
                email: selectedUser?.email || '',
                mobile_number: selectedUser?.mobile_number || '',
                street_address: selectedUser?.street_address || '',
                city: selectedUser?.city || '',
                country_code: selectedUser?.country_code || '',
                state: selectedUser?.state || '',
                zip_code: selectedUser?.zip_code || '',
                profile_photo: '',
                old_profile_photo: `${process.env.REACT_APP_STORAGE_PATH}/${selectedUser?.profile_photo || ''}`,
                country: selectedUser?.country || '',
                password: '',
                password_confirmation: '',
                old_password: '',
            }}
            enableReinitialize
            validate={validateEditUser}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {

                const formData = new FormData();
                formData.set('title', values.title);
                formData.set('email', values.email);
                formData.set('user_role', values.user_role);
                formData.set('first_name', values.first_name);
                formData.set('last_name', values.last_name);
                formData.set('mobile_number', values.mobile_number);
                formData.set('street_address', values.street_address);
                formData.set('country_code', values.country_code)
                formData.set('city', values.city);
                formData.set('state', values.state);
                formData.set('zip_code', values.zip_code);
                formData.set('country', values.country || '');

                if (values.profile_photo) {
                    formData.set('profile_photo', convertBase64ToFile(values.profile_photo))
                }

                const response = await fetch(api.userUpdate.replace(':id', selectedUser?.id?.toString() || ''), {
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
                    handleClose();
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm, handleBlur, handleChange }) => {

                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    handleClose()
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={!selectedUser ? strings.NewUser : strings.UPDATE_USER}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton
                                disabled={isSubmitting}
                                onClick={handleModelClose}
                            />
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (!dirty && selectedUser) {
                                        toast.success(strings.no_data_changed)
                                        handleModelClose();
                                        return;
                                    }
                                    handleSubmit();
                                }}
                                children={strings.Submit}
                            />
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4 space-y-4">
                            <div className="grid place-items-center mb-2">
                                <label htmlFor="profile_photo_id">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="profile_photo_id"
                                        name="profile_photo"
                                        ref={profilePhotoRef}
                                        onChange={async (event) => {
                                            if (!event?.target?.files) return;
                                            let file: File | Blob | null = event.target.files[0];

                                            if (file && !file.type) {
                                                file = await heic2convert(file)
                                            }

                                            const imageData = await toBase64(file);
                                            setFieldTouched('profile_photo')
                                            setFieldValue('profile_photo', imageData)
                                        }}
                                        accept=".png,.jpg,.jpeg,.heic"
                                    />
                                    <Avatar
                                        className="h-24 w-24 mb-2 mt-6"
                                        src={values.profile_photo || values.old_profile_photo}
                                    >
                                    </Avatar>
                                </label>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        if (profilePhotoRef?.current) profilePhotoRef.current.click();
                                    }}
                                >{strings.ProfilePicture}</Button>

                            </div>

                            <Input
                                name="title"
                                type="text"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.title && errors.title}
                                label={strings.TITLE}
                                required
                            />

                            <Input
                                name="first_name"
                                type="text"
                                value={values.first_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.first_name && errors.first_name}
                                label={strings.Firstname}
                                required
                            />

                            <Input
                                name="last_name"
                                type="text"
                                value={values.last_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.last_name && errors.last_name}
                                label={strings.Lastname}
                                required
                            />

                            <Input
                                name="email"
                                type="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.email && errors.email}
                                label={strings.Email}
                                required
                            />

                            <PhoneSelect
                                value={values.mobile_number ?? ""}
                                countryValue={findCountryByCode(values.country_code ?? "")}
                                required
                                onChangeCountry={(value) => {
                                    setFieldTouched('country_code');
                                    setFieldValue('country_code', value?.code);
                                }}
                                onChange={(number) => {
                                    setFieldTouched('mobile_number');
                                    setFieldValue('mobile_number', number);
                                }}
                                error={touched?.mobile_number && errors.mobile_number}
                                countryError={touched?.country_code && errors.country_code}
                            />

                            <Input
                                name="street_address"
                                type="text"
                                value={values.street_address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.street_address && errors.street_address}
                                label={strings.STREETADDRESS}
                            />

                            <Input
                                name="city"
                                type="text"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.city && errors.city}
                                label={strings.CITY}
                            />

                            <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    name="state"
                                    type="text"
                                    value={values.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched?.state && errors.state}
                                    label={strings.STATE}
                                />

                                <Input
                                    name="zip_code"
                                    type="text"
                                    value={values.zip_code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched?.zip_code && errors.zip_code}
                                    label={strings.ZIPCODE}
                                />
                            </div>

                            <CountrySelect
                                defaultValue={findCountryByName(values?.country)}
                                onChange={(value) => {
                                    setFieldTouched('country');
                                    setFieldValue('country', value?.name);
                                }}
                                error={touched?.country && errors.country}
                            />

                            <InfoCard message={errors?.server} />
                        </div>
                    </Modal>
                );
            }}
        </Formik>
    );
}

export default MyProfileEditModal;