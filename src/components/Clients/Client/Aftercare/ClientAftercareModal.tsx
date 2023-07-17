import Button from '@components/form/Button';
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import api from "../../../../configs/api";
import { heic2convert } from "../../../../helper";
import strings from "../../../../lang/Lang";
import ServerError from "../../../../partials/Error/ServerError";
import FormikErrorFocus from "../../../../partials/FormikErrorFocus/FormikErrorFocus";
import CancelButton from "../../../../partials/MaterialButton/CancelButton";
import File from "../../../../partials/MaterialFile/File";
import Modal from "../../../../partials/MaterialModal/Modal";
import { validateClientAftercare } from "../../../../validations";

export interface IClientAftercareValues {
    file: File | null,
    server?: string,
}

export interface ClientAftercareModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>
}

const ClientAftercareModal: React.FC<ClientAftercareModalProps> = ({
    openModal = false,
    setOpenModal = () => {},
    mutate,
}) => {

    const { clientId }: { clientId?: string } = useParams();
    const navigate = useNavigate();

    return (
        <Formik<IClientAftercareValues>
            initialValues={{
                file: null,
            }}
            enableReinitialize
            validate={validateClientAftercare}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {

                const formData = new FormData();
                if (values?.file) {
                    formData.append('file', values?.file);
                }

                const response = await fetch(api.clientAfterCareTreatmentStore.replace(':id', clientId || ''), {
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
                    await resetForm();
                    mutate()
                    toast.success(data.message);
                    setOpenModal(false);
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm }) => {

                const handleClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={strings.AfterCare}
                        handleClose={handleClose}
                        cancelButton={
                            <CancelButton
                                fullWidth
                                disabled={!!isSubmitting}
                                onClick={handleClose}
                            >{strings.Cancel}
                            </CancelButton>
                        }
                        submitButton={
                            <Button
                                fullWidth
                                className=""
                                loading={!!isSubmitting}
                                disabled={!!isSubmitting}
                                onClick={() => { handleSubmit() }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4">
                            <File
                                onChange={async (e) => {
                                    let file: File | Blob | null = e?.target?.files ? e.target.files[0] : null;
                                    if (file && !file.type) {
                                        file = await heic2convert(file);
                                    }

                                    await setFieldTouched("file");
                                    setFieldValue(
                                        "file",
                                        e?.target?.files ? e.target.files[0] : null
                                    );
                                }}
                                name="file"
                                error={touched?.file && Boolean(errors.file)}
                                helperText={touched?.file && errors.file}
                            />


                            <ServerError error={errors?.server} className="mt-4" />
                        </div>
                    </Modal >
                );
            }}
        </Formik>
    );
}

export default ClientAftercareModal;