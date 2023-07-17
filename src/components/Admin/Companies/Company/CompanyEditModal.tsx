import Avatar from '@components/avatar/Avatar';
import CountrySelect from '@components/form/CountrySelect';
import Input from '@components/form/Input';
import { Formik } from 'formik';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../../../configs/api';
import { findCountryByCode, findCountryByName } from '../../../../configs/countries';
import { commonFetch, convertBase64ToFile } from '../../../../helper';
import { CompanyResponse } from '../../../../interfaces/common';
import strings from '../../../../lang/Lang';
import ServerError from '../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import CancelButton from '../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../partials/MaterialModal/Modal';

import { validateEditCompany } from '../../../../validations';
import PhoneSelect from '@components/form/PhoneSelect';

interface CompanyEditModalProps {
    openModal?: boolean,
    handleClose?: () => void,
}

export interface ICompanyValues {
    old_profile_photo: string,
    profile_photo: string,
    company_name: string,
    mobile_number: string,
    street_address: string,
    country_code: string,
    city: string,
    zip_code: string,
    country: string,
    state: string,
    server?: string,
}

const CompanyEditModal = ({
    handleClose = () => { },
    openModal = false,
}: CompanyEditModalProps) => {
    const navigate = useNavigate();
    const { companyId }: { companyId?: string } = useParams();

    const { data, mutate } = useSWR<CompanyResponse, Error>(
        api.companySingle.replace(":id", companyId || ""),
        commonFetch
    );

    const company = data?.data;

    return (
        <Formik<ICompanyValues>
            initialValues={{
                old_profile_photo: `${process.env.REACT_APP_STORAGE_PATH}/${company?.profile_photo || ''}`,
                profile_photo: '',
                company_name: company?.company_name || '',
                mobile_number: company?.mobile_number || '',
                street_address: company?.street_address || '',
                country_code: company?.country_code || '',
                city: company?.city || '',
                zip_code: company?.zip_code || '',
                country: company?.country || '',
                state: company?.state || '',
            }}
            enableReinitialize
            validate={validateEditCompany}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const formData = new FormData();
                formData.set('mobile_number', values.mobile_number);
                formData.set('company_name', values.company_name);
                formData.set('street_address', values.street_address);
                formData.set('country_code', values.country_code || '');
                formData.set('city', values.city);
                formData.set('state', values.state);
                formData.set('zip_code', values.zip_code);
                formData.set('country', values.country || '');

                if (values.profile_photo) {
                    formData.set('profile_photo', convertBase64ToFile(values.profile_photo))
                }

                const response = await fetch(api.companyMasterUpdate.replace(':id', company?.id.toString() || ''), {
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
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, resetForm, handleBlur, handleChange }) => {

                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    handleClose();
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={strings.EditCompany}
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
                                    if (!dirty) {
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
                        <div className="p-4 space-y-4">
                            <FormikErrorFocus />
                            <div className="grid place-items-center mb-2">
                                <label htmlFor="profile_photo_id">
                                    <Avatar
                                        className="h-24 w-24 object-top"
                                        src={values.profile_photo || values.old_profile_photo}
                                    />
                                </label>
                            </div>

                            <Input
                                name="company_name"
                                type="text"
                                value={values.company_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.company_name && errors.company_name}
                                label={strings.signup_company}
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
                                label={strings.signup_street_address}
                            />
                            <Input
                                name="city"
                                type="text"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.city && errors.city}
                                label={strings.signup_city}
                            />
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    name="state"
                                    type="text"
                                    value={values.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label={strings.STATE}
                                    error={touched?.state && errors.state}
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
                                disabled
                                defaultValue={findCountryByName(values.country)}
                                onChange={(value) => {
                                    setFieldTouched('country');
                                    setFieldValue('country', value?.name);
                                }}
                                error={touched?.country && errors.country}
                            />

                            <ServerError error={errors?.server} />

                        </div>
                    </Modal >
                );
            }}
        </Formik>
    )
}

export default CompanyEditModal;
