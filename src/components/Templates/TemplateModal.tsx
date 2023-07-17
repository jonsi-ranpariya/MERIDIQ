import Input from '@components/form/Input';
import CancelButton from '@partials/MaterialButton/CancelButton';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { convertBase64ToFile, heic2convert, toBase64 } from '../../helper';
import { Template } from '../../interfaces/model/template';
import strings from '../../lang/Lang';
import ServerError from '../../partials/Error/ServerError';
import TinyError from '../../partials/Error/TinyError';
import FormikErrorFocus from '../../partials/FormikErrorFocus/FormikErrorFocus';
import SelectImageIcon from '../../partials/Icons/SelectImage';
import Button from '@components/form/Button';
import Modal from '../../partials/MaterialModal/Modal';
import { validateTemplateStore } from '../../validations';

export interface ITemplateValues {
    name: string,
    image: string,
    server?: string,
}
export interface TemplateModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedTemplate?: Template
}

function loadImage(image?: string) {

    if (image && image !== '') {
        if (image.startsWith('data:')) {
            return <img height="100%" className="h-full w-full object-contain" src={image || ''} alt="Template" />
        } else {
            return <img height="100%" className="h-full w-full object-contain" src={`${process.env.REACT_APP_STORAGE_PATH}/${image}`} alt="Template" />
        }
    } else {
        return (
            <div>
                <SelectImageIcon className="text-6xl mb-2 inline-block text-gray-400" />
                <p className="text-sm font-medium">{strings.click_here_to_upload_image}</p>
            </div>
        )
    }
}

const TemplateModal: React.FC<TemplateModalProps> = ({
    openModal, setOpenModal, mutate,
    selectedTemplate
}) => {

    const navigate = useNavigate();

    return (
        <Formik<ITemplateValues>
            initialValues={!selectedTemplate ? {
                name: '',
                image: '',
            } : {
                name: selectedTemplate.name,
                image: selectedTemplate.image || '',
            }}
            enableReinitialize
            validate={validateTemplateStore}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const formData = new FormData();
                formData.set('name', values.name);
                if (values.image && values.image.startsWith('data:')) {
                    formData.set('image', convertBase64ToFile(values.image))
                }
                if (selectedTemplate?.id && !values?.image?.startsWith('data:')) {
                    formData.delete('image')
                }
                const response = await fetch(!selectedTemplate ? api.templateStore : api.templateUpdate(selectedTemplate.id), {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
                        'X-App-Locale': strings.getLanguage(),
                    },
                    credentials: 'include',
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
                    setOpenModal(false);
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, resetForm, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, handleBlur, handleChange }) => {
                const handleClose = async () => {
                    if (isSubmitting) return;
                    setOpenModal(false);
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={`${selectedTemplate ? strings.update : strings.add} ${strings.Template}`}
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
                                    if (!dirty && selectedTemplate) {
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
                            <label htmlFor="template_image" className={`border relative text-center h-56 p-1 grid place-items-center grid-rows-1 text-gray-500 dark:text-gray-300 focus-within:ring-2 ring-primary rounded ${errors?.image && touched?.image ? 'border-error' : 'border-gray-300 dark:border-gray-600'}`}>
                                {loadImage(values.image)}
                                <input
                                    type="file"
                                    id="template_image"
                                    name="image"
                                    className="focus:outline-none h-0 w-0"
                                    accept=".png,.jpg,.jpeg,.heic"
                                    onChange={async (event) => {
                                        setFieldTouched('image');
                                        if (!event?.target?.files?.length) return;

                                        let file: File | Blob | null = event.target.files[0];

                                        if (file && !file.type) {
                                            file = await heic2convert(file)
                                        }

                                        const imageData = await toBase64(file);
                                        await setFieldValue('image', imageData);
                                        await setFieldTouched('image');
                                    }}
                                />
                            </label>
                            <TinyError
                                error={!!(errors?.image && touched?.image)}
                                helperText={errors.image}
                            />
                            <Input
                                name="name"
                                label={strings.TemplateName}
                                placeholder={strings.TemplateName}
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

export default TemplateModal;