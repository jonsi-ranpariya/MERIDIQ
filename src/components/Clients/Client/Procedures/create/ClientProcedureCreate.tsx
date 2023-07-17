import Button from '@components/form/Button';
import Heading from "@components/heading/Heading";
import CancelButton from "@partials/MaterialButton/CancelButton";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useSWRImmutable from "swr/immutable";
import { v4 as uuidv4 } from 'uuid';
import api from "../../../../../configs/api";
import { convertBase64ToFile, isDataURL, isHTML } from "../../../../../helper";
import useDebounce from "../../../../../hooks/useDebounce";
import useQuery from "../../../../../hooks/useQuery";
import { ClientResponse, ClientTreatmentResponse } from "../../../../../interfaces/common";
import { TreatmentType } from "../../../../../interfaces/model/treatment";
import strings from "../../../../../lang/Lang";
import FullPageError from "../../../../../partials/Error/FullPageError";
import ServerError from "../../../../../partials/Error/ServerError";
import FormikErrorFocus from "../../../../../partials/FormikErrorFocus/FormikErrorFocus";
import { LinearProgressWithLabel } from "../../../../../partials/Loadings/LinearProgressWithLabel";
import Modal from "../../../../../partials/MaterialModal/Modal";
import RouteLeavingGuard from "../../../../../partials/MaterialModal/RouteLeavingGuard";
import { validateClientTreatmentStore } from "../../../../../validations";
import BackToClientDashboard from "../../sections/BackToClientDashboard";
import ClientProcedureCanvasHandler from "./ClientProcedureCanvasHandler";
import ClientProcedureCreateForm from "./ClientProcedureCreateForm";
import ClientProcedureDrawingBoard from "./ClientProcedureDrawingBoard";

// TODO: handle back press correctly.

export interface ClientProcedureCreateProps {
}

export type CanvasShape = 'circle' | 'cross' | 'pen' | 'filled_circle' | 'gradient_circle' | 'text';

export interface IClientProcedureCreateValues {
    name: string,
    date: string,
    treatments: {
        id: number,
        type: TreatmentType,
        actual_cost: number,
    }[],
    images: {
        id: string,
        image: string,
        imageData: string | Blob,
        canvasData: string,
        fileId?: number,
        updated?: boolean,
    }[],
    deletedIds?: number[],
    selectedIndex: number,
    notes?: string,
    notes_html?: string,
    server?: string,
    progress?: number,
    shape: CanvasShape,
    brushRadius: number,
    text: string,
}

const imagesData = [
    {
        id: uuidv4(),
        image: '',
        imageData: '',
        canvasData: '',
        fileId: undefined,
        updated: undefined,
    }
];

