import { Formik } from 'formik';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../../configs/api';
import { heic2convert, makeXMLRequest } from '../../../../helper';
import { File } from '../../../../interfaces/model/File';
import strings from '../../../../lang/Lang';
import ServerError from '../../../../partials/Error/ServerError';
import TinyError from '../../../../partials/Error/TinyError';
import FormikErrorFocus from '../../../../partials/FormikErrorFocus/FormikErrorFocus';
import SelectImageIcon from '../../../../partials/Icons/SelectImage';
import Button from '@components/form/Button';
import CancelButton from '../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../partials/MaterialModal/Modal';
import { validateClientMedia } from '../../../../validations';

export interface ClientMediaModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
    onImageSelect?: (files: (File | Blob)[]) => Promise<any>,
}

export interface IClientMediaValues {
    images: (File | Blob)[],
    server?: string,
}


function loadImage(images?: (File | Blob)[]) {
    if (images && images?.length) {
        return `${images.length} ${strings.images_has_selected}`;
    } else {
        return (
            <div>
                <SelectImageIcon className="text-6xl mb-2 inline-block text-gray-400" />
                <p className="text-sm font-medium">{strings.upload_media_message}</p>
            </div>
        )
    }
}

function uploadingImage(images_count: number, progress: number) {
    const perImageProgress = 100 / images_count;

    if (progress >= 100) {
        return (
            <div>
                <p>{strings.processing}...</p>
            </div>
        );
    }

    return (
        <div>
            <p>{parseInt((progress / perImageProgress).toString(), 10)}/{images_count} ({progress}% done)</p>
        </div>
    );
}

const fileLimit = 15;

export const fileTypes = ['jpeg', 'jpg', 'png', 'heic'];

const ClientMediaModal: React.FC<ClientMediaModalProps> = ({
    openModal,
    setOpenModal,
    mutate = async () => {},
    onImageSelect = async () => {},
}) => {
    const navigate = useNavigate();
    const { clientId }: { clientId?: string } = useParams();
    const [progress, setProgress] = useState(0);

    return (
        <Formik<IClientMediaValues>
            initialValues={{
                images: [],
            }}
            enableReinitialize
            validate={validateClientMedia}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                setSubmitting(true);

                const formData = new FormData();
                for (let i = 0; i < values.images.length; i++) {
                    formData.set(`files[${i}]`, values.images[i] as Blob);
                }

                const response = await makeXMLRequest(
                    'POST',
                    api.clientMediaStore.replace(':id', clientId!),
                    formData,
                    (e) => {
                        setProgress(Math.round((e.loaded / e.total) * 100));
                    },
                );

                const data = JSON.parse(response.response);

                if (response.status === 401) {
                    navigate('/');
                }

                if (data.status === '1') {
                    onImageSelect(values.images);
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
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm }) => {

                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={strings.NewMedia}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton
                                fullWidth
                                disabled={isSubmitting}
                                onClick={handleModelClose}
                            >{strings.Cancel}
                            </CancelButton>
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (handleSubmit) return handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4">
                            <label htmlFor="template_image" className={`border relative text-center h-56 p-1 grid place-items-center grid-cols-1 grid-rows-1 text-gray-500 dark:text-gray-300 focus-within:ring-2 ring-primary rounded ${errors?.images && touched?.images ? 'border-error' : 'border-gray-300 dark:border-gray-600'}`}>
                                {isSubmitting ? uploadingImage(values.images.length, progress) : loadImage(values.images)}
                                <input
                                    type="file"
                                    id="template_image"
                                    name="image"
                                    className="focus:outline-none h-0 w-0"
                                    accept=".png,.jpg,.jpeg,.heic"
                                    disabled={isSubmitting}
                                    multiple
                                    onChange={async (event) => {
                                        if (!event?.target?.files?.length) return;
                                        let eFiles = event.target.files;
                                        if (eFiles.length > fileLimit) {
                                            alert(strings.media_max_select);
                                            return;
                                        }
                                        for (let index = 0; index < eFiles.length; index++) {
                                            const filename = eFiles[index].name.split('.').pop();
                                            if (fileTypes.includes(filename?.toLowerCase() ?? '')) continue;
                                            alert(strings.only_images_allowed);
                                            return;
                                        }
                                        let files = [];
                                        for (const file of Array.from(eFiles)) {
                                            let newFile: File | Blob | string = file;
                                            if (newFile && !newFile.type) {
                                                newFile = await heic2convert(file);
                                            }
                                            files.push(newFile);
                                        }
                                        await setFieldValue('images', files);
                                        await setFieldTouched('images');
                                    }}
                                />
                            </label>
                            <TinyError
                                error={!!(errors?.images && touched?.images)}
                                helperText={errors.images as string}
                            />
                            <ServerError className="mt-4" error={errors?.server} />
                        </div>
                    </Modal>
                );
            }}
        </Formik >
    );
}

export default ClientMediaModal;