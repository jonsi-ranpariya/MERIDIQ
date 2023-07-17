import { SectionLoading } from '@partials/Loadings/SectionLoading';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { FormikProps, useFormik } from 'formik';
import React, { createContext, useMemo } from 'react';
import TagManager from 'react-gtm-module';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR, { MutatorCallback } from 'swr';
import { tagManagerArgs } from '../components/Register';
import api from '../configs/api';
import { findCountryByName } from '../configs/countries';
import { commonFetch } from '../helper';
import useAuth from '../hooks/useAuth';
import useLocalStorage from '../hooks/useLocalStorage';
import useTranslation from '../hooks/useTranslation';
import { SubscriptionCreateResponse } from '../interfaces/common';
import { NewPlan } from '../interfaces/model/plan';
import FullPageError from '../partials/Error/FullPageError';
import FullPageLoading from '../partials/Loadings/FullPageLoading';
import { validateSubscription } from '../validations';

interface SubscriptionProps {
    children?: React.ReactNode,
    upgrade?: boolean
}

export interface UserSubscriptionField {
    count: number,
    paymentMethod: string,
    city: string,
    country: string,
    line1: string,
    postal_code: string,
    phone: string,
    name: string,
    company_name: string,
    vat_number: string,
    vat_code?: string,
    plan: string,
    refercode?: string,
    shouldValidate: boolean,
    server?: string,
}
// 'payment_method.paymentMethod': string,
// 'payment_method.billing_details.address.city': string,
// 'payment_method.billing_details.address.country': string,
// 'payment_method.billing_details.address.line1': string,
// 'payment_method.billing_details.address.postal_code': string,
// 'payment_method.billing_details.email': string,
// 'payment_method.billing_details.phone': string,
// 'payment_method.billing_details.name': string,
// 'payment_method.metadata.company_name': string,
// 'payment_method.metadata.vat_number': string,
// 'plan': string,

export const SubscriptionContext = createContext<{
    loading: boolean,
    plans: NewPlan[] | undefined,
    intent: string,
    upgrade: boolean,
    mutate: (data?: SubscriptionCreateResponse | Promise<SubscriptionCreateResponse> | MutatorCallback<SubscriptionCreateResponse>, shouldRevalidate?: boolean) => Promise<SubscriptionCreateResponse | undefined>,
    formik?: FormikProps<UserSubscriptionField>,
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    extra: {
        client_count: number;
        user_count: number;
        storage_count: number;
    },
    isSubscriptionFirstTime: boolean,
}>({
    loading: false,
    intent: '',
    plans: undefined,
    upgrade: false,
    mutate: async () => { return undefined },
    showModal: false,
    setShowModal: () => {},
    extra: {
        client_count: 0,
        user_count: 0,
        storage_count: 0,
    },
    isSubscriptionFirstTime: false,
});

