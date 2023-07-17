import Button from '@components/form/Button';
import Input from '@components/form/Input';
import TipTapEditor from '@components/TipTap/TipTapEditor';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { isHTML } from '../../helper';
import useAuth from '../../hooks/useAuth';
import { Treatment, TreatmentType } from '../../interfaces/model/treatment';
import strings from '../../lang/Lang';
import ServerError from '../../partials/Error/ServerError';
import FormikErrorFocus from '../../partials/FormikErrorFocus/FormikErrorFocus';
import CancelButton from '../../partials/MaterialButton/CancelButton';
import Modal from '../../partials/MaterialModal/Modal';
import UnitSelect from '../../partials/Select/UnitSelect';
import { validateTreatmentStore } from '../../validations';

export interface ITreatmentValues {
    cost?: string,
    description?: string,
    name: string,
    unit?: string,
    notes?: string,
    type?: TreatmentType,
    server?: string,
}

export interface TreatmentModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedTreatment?: Treatment
    type?: TreatmentType,
}

const TreatmentModal: React.FC<TreatmentModalProps> = ({
    openModal, setOpenModal, mutate, selectedTreatment, type = 'treatment'
}) => {

    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Formik<ITreatmentValues>
            initialValues={!selectedTreatment ? {
                cost: '',
                description: '',
                name: '',
                unit: user?.company?.unit || 'usd',
                notes: '',
                type: type,
            } : {
                cost: selectedTreatment.cost,
                description: selectedTreatment.description,
                name: selectedTreatment.name,
                unit: user?.company?.unit || 'usd',
                notes: isHTML(selectedTreatment.notes ?? '')
                    ? selectedTreatment.notes
                    : `${(selectedTreatment.notes ?? '')}`.replaceAll('\n', '<br/>'),
                type: selectedTreatment.type,
            }}
            enableReinitialize
            validate={validateTreatmentStore}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                let apiUrl = ''
                if (selectedTreatment) {
                    apiUrl = api.treatmentUpdate(selectedTreatment.id)
                } else {
                    apiUrl = api.treatmentStore
                }
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': 'test',
                        'Content-Type': 'application/json',
                        'X-App-Locale': strings.getLanguage(),
                    },
                    credentials: "include",
                    body: JSON.stringify({ ...values, unit: undefined }),
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
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm }) => {

                const handleClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={`${!selectedTreatment ? strings.add : strings.Update} ${strings.Template}`}
                        loading={isSubmitting || isValidating}
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
                                    if (!dirty && selectedTreatment) {
                                        toast.success(strings.no_data_changed)
                                        handleClose();
                                        return;
                                    }
                                    handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <div className="p-4 space-y-4">
                            <FormikErrorFocus />
                            <Input
                                label={type === 'text' ? strings.Text.toUpperCase() : strings.TREATMENT_TREATMENT}
                                required
                                name="name"
                                onChange={(e) => {
                                    setFieldTouched('name');
                                    setFieldValue('name', e.target.value)
                                }}
                                value={values.name}
                                error={touched?.name && errors.name}
                            />
                            {
                                type === 'treatment' &&
                                <div className="flex space-x-6 items-end">
                                    <div className="w-full">
                                        <Input
                                            label={strings.COST}
                                            required
                                            type="number"
                                            name="cost"
                                            onChange={(e) => {
                                                setFieldTouched('cost');
                                                setFieldValue('cost', e.target.value)
                                            }}
                                            value={values.cost}
                                            error={touched?.cost && errors.cost}
                                        />

                                    </div>
                                    <div className="w-full">
                                        <UnitSelect disabled />
                                    </div>
                                </div>
                            }
                            <Input
                                label={strings.BRAND}
                                name="description"
                                onChange={(e) => {
                                    setFieldTouched('description');
                                    setFieldValue('description', e.target.value)
                                }}
                                value={values.description}
                                error={touched?.description && errors.description}
                            />
                            <TipTapEditor
                                onChange={async (data) => {
                                    await setFieldValue('notes', data)
                                    await setFieldTouched('notes');
                                }}
                                data={values.notes ?? values.notes ?? ''}
                                error={touched?.notes && Boolean(errors.notes)}
                                helperText={touched?.notes ? errors.notes : ''}
                            />
                            <ServerError error={errors?.server} className="mt-4" />
                        </div>
                    </Modal >
                );
            }}
        </Formik >
    );
}

export default TreatmentModal;