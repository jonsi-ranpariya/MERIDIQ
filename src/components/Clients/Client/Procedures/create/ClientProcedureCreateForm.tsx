import CalendarSelect from '@components/Calendar/Custom/CalendarSelect';
import Autocomplete from '@components/form/Autocomplete';
import Button from '@components/form/Button';
import IconButton from '@components/form/IconButton';
import Input from '@components/form/Input';
import TipTapEditor from '@components/TipTap/TipTapEditor';
import { Treatment } from '@interface/model/treatment';
import { FastField, getIn, useFormikContext } from "formik";
import React from "react";
import { useParams } from 'react-router';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import api from '../../../../../configs/api';
import { getUnitKeyToValue, isHTML } from '../../../../../helper';
import useAuth from '../../../../../hooks/useAuth';
import { ClientTreatmentResponse, TreatmentsResponse } from '../../../../../interfaces/common';
import strings from "../../../../../lang/Lang";
import DeleteIcon from '../../../../../partials/Icons/Delete';
import { IClientProcedureCreateValues } from "./ClientProcedureCreate";
import ClientProcedureTreatmentTextModel from './ClientProcedureTreatmentTextModal';

export interface ClientProcedureCreateFormProps {}

const ClientProcedureCreateForm: React.FC<ClientProcedureCreateFormProps> = () => {

    const { user } = useAuth();
    const { clientId, clientProcedureId }: { clientId?: string, clientProcedureId?: string } = useParams();
    const [openTreatmentTextModel, setOpenTreatmentTextModel] = React.useState(false);

    const { data: procedureData, error: procedureError, isValidating } = useSWRImmutable<ClientTreatmentResponse, Error>(
        () => {
            if (!clientProcedureId) return null
            return api.clientTreatment({ clientId, procedureId: clientProcedureId })
        }, {
        revalidateOnMount: true,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    );

    const {
        errors,
        values,
        touched,
        setFieldValue,
        setFieldTouched,
        handleChange,
        handleBlur,
    } = useFormikContext<IClientProcedureCreateValues>();
    const { data: treatmentsData } = useSWR<TreatmentsResponse, Error>(api.treatment)

    const isLoading = !clientProcedureId ? false : ((!procedureData?.data && !procedureError) || isValidating);

    return (
        <>
            <ClientProcedureTreatmentTextModel
                onClose={async (treatment) => {
                    setOpenTreatmentTextModel(false);
                    if (!treatment) return;
                    await setFieldValue(`notes_html`, `${values.notes_html ? `${values.notes_html}` : ''}\n${treatment.notes || ''}`.trim())

                    setFieldTouched(`notes_html`);

                }}
                openModal={openTreatmentTextModel}
                treatments={treatmentsData?.data?.filter((t) => t.type === 'text') ?? []}
            />
            <div className="space-y-6">
                <FastField name="name">
                    {() => (
                        <Input
                            name="name"
                            type="text"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched?.name && errors.name}
                            label={strings.PROCEDURE_TITLE}
                            className="m-0"
                        />
                    )}
                </FastField>
                <CalendarSelect
                    selectedDate={values.date}
                    onChange={(date) => setFieldValue('date', date || undefined)}
                    inputProps={{
                        label: strings.DATE_OF_PROCEDURE,
                        placeholder: strings.Date,
                    }}
                />
                {treatmentsData?.data != null ? values?.treatments?.map((selectedTreatment, treatmentIndex) => (
                    <div className="flex gap-2" key={treatmentIndex}>
                        <div className="flex-grow">
                            <Autocomplete<Treatment>
                                inputProps={{ label: strings.Treatment, required: true, placeholder: strings.Template, className: '!bg-white dark:!bg-dimGray' }}
                                value={treatmentsData?.data?.find(treatment => treatment.id === selectedTreatment.id)}
                                displayValue={(option) => option?.name ?? ''}
                                filteredValues={(query) => treatmentsData?.data.filter((country) => country.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))) ?? []}
                                options={treatmentsData?.data.filter(tr => tr.type === selectedTreatment.type) || []}
                                renderOption={(treatment) => `${treatment.name}${treatment.type === 'treatment' ? `  (${getUnitKeyToValue(user?.company?.unit || '')} ${treatment.cost})` : ''}`}
                                error={getIn(touched, `treatments.${treatmentIndex}.id`) && getIn(errors, `treatments.${treatmentIndex}.id`)}
                                onChange={async (treatment) => {
                                    if (!treatment) return;
                                    if (treatment.id === selectedTreatment.id) return;
                                    await setFieldValue(`treatments.${treatmentIndex}.id`, treatment.id);
                                    if (treatment.type === 'treatment') {
                                        await setFieldValue(`treatments.${treatmentIndex}.actual_cost`, treatment.cost)
                                    }
                                    const notes = !treatment.notes ? '' : isHTML(treatment.notes) ? treatment.notes : treatment.notes?.replaceAll('\n', '<br/>');
                                    await setFieldValue(`notes_html`, `${values.notes_html?.trim().length ? `${values.notes_html}` : ''}\n${notes}`.trim())

                                    setFieldTouched(`treatments.${treatmentIndex}.id`);
                                    setFieldTouched(`treatments.${treatmentIndex}.actual_cost`);
                                    setFieldTouched(`notes_html`);
                                }}
                            />
                        </div>
                        {
                            selectedTreatment.type === 'treatment' &&
                            <div className="w-4/12">
                                <FastField name={`treatments.${treatmentIndex}.actual_cost`}>
                                    {() => (
                                        <Input
                                            placeholder={strings.COST}
                                            className=""
                                            type="number"
                                            name={`treatments.${treatmentIndex}.actual_cost`}
                                            value={selectedTreatment.actual_cost}
                                            onChange={async (e) => {
                                                await setFieldValue(`treatments.${treatmentIndex}.actual_cost`, e.target.value)
                                                setFieldTouched(`treatments.${treatmentIndex}.actual_cost`);
                                            }}
                                            error={getIn(touched, `treatments.${treatmentIndex}.actual_cost`) && getIn(errors, `treatments.${treatmentIndex}.actual_cost`)}
                                        />
                                    )}
                                </FastField>
                            </div>
                        }
                        <div className="mt-1">
                            <IconButton
                                onClick={() => {
                                    setFieldValue('treatments', (values.treatments || []).filter((data, index) => {
                                        if (index === treatmentIndex) {
                                            return false;
                                        }
                                        return true;
                                    }));
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>
                )) : <></>}
                <div className="flex gap-2 flex-wrap">
                    <Button
                        size="small"
                        variant="ghost"
                        onClick={() => {
                            setFieldValue('treatments', [
                                ...(values?.treatments || []),
                                {
                                    id: '',
                                    type: 'treatment',
                                    actual_cost: '',
                                },
                            ]);
                        }}
                    >
                        {strings.add_treatment_template}
                    </Button>
                    <Button size="small" variant="ghost" onClick={() => setOpenTreatmentTextModel(true)}>
                        {strings.add_text_template}
                    </Button>
                </div>
                <p className="font-semibold">{
                    `${strings.total_cost}: ${getUnitKeyToValue(user?.company?.unit || '')} ${values?.treatments?.length ? values?.treatments?.reduce((count, treatment) => count + parseFloat((treatment.actual_cost ?? '').toString() || '0'), 0) || 0 : 0}`
                }</p>
                <div className="mb-2">
                    <TipTapEditor
                        loading={isLoading}
                        onChange={async (data) => {
                            await setFieldValue('notes_html', data)
                            await setFieldTouched('notes_html');
                        }}
                        data={values.notes_html ?? values.notes ?? ''}
                        error={touched?.notes_html && Boolean(errors.notes_html)}
                        helperText={touched?.notes_html ? errors.notes_html : ''}
                    />
                </div>
            </div>
        </>
    );
}

export default ClientProcedureCreateForm;