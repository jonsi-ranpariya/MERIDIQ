import { CardElement, CardElementProps } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';
import React from 'react';
import useTheme from '../../hooks/useTheme';
import Error from './Error';


interface CreditCardProps extends CardElementProps {
    error?: string | false | undefined,
}


export const CreditCard: React.FC<CreditCardProps> = ({ error, ...props }) => {

    const { isDark } = useTheme();
    const CARD_OPTIONS: StripeCardElementOptions = isDark ? {
        hidePostalCode: true,
        iconStyle: 'solid',
        style: {
            base: {
                iconColor: '#fff',
                color: '#fff',
                backgroundColor: '#1a1b1c',
                fontWeight: 500,
                fontFamily: '"Inter var", "Inter", sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                ':-webkit-autofill': { color: '#ffffff' },
                '::placeholder': { color: '#ffffffb3', fontSize: '1rem' },
            },
            invalid: {
                iconColor: '#ef4444',
                color: '#ef4444',
            },
        },
    } : {
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

    return (
        <div className="">
            <CardElement
                options={CARD_OPTIONS}
                className="form-input block py-2.5 px-3.5 w-full rounded-[4px] border-lightPurple dark:border-gray-700 text-dimGray dark:text-white hover:border-mediumGray dark:hover:border-gray-600 bg-white dark:bg-dimGray focus:border-primary focus:ring-1 placeholder:text-mediumGray dark:placeholder:text-gray-600"
                {...props}
            />
            <Error error={error} />
        </div>
    )
}