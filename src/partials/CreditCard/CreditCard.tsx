import { CardElement, CardElementProps } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';
import React from 'react';
import useTheme from '../../hooks/useTheme';
import TinyError from '../Error/TinyError';

interface CreditCardProps extends CardElementProps {
    error?: boolean,
    helperText?: string | false | undefined,
}

const lightTheme: StripeCardElementOptions = {
    hidePostalCode: true,
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#000',
            color: '#000',
            fontWeight: 500,
            fontFamily: '"Inter var", "Inter", sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': { color: '#000000' },
            '::placeholder': { color: '#0000008a', fontSize: '1rem' },
        },
        invalid: {
            iconColor: '#ef4444',
            color: '#ef4444',
        },
    }
};

const darkTheme: StripeCardElementOptions = {
    hidePostalCode: true,
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#fff',
            color: '#fff',
            fontWeight: 500,
            fontFamily: '"Inter var", "Inter", sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': { color: '#ffffff' },
            '::placeholder': { color: 'rgba(255,255,255,0.6)', fontSize: '1rem' },
        },
        invalid: {
            iconColor: '#ef4444',
            color: '#ef4444',
        },
    },
};

export const CreditCard: React.FC<CreditCardProps> = ({ error, helperText, ...props }) => {

    const { isDark } = useTheme();

    const CARD_OPTIONS: StripeCardElementOptions = isDark ? darkTheme : lightTheme;

    return (
        <div className="mb-4 ">
            <div className="border font-medium grid place-items-center grid-cols-1 h-12 pl-4 pr-1 rounded border-gray-300 dark:border-gray-800">
                <CardElement
                    options={CARD_OPTIONS}
                    className="w-full"
                    {...props}
                />
            </div>
            <TinyError
                error={error}
                helperText={helperText}
            />
        </div>
    )
}