import Input from '@components/form/Input';
import CancelButton from '@partials/MaterialButton/CancelButton';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { Category } from '@interface/model/category';
import strings from '../../lang/Lang';
import ServerError from '../../partials/Error/ServerError';
import FormikErrorFocus from '../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import Modal from '../../partials/MaterialModal/Modal';
import { validateCategoryStore } from '../../validations';

export interface ICategoryValues {
    name: string,
    server?: string,
}
export interface CategoryModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedCategory?: Category
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    openModal, setOpenModal, mutate, selectedCategory
}) => {

    const navigate = useNavigate();

    return (
        <Formik<ICategoryValues>
            initialValues={!selectedCategory ? {
                name: '',
            } : {
                name: selectedCategory.name,
            }}
            enableReinitialize
            validate={validateCategoryStore}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const response = await fetch(!selectedCategory ? api.categoryCreate : api.categoryUpdate(selectedCategory.id), {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': 'test',
                        'Content-Type': 'application/json',
                        'X-App-Locale': strings.getLanguage(),
                    },
                    credentials: 'include',
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (response.status === 401) {
                    navigate('/');
                }

                if (data.status === '1') {
                    await mutate();
                    await resetForm();
                    toast.success(data.message);
                    setOpenModal(false);
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, resetForm, values, touched, dirty, handleSubmit, isSubmitting, isValidating, handleBlur, handleChange }) => {
                const handleClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false);
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={`${selectedCategory ? strings.update : strings.add} ${strings.category}`}
                        handleClose={handleClose}
                        cancelButton={
                            <CancelButton
                                disabled={isSubmitting}
                                onClick={handleClose}
                            />
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (!dirty && selectedCategory) {
                                        toast.success(strings.no_data_changed)
                                        handleClose();
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
                            <Input
                                name="name"
                                label={strings.category_name}
                                placeholder={strings.category_name}
                                required
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.name}
                                error={touched?.name && errors.name}
                            />
                            <ServerError className="mt-4" error={errors?.server} />
                        </div>
                    </Modal>
                );
            }}
        </Formik>

    );
}

export default CategoryModal;