export const SubscriptionProvider: React.FC<SubscriptionProps> = ({ children, upgrade = false }) => {
    const { loggedOut, user, mutate: reload } = useAuth();
    const country = findCountryByName(user?.company?.country || '');

    const isSubscriptionFirstTime = useMemo(() => !user?.company?.is_cancelled && !user?.company?.is_subscribed, [user])
    const navigate = useNavigate();
    const [showModal, setShowModal] = React.useState(false);
    const [language] = useTranslation();
    const stripe = useStripe();
    const elements = useElements();

    const { getStoredValue: referCode } = useLocalStorage<string | null>('refercode')

    // const random = useRef(Date.now());
    const { data: response, mutate, error } = useSWR<SubscriptionCreateResponse, Error>(api.subscriptionCreate, commonFetch, {
        revalidateOnFocus: false,
        refreshInterval: 0,
        refreshWhenHidden: false,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
        refreshWhenOffline: true,
    });

    const plans = useMemo(() => response?.data?.plans, [response]);

    const extra = {
        client_count: response?.data?.client_count || 0,
        user_count: response?.data?.user_count || 0,
        storage_count: response?.data?.storage_count || 0,
    };
    const intent = response?.data?.intent || '';

    const loading = !user && !error;

    // if logged out, redirect to the homepage
    React.useEffect(() => {
        if (loggedOut) {
            navigate("/login", { replace: true });
        }
    }, [loggedOut, navigate]);

    // if logged in, redirect to the dashboard
    React.useEffect(() => {
        if (!loggedOut && !upgrade && user?.company?.email === user?.email && user?.company?.is_subscribed === true) {
            navigate("/", { replace: true });
        }
    }, [user, navigate, loggedOut, upgrade]);

    const formik = useFormik<UserSubscriptionField>({
        initialValues: {
            count: 1,
            paymentMethod: '',
            city: '',
            line1: '',
            postal_code: '',
            phone: '',
            name: '',
            company_name: '',
            vat_number: '',
            vat_code: country?.tax_ids?.find((e) => e) || '',
            plan: '',
            country: '',
            shouldValidate: true,
        },
        validate: (values) => validateSubscription(values),
        onSubmit: async (values, { setSubmitting, setFieldError, resetForm }) => {
            if (!values.shouldValidate) {
                const response = await fetch(api.subscriptionStore, {
                    method: 'POST',
                    headers: {
                        'X-App-Locale': language,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': 'test',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        refercode: values.refercode,
                        plan: values.plan,
                        quantity: values.count,
                    }),
                });

                const data = await response.json();

                if (response.status === 401) {
                    toast.success(data.message || "Unauthorized", {});
                }

                await mutate();

                if (data.status === '1') {
                    TagManager.initialize(tagManagerArgs);

                    TagManager.dataLayer({
                        dataLayer: {
                            event: 'purchaseComplete',
                        },
                    });
                    setShowModal(false);
                    toast.success(data.message);
                    await reload();
                } else {
                    await reload();
                    toast.error(data.message);
                }
                setSubmitting(false);
                return;
            }

            const card = elements?.getElement(CardElement);
            if (!stripe || !elements || !card) {
                setSubmitting(false);
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
                            refercode: referCode ? referCode : null,
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

            const response = await fetch(api.subscriptionStore, {
                method: 'POST',
                headers: {
                    'X-App-Locale': language,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': 'test',
                },
                credentials: 'include',
                body: JSON.stringify({
                    plan: values.plan,
                    quantity: values.count,
                    refercode: values.refercode,
                    payment_method: {
                        paymentMethod: payload.setupIntent.payment_method,
                        billing_details: {
                            address: {
                                city: values.city,
                                country: country?.name ?? '',
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
                            vat_code: values.vat_number ? (values.vat_code ?? country?.tax_ids?.find((e) => e) ?? undefined) : undefined,
                        },
                    },
                }),
            });

            const data = await response.json();

            if (response.status === 401) {
                toast.error(data.message || "Unauthorized", {});
            }

            await mutate();

            if (data.status === '1') {
                TagManager.initialize(tagManagerArgs);

                TagManager.dataLayer({
                    dataLayer: {
                        event: 'purchaseComplete',
                    },
                });
                setShowModal(false);
                toast.success(data.message);
                await reload();
                resetForm();
            } else {
                setFieldError('server', data.message || "Unauthorized");
                await reload();
                toast.error(data.message);
            }
            setSubmitting(false);
        },
    });

    if (loggedOut || (!response && !error)) return upgrade ? <SectionLoading /> : <FullPageLoading />;

    if (error) return <FullPageError code={error?.status || undefined} message={error?.message || 'server error'} />

    if (!plans?.length) return upgrade ? <SectionLoading /> : <FullPageLoading />;

    return (
        <SubscriptionContext.Provider value={{
            loading,
            plans: plans,
            intent,
            upgrade,
            mutate,
            formik: formik,
            showModal,
            extra,
            setShowModal,
            isSubscriptionFirstTime,
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}
