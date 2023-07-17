import Avatar from '@components/avatar/Avatar';
import CountrySelect from '@components/form/CountrySelect';
import Input from '@components/form/Input';
import Select from '@components/form/Select';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../../../configs/api';
import { findCountryByCode, findCountryByName } from '../../../../../configs/countries';
import { convertBase64ToFile } from '../../../../../helper';
import { User, UserRole } from '../../../../../interfaces/model/user';
import strings from '../../../../../lang/Lang';
import ServerError from '../../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import CancelButton from '../../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../../partials/MaterialModal/Modal';
import { validateEditMasterUser } from '../../../../../validations';
import PhoneSelect from '@components/form/PhoneSelect';

export interface ICompanyUserValues {
    user_role: UserRole,
    title: string,
    first_name: string,
    last_name: string,
    email: string,
    mobile_number: string,
    country_code: string,
    profile_photo: string,
    old_profile_photo: string,
    street_address: string,
    city: string,
    state: string,
    zip_code: string,
    country: string,
    password: string,
    password_confirmation: string,
    old_password: string,
    server?: string,
}

export interface CompanyUserModalProps {
    openModal: boolean,
    handleClose: () => void,
    mutate: () => Promise<any>,
    selectedUser?: User
}

const CompanyUserModal: React.FC<CompanyUserModalProps> = ({
    openModal, handleClose, mutate, selectedUser
}) => {
    const navigate = useNavigate();

    return (
        <Formik<ICompanyUserValues>
            initialValues={!selectedUser ? {
                user_role: '' as UserRole,
                title: '',
                first_name: '',
                last_name: '',
                email: '',
                mobile_number: '',
                country_code: '',
                street_address: '',
                city: '',
                state: '',
                zip_code: '',
                country: '',
                profile_photo: '',
                old_profile_photo: '',
                password: '',
                password_confirmation: '',
                old_password: '',
            } : {
                user_role: selectedUser.user_role as UserRole,
                title: selectedUser.title || '',
                first_name: selectedUser.first_name || '',
                last_name: selectedUser.last_name || '',
                email: selectedUser.email,
                mobile_number: selectedUser.mobile_number || '',
                country_code: selectedUser.country_code || '',
                street_address: selectedUser.street_address || '',
                city: selectedUser.city || '',
                state: selectedUser.state || '',
                zip_code: selectedUser.zip_code || '',
                profile_photo: '',
                old_profile_photo: `${process.env.REACT_APP_STORAGE_PATH}/${selectedUser?.profile_photo || ''}`,
                country: selectedUser.country || '',
                password: '',
                password_confirmation: '',
                old_password: '',
            }}
            enableReinitialize
            validate={validateEditMasterUser}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {

                const formData = new FormData();
                formData.set('title', values.title);
                formData.set('email', values.email);
                formData.set('user_role', values.user_role);
                formData.set('first_name', values.first_name);
                formData.set('last_name', values.last_name);
                formData.set('mobile_number', values.mobile_number);
                formData.set('country_code', values.country_code);
                formData.set('street_address', values.street_address);
                formData.set('city', values.city);
                formData.set('state', values.state);
                formData.set('zip_code', values.zip_code);
                formData.set('country', values.country || '');
                if (values.password !== '') {
                    formData.set('password', values.password);
                    formData.set('password_confirmation', values.password_confirmation);
                }
                if (values.profile_photo) {
                    formData.set('profile_photo', convertBase64ToFile(values.profile_photo))
                }

                const response = await fetch(!selectedUser ? api.userStore : api.userUpdate.replace(':id', selectedUser.id.toString() || ''), {
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
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm, handleChange, handleBlur }) => {

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
                                    if (handleSubmit) return handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4 space-y-4">
                            <div className="grid place-items-center mb-2">
                                <label htmlFor="profile_photo_id">
                                    <Avatar
                                        className="h-24 w-24"
                                        src={values.profile_photo || values.old_profile_photo}
                                    />
                                </label>
                            </div>

                            <div className="">
                                <Select
                                    displayValue={(val) => !val ? "" : val === api.adminRole ? strings.Admin : strings.User}
                                    onChange={(e) => {
                                        setFieldTouched('user_role')
                                        setFieldValue('user_role', e)
                                    }}
                                    disabled={selectedUser?.email === selectedUser?.company?.email}
                                    value={values.user_role}
                                    label={`${strings.USER_ROLE}*`}
                                >
                                    <Select.Option value={api.userRole}>{strings.User}</Select.Option>
                                    <Select.Option value={api.adminRole}>{strings.Admin}</Select.Option>
                                </Select>
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
                                label={strings.signup_fname}
                            />

                            <Input
                                name="last_name"
                                type="text"
                                value={values.last_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.last_name && errors.last_name}
                                label={strings.signup_lname}
                            />

                            <Input
                                name="email"
                                type="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.email && errors.email}
                                label={strings.signup_email}
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
                                label={strings.StreetAddress.toUpperCase()}
                            />

                            <Input
                                name="city"
                                type="text"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.city && errors.city}
                                label={strings.City.toUpperCase()}
                            />

                            <div className="grid grid-flow-col grid-cols-2 gap-x-4">
                                <Input
                                    name="state"
                                    type="text"
                                    value={values.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched?.state && errors.state}
                                    label={strings.State.toUpperCase()}
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
                                defaultValue={findCountryByName(values.country)}
                                onChange={(value) => {
                                    setFieldTouched('country');
                                    setFieldValue('country', value?.name);
                                }}
                                error={touched?.country && errors.country}
                            />

                            <Input
                                name="password"
                                type="password"
                                autoComplete='off'
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.password && errors.password}
                                label={strings.signup_password}
                            />

                            <Input
                                name="password_confirmation"
                                type="password"
                                autoComplete='off'
                                value={values.password_confirmation}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.password_confirmation && errors.password_confirmation}
                                label={strings.signup_re_password}
                            />

                            <ServerError error={errors?.server} />
                        </div>
                    </Modal>
                );
            }}
        </Formik>
    );
}

export default CompanyUserModal;