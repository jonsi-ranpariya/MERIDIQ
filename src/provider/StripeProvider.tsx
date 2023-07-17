import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { ReactNode } from 'react';
import useTranslation from '../hooks/useTranslation';

export interface StripeProviderProps {
    children: ReactNode,
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
    const [language] = useTranslation();

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY || '', { locale: language });
    return <Elements stripe={stripePromise} key={language}>
        {children}
    </Elements>;
}
