import InfoCard from '@components/form/InfoCard';
import Input from '@components/form/Input';
import Modal from '@partials/MaterialModal/Modal';
import { Formik } from 'formik';
import { FC } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import useAuth from '../../hooks/useAuth';
import strings from '../../lang/Lang';
import FormikErrorFocus from '../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import { validateUserPasswordUpdate } from '../../validations';

export interface IChangePasswordValues {
    old_password: string,
    password: string,
    password_confirmation: string,
    server?: string,
}

interface MyProfileChangePasswordProps {
    isOpen?: boolean
    onClose: () => void
}

const MyProfileChangePassword: FC<MyProfileChangePasswordProps> = ({
    isOpen,
    onClose
}) => {
    const { user, mutate } = useAuth();
    const navigate = useNavigate();

    return (
        <Modal
            open={isOpen}
            handleClose={onClose}
            title={strings.ChangePassword}
        >
            <Formik<IChangePasswordValues>
                initialValues={{
                    old_password: '',
                    password: '',
                    password_confirmation: '',
                }}
                validate={validateUserPasswordUpdate}
                onSubmit={async (values, { resetForm, setSubmitting, setFieldError }) => {
                    const formData = new FormData();
                    formData.set('password', values.password);
                    formData.set('old_password', values.old_password);
                    formData.set('password_confirmation', values.password_confirmation);
                    const response = await fetch(api.userUpdate.replace(':id', user?.id?.toString() || ''), {
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
                        onClose();
                        resetForm();
                        toast.success(data.message);
                    } else {
                        setFieldError('server', data.message || 'server error, please contact admin.');
                    }
                    setSubmitting(false);
                }}
            >
                {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, handleBlur, handleChange, submitForm }) => (
                    <div className='space-y-6 p-6'>
                        <FormikErrorFocus />
                        <Input
                            type="password"
                            autoComplete='off'
                            name="old_password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.old_password}
                            error={touched?.old_password && errors.old_password}
                            label={strings.OLD_PASSWORD}
                            required
                        />
                        <Input
                            type="password"
                            autoComplete='off'
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            error={touched?.password && errors.password}
                            label={strings.signup_password}
                            required
                        />
                        <Input
                            type="password"
                            autoComplete='off'
                            name="password_confirmation"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password_confirmation}
                            error={touched?.password_confirmation && errors.password_confirmation}
                            label={strings.signup_re_password}
                            required
                        />

                        <InfoCard message={errors?.server} />

                        <Button
                            type='submit'
                            onClick={submitForm}
                            loading={isSubmitting || isValidating}
                            children={strings.UPDATE_PASSWORD}
                        />
                    </div>
                )}

            </Formik>
        </Modal>
    )
}

export default MyProfileChangePassword
