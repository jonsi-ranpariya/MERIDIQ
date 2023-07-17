import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';

interface FormikErrorFocusProps {

}
export function goToError<T>(errors: T, key = ''): void {
    if (!errors) return;

    if (Array.isArray(errors)) {
        for (let index = 0; index < errors.length; index++) {
            const error = errors[index];
            if (Object.keys(error).length) {
                return goToError(errors[index], `${key ? `${key}.` : ''}${index}`);
            }
        }
    }

    if (typeof errors === 'object') {
        const keys = Object.keys(errors);
        if (keys.length) {
            // @ts-ignore
            if (Array.isArray(errors[keys[0]])) {
                // @ts-ignore
                return goToError(errors[keys[0]], `${key ? `${key}.` : ''}${keys[0]}`);
            }

            key = `${key ? `${key}.` : ''}${keys[0]}`;
            // console.log(key);

            const errorElement = document.querySelector(`[name='${key}']`) as HTMLElement;
            if (errorElement) {
                errorElement.focus();

                return;
                // errorElement.scroll({
                //     top: 0,
                //     left: 0,
                //     behavior: 'smooth',
                // });
            }
        }
    }

    // if (errors && errors?.data?.length) {
    //     const errorIndex = errors?.data?.findIndex((err) => {
    //         if (typeof err === 'string' && err.length) return true;
    //         if (err?.value || err?.text) return true;
    //     });
    //     if (errorIndex !== -1 && errorIndex !== undefined) {
    //         if (typeof errors?.data[errorIndex] === 'string') {
    //             document.getElementById(`textarea_${errorIndex}`).focus();
    //         } else if (errors?.data[errorIndex]?.value) {
    //             document.getElementById(`question${errorIndex}_1`).focus();
    //         } else if (errors?.data[errorIndex]?.text) {
    //             document.getElementById(`textarea_${errorIndex}`).focus();
    //         }
    //     }
    //     element.scroll({
    //         top: 100,
    //         left: 100,
    //         behavior: 'smooth'
    //     });
    // }
}

const FormikErrorFocus = (props: FormikErrorFocusProps) => {
    const formik = useFormikContext();
    const [submitCount, setSubmitCount] = useState(formik.submitCount);

    useEffect(() => {
        if (!formik.isValid && formik.submitCount > submitCount) {
            goToError(formik.errors);
            setSubmitCount(formik.submitCount);
        }
    }, [formik.submitCount, formik.isValid, formik.errors, submitCount]);

    useEffect(() => {
        if (formik.submitCount === 0) {
            setSubmitCount(formik.submitCount);
        }
    }, [formik.submitCount])

    return null;
}

export default FormikErrorFocus
