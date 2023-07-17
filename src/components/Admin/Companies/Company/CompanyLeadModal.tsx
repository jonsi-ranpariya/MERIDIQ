import TextArea from '@components/form/TextArea';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../../configs/api';
import { Company } from '../../../../interfaces/model/company';
import strings from '../../../../lang/Lang';
import ServerError from '../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import CancelButton from '../../../../partials/MaterialButton/CancelButton';
import Checkbox from '../../../../partials/MaterialCheckbox/MaterialCheckbox';
import Modal from '../../../../partials/MaterialModal/Modal';

export interface ICompanyLeadValues {
    notes: string,
    status: string,
    contacted: 1 | 0,
    server?: string,
}

export interface CompanyLeadModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedCompany?: Company
}

const CompanyLeadModal: React.FC<CompanyLeadModalProps> = ({
    openModal,
    setOpenModal,
    mutate,
    selectedCompany
}) => {

    const navigate = useNavigate();

    return (
        <Formik<ICompanyLeadValues>
            initialValues={selectedCompany?.lead ? {
                notes: selectedCompany?.lead?.notes || '',
                status: selectedCompany?.lead?.status || '',
                contacted: selectedCompany?.lead?.contacted ? 1 : 0,
            } : {
                notes: '',
                status: '',
                contacted: 0,
            }}
            enableReinitialize
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const response = await fetch(api.companyLeadUpdate, {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
                        'Content-Type': 'application/json',
                        'X-App-Locale': strings.getLanguage(),
                    },
                    credentials: 'include',
                    body: JSON.stringify({ ...values, company_id: selectedCompany?.id || '' }),
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
                        title={selectedCompany?.company_name || strings.CompanyName}
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
                                    if (!dirty && selectedCompany) {
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
                        <div className="p-4 grid grid-flow-row grid-cols-1 gap-4">
                            <div className="flex space-x-3">
                                <Checkbox
                                    label={strings.Won}
                                    checked={values.status === api.leadTypes.win}
                                    name="status"
                                    onChange={async () => {
                                        await setFieldValue('status', api.leadTypes.win)
                                        setFieldTouched('status')
                                    }}
                                />
                                <Checkbox
                                    label={strings.Lost}
                                    checked={values.status === api.leadTypes.lost}
                                    name="status"
                                    onChange={async () => {
                                        await setFieldValue('status', api.leadTypes.lost)
                                        setFieldTouched('status')
                                    }}
                                />
                                <Checkbox
                                    label={strings.NotDecided}
                                    checked={values.status === api.leadTypes.not_decided}
                                    name="status"
                                    onChange={async () => {
                                        await setFieldValue('status', api.leadTypes.not_decided)
                                        setFieldTouched('status')
                                    }}
                                />
                            </div>
                            <div className="">
                                <div className="font-semibold text-lg">{strings.Contacted}?</div>
                                <div className="flex space-x-3">
                                    <Checkbox
                                        label={strings.Yes}
                                        checked={values.contacted === 1}
                                        name="contacted"
                                        onChange={async () => {
                                            await setFieldValue('contacted', 1)
                                            setFieldTouched('contacted')
                                        }}
                                    />
                                    <Checkbox
                                        label={strings.No}
                                        checked={values.contacted === 0}
                                        name="contacted"
                                        onChange={async () => {
                                            await setFieldValue('contacted', 0)
                                            setFieldTouched('contacted')
                                        }}
                                    />
                                </div>
                            </div>
                            <TextArea
                                name="notes"
                                required
                                rows={12}
                                label={strings.NOTES}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.notes}
                                error={touched?.notes && errors.notes}
                            />
                            <ServerError className="mt-4" error={errors?.server} />
                        </div>
                    </Modal>
                );
            }}
        </Formik>

    );
}

export default CompanyLeadModal;