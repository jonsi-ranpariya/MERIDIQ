
import Button from '@components/form/Button';
import Input from '@components/form/Input';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
// import { CompanyClientExtraFieldResponse, SettingResponse } from '../../interfaces/common';
import { Service } from '@interface/model/service';
import strings from '../../lang/Lang';
// import {  } from "../../../../../interfaces/model/treatment";
// import ServerError from '../../partials/Error/ServerError';
// import TinyError from '../../partials/Error/TinyError';
import Autocomplete from '@components/form/Autocomplete';
import Color from '@components/form/Color';
import Label from '@components/form/Label';
import Select from '@components/form/Select';
import TipTapEditor from '@components/TipTap/TipTapEditor';
import { Category } from '@interface/model/category';
import Compact from '@uiw/react-color-compact';
import FormikErrorFocus from '../../partials/FormikErrorFocus/FormikErrorFocus';
import CancelButton from '../../partials/MaterialButton/CancelButton';
import Modal from '../../partials/MaterialModal/Modal';

// import { validateClientStore } from '../../validations';

export interface IServiceValues {
    category_id: number;
    name: string,
    price: string,
    duration: string,
    description: string,
    color: string,
}

export interface ServiceModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedService?: Service,
    categoryData: any
}

const ServiceModal: React.FC<ServiceModalProps> = ({
    openModal, setOpenModal, selectedService, categoryData, mutate
}) => {
    const navigate = useNavigate();
    const [color, setColor] = React.useState("#fff");

    // const settings = settingData?.data ?? [];

    // let viewProfile = findValue(api.registrationPortal.viewProfile);

    // let viewPhone = findValue(api.registrationPortal.viewPhone);
    // let requiredPhone = findValue(api.registrationPortal.requiredPhone);

    // let viewDateOfBirth = findValue(api.registrationPortal.viewDateOfBirth);
    // let requiredDateOfBirth = findValue(api.registrationPortal.requiredDateOfBirth);

    // let viewOccupation = findValue(api.registrationPortal.viewOccupation);
    // let requiredOccupation = findValue(api.registrationPortal.requiredOccupation);

    // let viewStreetAddress = findValue(api.registrationPortal.viewStreetAddress);
    // let requiredStreetAddress = findValue(api.registrationPortal.requiredStreetAddress);

    // let viewCity = findValue(api.registrationPortal.viewCity);
    // let requiredCity = findValue(api.registrationPortal.requiredCity);

    // let viewState = findValue(api.registrationPortal.viewState);
    // let requiredState = findValue(api.registrationPortal.requiredState);

    // let viewCountry = findValue(api.registrationPortal.viewCountry);
    // let requiredCountry = findValue(api.registrationPortal.requiredCountry);

    // let viewZipcode = findValue(api.registrationPortal.viewZipcode);
    // let requiredZipcode = findValue(api.registrationPortal.requiredZipcode);

    // let viewPersonalID = findValue(api.registrationPortal.viewPersonalID);
    // let requiredPersonalID = findValue(api.registrationPortal.requiredPersonalID);


    return (
        <Formik<IServiceValues>
            // initialValues={procedureData?.data ? {
            //     name: `${procedureData.data.name || ''}${hasCopy ? ' - Copy' : ''}`,
            //     date: procedureData.data.date || '',
            //     selectedIndex: 0,
            //     images: !hasCopy ? procedureData.data.files.map((file, index) => {
            //         return {
            //             id: uuidv4(),
            //             image: file.url, // &id=${uuidv4()}
            //             imageData: '',
            //             canvasData: '',
            //             fileId: file.id,
            //             updated: false,
            //         }
            //     }) || imagesData : imagesData,
            //     // notes: procedureData.data.notes || '',
            //     notes_html: `${procedureData.data?.notes_html ? procedureData.data?.notes_html ?? '' : isHTML(procedureData.data?.notes ?? '') ? procedureData.data?.notes : `${(procedureData.data?.notes ?? '')}`.replaceAll('\n', '<br/>')}`,
            //     treatments: procedureData.data.details.map((treatment) => {
            //         return {
            //             actual_cost: parseFloat(treatment.actual_cost),
            //             type: treatment.type,
            //             id: treatment.treatment_id,
            //         }
            //     }) || [],
            //     shape: 'pen',
            //     brushRadius: 2,
            //     text: '1',
            // } : {
            //     name: '',
            //     date: '',
            //     selectedIndex: 0,
            //     images: imagesData,
            //     notes: '',
            //     notes_html: '',
            //     treatments: [],
            //     shape: 'pen',
            //     brushRadius: 2,
            //     text: '1',
            // }}
            initialValues={{
                name: '',
                category_id: 0,
                price: '',
                duration: '',
                description: '',
                color: '',
            }}
            enableReinitialize
            // validate={(v) => validateClientStore(v, settingData?.data ?? [], extraFieldData?.data.filter(field => field.view) ?? [])}

            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {


                const formData = new FormData();

                formData.set('service_name', values.name);
                formData.set('category', values.category_id.toString());
                formData.set('price', values.price);
                formData.set('duration', values.duration);
                formData.set('duration', values.description);
                formData.set('color', color);

                const response = await fetch(!selectedService ? api.serviceCreate : api.serviceUpdate(selectedService.id.toString()), {
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
                    await resetForm();
                    toast.success(data.message);
                    setOpenModal(false);
                    if (!selectedService) {
                        navigate('/clients/' + data?.data?.id);
                    }
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm, handleBlur, handleChange }) => {
                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        loading={isSubmitting}
                        title={!selectedService ? strings.add_service : strings.updated_service}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton disabled={isSubmitting} onClick={handleModelClose}>
                                {strings.Cancel}
                            </CancelButton>
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (!dirty && selectedService) {
                                        toast.success(strings.no_data_changed)
                                        handleModelClose();
                                        return;
                                    }
                                    handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4 space-y-4 ">
                            <div className="grid grid-flow-row md:grid-cols-2 gap-4">
                                <div className="w-full">
                                    <Input
                                        name="name"
                                        placeholder={strings.service}
                                        value={values.name || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={touched?.name && errors.name}
                                        label={strings.service}
                                    />
                                </div>
                                <div>
                                    {categoryData?.data != null ?
                                        <div className="flex gap-2" >
                                            <div className="flex-grow">
                                                <Label label={strings.category} required />
                                                <Autocomplete<Category>
                                                    inputProps={{ label: strings.category, required: true, placeholder: strings.category }}
                                                    value={categoryData?.data?.find((category: { id: number; }) => category.id === values.category_id)}
                                                    displayValue={(option) => option?.name ?? ''}
                                                    filteredValues={(query) => categoryData?.data.filter((category: { name: string; }) => category.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))) ?? []}
                                                    options={categoryData?.data || []}
                                                    renderOption={(category) => `${category.name}`}
                                                    onChange={async (category) => {
                                                        if (!category) return;
                                                        setFieldTouched('category_id')
                                                        setFieldValue('category_id', category.id)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        : <></>}
                                </div>
                            </div>

                            <div className="grid grid-flow-row md:grid-cols-3 gap-4">
                                <div className='w-full'>
                                    <Color
                                        required
                                        value={color}
                                        label={strings.color}
                                    >
                                        <div className="grid grid-flow-row grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 p-4">
                                            <Compact
                                                color={color}
                                                onChange={(color) => {
                                                    setColor(color.hex);
                                                }}
                                            />
                                        </div>
                                    </Color>
                                </div>

                                <div className="w-full">
                                    <Input
                                        type="number"
                                        name="price"
                                        placeholder={strings.price}
                                        value={values.price || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={touched?.price && errors.price}
                                        label={strings.price}
                                    />
                                </div>

                                <div className="w-full">
                                    <Select
                                        displayValue={(val) => val}
                                        onChange={(e) => {
                                            setFieldTouched('duration')
                                            setFieldValue('duration', e)
                                        }}
                                        value={values.duration}
                                        label={strings.duration}
                                        required
                                    >
                                        {/* {category.map((filter) => <Select.Option key={`order_filter_${filter.key}`} value={filter.key}>{filter.text}</Select.Option>)} */}

                                    </Select>
                                </div>
                            </div>


                            <TipTapEditor
                                onChange={async (data) => {
                                    await setFieldValue('description', data)
                                    await setFieldTouched('description');
                                }}
                                label={strings.BRAND}
                                data={values.description ?? values.description ?? ''}
                            // error={touched?.notes && Boolean(errors.notes)}
                            // helperText={touched?.notes ? errors.notes : ''}
                            />
                            {/* <ServerError error={errors?.server} className="mt-4" /> */}
                        </div>
                    </Modal>
                );
            }}
        </Formik >
    );
}

export default ServiceModal;