const ClientProcedureCreate: React.FC<ClientProcedureCreateProps> = () => {
    const { clientId, clientProcedureId }: { clientId?: string, clientProcedureId?: string } = useParams();
    const query = useQuery();

    const hasCopy = query.has('copy');

    const { error } = useSWRImmutable<ClientResponse, Error>(api.clientSingle(clientId));

    const { data: procedureData, error: procedureError, isValidating } = useSWRImmutable<ClientTreatmentResponse, Error>(
        !clientProcedureId ? null : api.clientTreatment({ clientId, procedureId: clientProcedureId }),
        {
            revalidateOnMount: true,
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    const procedureLoading = (!procedureData && !procedureError) || isValidating;

    const enableReinitialize = useDebounce(procedureLoading, 300);

    const navigate = useNavigate();
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [isFormSuccess, setIsFormSuccess] = useState(false);

    useEffect(() => {
        if (isFormSuccess) {
            navigate(-1);
        };
        // eslint-disable-next-line
    }, [isFormSuccess]);

    if (error) {
        return <FullPageError code={error?.status || 500} message={error?.message || 'server error'} />
    }

    if (clientProcedureId && procedureError) {
        return <FullPageError code={procedureError?.status || 500} message={procedureError?.message || 'server error'} />
    }

    return (
        <div className="mb-8">
            <Helmet>
                <link rel="stylesheet" href={`${process.env.PUBLIC_URL || ''}/css/procedure.css`} />
            </Helmet>
            <BackToClientDashboard />
            <div className="mb-4"><Heading text={strings.CreateProcedure} variant="bigTitle" /></div>
            <Formik<IClientProcedureCreateValues>
                initialValues={procedureData?.data ? {
                    name: `${procedureData.data.name || ''}${hasCopy ? ' - Copy' : ''}`,
                    date: procedureData.data.date || '',
                    selectedIndex: 0,
                    images: !hasCopy ? procedureData.data.files.map((file, index) => {
                        return {
                            id: uuidv4(),
                            image: file.url, // &id=${uuidv4()}
                            imageData: '',
                            canvasData: '',
                            fileId: file.id,
                            updated: false,
                        }
                    }) || imagesData : imagesData,
                    // notes: procedureData.data.notes || '',
                    notes_html: `${procedureData.data?.notes_html ? procedureData.data?.notes_html ?? '' : isHTML(procedureData.data?.notes ?? '') ? procedureData.data?.notes : `${(procedureData.data?.notes ?? '')}`.replaceAll('\n', '<br/>')}`,
                    treatments: procedureData.data.details.map((treatment) => {
                        return {
                            actual_cost: parseFloat(treatment.actual_cost),
                            type: treatment.type,
                            id: treatment.treatment_id,
                        }
                    }) || [],
                    shape: 'pen',
                    brushRadius: 2,
                    text: '1',
                } : {
                    name: '',
                    date: '',
                    selectedIndex: 0,
                    images: imagesData,
                    notes: '',
                    notes_html: '',
                    treatments: [],
                    shape: 'pen',
                    brushRadius: 2,
                    text: '1',
                }}
                enableReinitialize={enableReinitialize}
                validate={validateClientTreatmentStore}
                onSubmit={(values, { resetForm, setFieldError, setSubmitting, setFieldValue }) => {
                    const formData = new FormData();
                    if (values.notes_html) {
                        formData.append('notes_html', values.notes_html ?? '');
                    } else {
                        formData.append('notes', values.notes ?? '');
                    }
                    formData.append('date', values?.date ? values?.date : '');
                    formData.append('name', values?.name ? values?.name : '');
                    formData.append('description', values?.notes ? values?.notes : '');
                    formData.append('client_id', clientId!);
                    formData.append('color', '#0066ff');
                    for (let index = 0; index < values.treatments.length; index++) {
                        formData.append(`treatments[${index}][id]`, values.treatments[index].id.toString());
                        if (values.treatments[index].actual_cost) {
                            formData.append(`treatments[${index}][actual_cost]`, values.treatments[index].actual_cost.toString());
                        }
                    }

                    if (clientProcedureId && !hasCopy) {
                        for (let index = 0; index < values.images.length; index++) {
                            if (values.images[index]?.updated && values.images[index]?.imageData instanceof Blob) {
                                formData.append(`images[${index}]`, values.images[index].imageData);
                                formData.append(`files[${index}]`, values.images[index]?.fileId ? values.images[index]?.fileId?.toString() as string : '-1');
                            } else if (values.images[index]?.updated && typeof values.images[index].imageData == 'string' && isDataURL(values.images[index].imageData as string)) {
                                formData.append(`images[${index}]`, convertBase64ToFile(values.images[index].imageData as string));
                                formData.append(`files[${index}]`, values.images[index]?.fileId ? values.images[index]?.fileId?.toString() as string : '-1');
                            }
                        }

                    } else {
                        for (let index = 0; index < values.images.length; index++) {
                            if (values.images[index]?.imageData instanceof Blob) {
                                formData.append(`images[]`, values.images[index].imageData);
                            } else if (values.images[index].imageData && isDataURL(values.images[index].imageData as string)) {
                                formData.append(`images[]`, convertBase64ToFile(values.images[index].imageData as string));
                            }
                        }
                    }

                    const request = new XMLHttpRequest();

                    if (clientProcedureId && !hasCopy) {
                        request.open(
                            'POST',
                            api.clientProcedureUpdateMobile.replace(':id', clientProcedureId),
                        );
                    } else {
                        request.open('POST', api.clientProcedureStore.replace(':id', clientId!));
                    }
                    request.setRequestHeader('Accept', 'application/json');
                    request.setRequestHeader('X-App-Locale', strings.getLanguage());

                    request.upload.onprogress = (e) => {
                        setFieldValue('progress', Math.round((e.loaded / e.total) * 100));
                    };
                    request.withCredentials = true;
                    request.onload = async () => {
                        const data = JSON.parse(request.response);

                        if (request.status === 401) {
                            await setFieldError('server', data.message || 'server error, please contact admin');
                        }

                        if (request.status === 426) {
                            setShowUpgrade(true);
                            return;
                        }
                        if (data.status === '1') {
                            if (clientProcedureId && values?.deletedIds && values.deletedIds.length) {
                                const response = await fetch(api.clientProcedureDeleteMobile.replace(':id', clientProcedureId), {
                                    method: 'POST',
                                    headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                        'X-App-Locale': strings.getLanguage(),
                                    },
                                    credentials: 'include',
                                    body: JSON.stringify({ files: values?.deletedIds }),
                                })
                                const data = await response.json();
                                if (data.status !== '1') {
                                    await setFieldError('server', data.message || 'server error, please contact admin');

                                    return;
                                }
                            }

                            toast.success(strings.client_treatment_saved_success);

                            setSubmitting(false);
                            setIsFormSuccess(true);
                        } else {
                            setSubmitting(false);
                            await setFieldError('server', data.message || 'server error, please contact admin');
                        }
                    };

                    request.send(formData);
                }}
            >
                {({ errors, values, dirty, handleSubmit, isSubmitting, isValidating }) => (
                    <>
                        <RouteLeavingGuard
                            when={dirty && !showUpgrade && !isFormSuccess}
                            navigate={(location) => navigate(location.pathname)}
                            shouldBlockNavigation={() => (dirty && !showUpgrade && !isFormSuccess)}
                            handleSave={() => handleSubmit()}
                        />
                        <Modal
                            open={showUpgrade}
                            title={`${strings.Oops}!`}
                            handleClose={() => {
                                setShowUpgrade(false);
                            }}
                            submitButton={
                                <Button onClick={() => navigate('/upgrade-plan')}>
                                    {strings.UpgradePlan}
                                </Button>
                            }
                        >
                            <div className="p-4">
                                <h4 className="text-xl font-semibold">{strings.it_seems_plans_limit_reached}</h4>
                                <p>{strings.Click_below_button_to_upgrade_your_plan}</p>
                            </div>
                        </Modal>
                        {
                            isSubmitting &&
                            <Modal
                                open={isSubmitting}
                                title={strings.Please_wait_while_we_save_your_record}
                                hideCloseButton
                            >
                                <div className="p-4 break-normal">
                                    <LinearProgressWithLabel value={values.progress || 0} />
                                </div>
                            </Modal>
                        }
                        <FormikErrorFocus />
                        <ClientProcedureCanvasHandler>
                            {({ addPage, changePage, deletePage, clear, undo, canvasRef, onDrawingChange, onChange, onShapeChange }) => (
                                <>
                                    <div className="grid grid-flow-row grid-cols-1 gap-4 xl:grid-cols-3">
                                        <div className="">
                                            <ClientProcedureCreateForm />
                                        </div>

                                        <ClientProcedureDrawingBoard
                                            onAddPage={addPage}
                                            onChangePage={changePage}
                                            onDeletePage={deletePage}
                                            onClear={clear}
                                            onUndo={undo}
                                            onChange={onChange}
                                            ref={canvasRef}
                                            onCircle={() => onShapeChange('circle')}
                                            onPen={() => onShapeChange('pen')}
                                            onPenFat={() => onShapeChange('pen', 4)}
                                            onCross={() => onShapeChange('cross')}
                                            onCrossFat={() => onShapeChange('cross', 4)}
                                            onFilledCircle={() => onShapeChange('filled_circle')}
                                            onGradientCircle={() => onShapeChange('gradient_circle')}
                                            onText={(text) => onShapeChange('text', 2, text ?? '1')}
                                        />

                                    </div>
                                    <ServerError className="xl:col-span-2 mt-4" error={errors?.server} />
                                    <div className="flex justify-end space-x-4 mt-6">
                                        <CancelButton
                                            onClick={async () => {
                                                await onDrawingChange();
                                                navigate(-1);
                                            }}
                                            disabled={isSubmitting || isValidating}
                                            children={strings.Cancel}
                                        />
                                        <Button
                                            onClick={async () => {
                                                await onDrawingChange();
                                                await handleSubmit();
                                            }}
                                            type="submit"
                                            loading={isSubmitting || isValidating}
                                        >
                                            {strings.Submit}
                                        </Button>

                                    </div>
                                </>
                            )}
                        </ClientProcedureCanvasHandler>
                    </>
                )}
            </Formik>
        </div>
    );
}

export default ClientProcedureCreate;