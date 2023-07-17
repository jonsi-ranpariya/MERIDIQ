import Button from '@components/form/Button';
import Input from '@components/form/Input';
import Select from '@components/form/Select';
import { SectionLoading } from '@partials/Loadings/SectionLoading';
import CancelButton from '@partials/MaterialButton/CancelButton';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Formik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../configs/api';
import { findCountryByName } from '../../configs/countries';
import { commonFetch } from '../../helper';
import useAuth from '../../hooks/useAuth';
import { SubscriptionCreateResponse, SubscriptionEditResponse } from '../../interfaces/common';
import strings from '../../lang/Lang';
import { CreditCard } from '../../partials/CreditCard/CreditCard';
import ServerError from '../../partials/Error/ServerError';
import Modal from '../../partials/MaterialModal/Modal';
import { UserSubscriptionField } from '../../provider/SubscriptionProvider';
import { validatePaymentDetailUpdate } from '../../validations';

interface PaymentEditModalProps {
    openModal?: boolean,
    showBillingDetail?: boolean,
    showCard?: boolean,
    handleClose?: () => void,
}

const PaymentEditModal = ({ handleClose = () => {}, openModal = false, showBillingDetail = true, showCard = true, }: PaymentEditModalProps) => {
    const { user } = useAuth();
    const country = findCountryByName(user?.company?.country || '');

    const stripe = useStripe();
    const elements = useElements();
    const { data: intentResponse, error: intentError, mutate: intentMutate } = useSWR<SubscriptionCreateResponse, Error>(api.subscriptionCreate, commonFetch);
    const { data: subscriptionResponse, error: subscriptionError, mutate: subscriptionMutate } = useSWR<SubscriptionEditResponse, Error>(api.subscriptionEdit, commonFetch);

    const [isCardEmpty, setIsCardEmpty] = useState(true);

    const intent = intentResponse?.data?.intent || '';

    const intentLoading = !intentResponse && !intentError;
    const subscriptionLoading = !subscriptionResponse && !subscriptionError;

    if (intentError || subscriptionError) {
        return (
            <Modal
                open={openModal}
                title={strings.SUBSCRIPTION}
                handleClose={handleClose}
            >
                <div className="p-4">
                    <ServerError error={subscriptionError?.message || 'server error, contact admin'} />
                </div>
            </Modal>
        );
    }

    if (intentLoading || subscriptionLoading) {
        return (
            <Modal
                open={openModal}
                title={strings.SUBSCRIPTION}
                handleClose={handleClose}
                cancelButton={
                    <CancelButton
                        disabled={intentLoading || subscriptionLoading}
                        children={strings.Cancel}
                    />
                }
                submitButton={
                    <Button
                        disabled={intentLoading || subscriptionLoading}
                        children={strings.Submit}
                    />
                }
            >
                <SectionLoading />
            </Modal>
        );
    }

    return (
        <Formik<UserSubscriptionField>
            initialValues={{
                count: 1,
                paymentMethod: '',
                city: subscriptionResponse?.data?.address?.city || '',
                line1: subscriptionResponse?.data?.address?.line1 || '',
                postal_code: subscriptionResponse?.data?.address?.postal_code || '',
                phone: subscriptionResponse?.data?.phone || '',
                name: subscriptionResponse?.data?.name || '',
                company_name: subscriptionResponse?.data?.name || '',
                vat_number: subscriptionResponse?.data?.vat_number || '',
                vat_code: subscriptionResponse?.data?.vat_code || country?.tax_ids?.find((e) => e) || '',
                country: subscriptionResponse?.data?.address?.country || country?.name || '',
                plan: '',
                shouldValidate: true,
            }}
            enableReinitialize
            validate={validatePaymentDetailUpdate}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                let paymentMethod;
                if (!isCardEmpty) {
                    const card = elements?.getElement(CardElement);
                    if (!stripe || !elements || !card) {
                        setSubmitting(false);
                        // console.log('stripe/element/card not found.');
                        return;
                    }

                    const payload = await stripe.confirmCardSetup(
                        intent,
                        {
                            payment_method: {
                                card: card,
                                billing_details: {
                                    address: {
                                        city: values.city,
                                        country: country?.abbr,
                                        line1: values.line1,
                                        postal_code: values.postal_code,
                                    },
                                    email: user?.company?.email,
                                    phone: values.phone,
                                    name: values.name,
                                },
                                metadata: {
                                    company_name: values.company_name,
                                    vat_number: values.vat_number,
                                },
                            },
                        },
                    );

                    if (payload?.error?.code === 'setup_intent_unexpected_state') {
                        window.location.reload();
                    }

                    if (payload.error) {
                        setFieldError('paymentMethod', payload.error.message || 'card error, please try again.');
                        setSubmitting(false);
                        return;
                    }

                    paymentMethod = payload.setupIntent.payment_method;
                }

                const response = await fetch(api.subscriptionUpdate, {
                    method: 'POST',
                    headers: {
                        'X-App-Locale': strings.getLanguage(),
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': 'test',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        vat_number: values.vat_number,
                        vat_code: values.vat_number ? (values.vat_code ?? country?.tax_ids?.find((e) => e) ?? undefined) : undefined,
                        address: {
                            city: values.city,
                            country: country?.name || '',
                            line1: values.line1,
                            postal_code: values.postal_code,
                        },
                        paymentMethod: paymentMethod,
                        phone: values.phone,
                        name: values.name,
                    }),
                });

                const data = await response.json();

                if (response.status === 401) {
                    toast.error(data.message || "Unauthorized", {});
                }

                if (data.status === '1') {
                    toast.success(data.message);
                    handleClose();
                    await subscriptionMutate();
                    await intentMutate();
                    setIsCardEmpty(true);
                } else {
                    setFieldError('server', data.message || "Unauthorized");
                    await intentMutate();
                }
                setSubmitting(false);
            }}
        >
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, resetForm }) => {
                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    handleClose();
                }
                return (
                    <Modal
                        open={openModal}
                        title={strings.SUBSCRIPTION}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton
                                disabled={isSubmitting || intentLoading || subscriptionLoading}
                                onClick={handleModelClose}
                                children={strings.cancel}
                            />
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                disabled={isSubmitting || intentLoading || subscriptionLoading}
                                onClick={() => handleSubmit()}
                                children={strings.Submit}
                            />
                        }
                    >
                        <div className="p-4 space-y-4">
                            {showBillingDetail ? <>
                                <Input
                                    label={strings.Name}
                                    name={strings.Name}
                                    value={values?.name}
                                    onChange={(e) => {
                                        if (!setFieldTouched || !setFieldValue) return;
                                        setFieldTouched('name');
                                        setFieldValue('name', e.target.value)
                                    }}
                                    error={touched?.name && errors?.name}
                                />
                                <Input
                                    label={strings.Phone}
                                    name={strings.Phone}
                                    value={values?.phone}
                                    onChange={(e) => {
                                        if (!setFieldTouched || !setFieldValue) return;
                                        setFieldTouched('phone');
                                        setFieldValue('phone', e.target.value)
                                    }}
                                    error={touched?.phone && errors?.phone}
                                />
                                <Input
                                    label={strings.Address}
                                    name={strings.Address}
                                    value={values?.line1}
                                    onChange={(e) => {
                                        if (!setFieldTouched || !setFieldValue) return;
                                        setFieldTouched('line1');
                                        setFieldValue('line1', e.target.value)
                                    }}
                                    error={touched?.line1 && errors?.line1}
                                />
                                <Input
                                    label={strings.City}
                                    name={strings.City}
                                    value={values?.city}
                                    onChange={(e) => {
                                        if (!setFieldTouched || !setFieldValue) return;
                                        setFieldTouched('city');
                                        setFieldValue('city', e.target.value)
                                    }}
                                    error={touched?.city && errors?.city}
                                />
                                <Input
                                    label={strings.ZipCode}
                                    name={strings.ZipCode}
                                    value={values?.postal_code}
                                    onChange={(e) => {
                                        if (!setFieldTouched || !setFieldValue) return;
                                        setFieldTouched('postal_code');
                                        setFieldValue('postal_code', e.target.value)
                                    }}
                                    error={touched?.postal_code && errors?.postal_code}
                                />
                                {country && country.tax_ids && country.tax_ids.length > 1 ? <Select
                                    displayValue={(l) => ""}
                                    onChange={(val) => {
                                        setFieldValue('vat_code', val);
                                    }}
                                // label="Type"
                                // value={values.vat_code}
                                // className='mr-2 w-32'
                                // onChange={(e,v) => {
                                //     setFieldValue('vat_code', e.target.value);
                                // }}
                                >
                                    {country.tax_ids.map((t) => (
                                        <Select.Option value={t}>{t.split('_').join(' ').toUpperCase()}</Select.Option>
                                    ))}
                                </Select> : <></>}
                                <Input
                                    label={strings.VAT_number}
                                    name={strings.VAT_number}
                                    value={values?.vat_number}
                                    // InputProps={country && country.tax_ids && country.tax_ids.length > 1 ? {
                                    //     startAdornment: (
                                    //         <InputAdornment position="start">
                                    //             <FormControl variant="standard" size="small">
                                    //                 <Select
                                    //                     label="Type"
                                    //                     value={values.vat_code}
                                    //                     disableUnderline
                                    //                     className="pt-1"
                                    //                     onChange={(e, v) => {
                                    //                         setFieldValue('vat_code', e.target.value);
                                    //                     }}
                                    //                 >
                                    //                     {country?.tax_ids?.map((t) => (
                                    //                         <MenuItem value={t}>{t.split('_').join(' ').toUpperCase()}</MenuItem>
                                    //                     ))}
                                    //                 </Select>
                                    //             </FormControl>
                                    //         </InputAdornment>
                                    //     )
                                    // } : undefined}
                                    onChange={(e) => {
                                        if (!setFieldTouched || !setFieldValue) return;
                                        setFieldTouched('vat_number');
                                        setFieldValue('vat_number', e.target.value)
                                    }}
                                    error={touched?.vat_number && errors?.vat_number}
                                />
                            </> : <></>}
                            {showCard ?
                                <CreditCard
                                    error={touched?.paymentMethod && Boolean(errors?.paymentMethod)}
                                    helperText={touched?.paymentMethod && errors?.paymentMethod}
                                    onChange={(event) => {
                                        setIsCardEmpty(event.empty);
                                    }}
                                />
                                : <></>
                            }
                            <ServerError error={errors.server} />
                        </div>
                    </Modal>
                );
            }}
        </Formik>
    )
}

export default PaymentEditModal;
