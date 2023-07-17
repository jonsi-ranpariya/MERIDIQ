import Button from '@components/form/Button';
import IconButton from '@components/form/IconButton';
import Input from '@components/form/Input';
import TipTapEditor from '@components/TipTap/TipTapEditor';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../../configs/api';
import { makeXMLRequest } from '../../../../helper';
import { File as ModelFile } from '../../../../interfaces/model/File';
import { GeneralNote } from '../../../../interfaces/model/generalNote';
import strings from '../../../../lang/Lang';
import ServerError from '../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../partials/FormikErrorFocus/FormikErrorFocus';
import DeleteIcon from '../../../../partials/Icons/Delete';
import CancelButton from '../../../../partials/MaterialButton/CancelButton';
import File from '../../../../partials/MaterialFile/File';
import Modal from '../../../../partials/MaterialModal/Modal';
import ViewModalTextItem from '../../../../partials/ViewModal/ViewModalTextItem';
import { validateClientGeneralNotes } from '../../../../validations';
import ClientGeneralNoteFileDeleteModal from './ClientGeneralNoteFileDeleteModal';

export interface ClientGeneralNotesModalProps {
    selectedGeneralNote?: GeneralNote,
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
}

export interface IClientGeneralNotesValues {
    title: string,
    notes: string,
    notes_html?: string,
    important: boolean,
    file: File | undefined,
    files: File[] | Blob[] | undefined,
    filename?: string,
    filenames?: string[],
    server?: string,
}

const ClientGeneralNoteModal: React.FC<ClientGeneralNotesModalProps> = ({
    selectedGeneralNote,
    openModal,
    setOpenModal,
    mutate = async () => {},
}) => {
    const navigate = useNavigate();
    const { clientId }: { clientId?: string } = useParams();
    const [selectedFile, setSelectedFile] = React.useState<ModelFile>();
    const [selectedIndex, setSelectedIndex] = React.useState<number>();
    const [fileDeleteOpen, setFileDeleteOpen] = React.useState(false);

    return (
        <Formik<IClientGeneralNotesValues>
            initialValues={!selectedGeneralNote ? {
                title: '',
                important: false,
                notes: '',
                notes_html: '',
                file: undefined,
                files: undefined
            } : {
                title: selectedGeneralNote.title,
                important: selectedGeneralNote.important,
                notes: selectedGeneralNote.notes,
                notes_html: selectedGeneralNote.notes_html,
                filename: selectedGeneralNote.filename,
                filenames: selectedGeneralNote.filenames,
                file: undefined,
                files: undefined
            }}
            enableReinitialize
            validate={validateClientGeneralNotes}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldValue, setFieldError }) => {

                const formData = new FormData();
                formData.append('title', values.title);
                formData.append('important', values.important ? '1' : '0');
                if (values.notes_html) {
                    formData.append('notes_html', values.notes_html);
                } else if (values.notes) {
                    formData.append('notes', values.notes);
                }

                if (values.files?.length) {
                    for (let i = 0; i < values.files.length; i++) {
                        formData.set(`files[${i}]`, values.files[i] as Blob);
                    }
                }

                const apiUrl = !selectedGeneralNote ? api.generalNoteStore.replace(':id', clientId!) : api.generalNoteUpdate.replace(':generalNoteId', selectedGeneralNote.id.toString());
                const response = await makeXMLRequest(
                    'POST',
                    apiUrl,
                    formData,
                    (e) => {},
                );

                const data = await JSON.parse(response.response);

                if (response.status === 401) {
                    navigate('/');
                }

                if (data.status === '1') {
                    await mutate();
                    await resetForm();
                    toast.success(data.message);
                    setOpenModal(false);
                } else {
                    // setFieldValue('files', undefined)
                    // const inp = document.getElementById('general_note_file_input') as HTMLInputElement
                    // inp.value = ''
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
                        title={!selectedGeneralNote ? strings.NewNote : strings.UpdateNote}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton
                                fullWidth
                                disabled={isSubmitting}
                                onClick={handleModelClose}
                                children={strings.Cancel}
                            />
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (!dirty && selectedGeneralNote) {
                                        toast.success(strings.no_data_changed)
                                        handleModelClose();
                                        return;
                                    }
                                    if (handleSubmit) return handleSubmit();
                                }}
                                children={strings.Submit}
                            />
                        }
                    >
                        <FormikErrorFocus />
                        <ClientGeneralNoteFileDeleteModal
                            open={fileDeleteOpen}
                            handleClose={() => { setFileDeleteOpen(false); setSelectedFile(undefined); }}
                            selectedFile={selectedFile}
                            selectedNote={selectedGeneralNote}
                            selectedIndex={selectedIndex}
                            onSuccess={async (note) => {
                                await mutate();
                                if (selectedGeneralNote) {
                                    selectedGeneralNote = note;
                                }
                                setSelectedIndex(undefined);
                                setSelectedFile(undefined);
                                setFileDeleteOpen(false);
                            }}
                        />
                        <div className="p-4">
                            <div className="grid grid-flow-row gap-4 mb-2 w-full place-items-stretch">
                                <Input
                                    name="first_name"
                                    type="text"
                                    value={values.title}
                                    onChange={(e) => {
                                        setFieldTouched('title')
                                        setFieldValue('title', e.target.value)
                                    }}
                                    error={touched?.title && errors.title && errors.title}
                                    label={strings.TITLE}
                                    placeholder={strings.TITLE}
                                    required
                                />

                                <div className="mb-2 w-full">
                                    <TipTapEditor
                                        onChange={(data) => {
                                            setFieldTouched('notes_html');
                                            setFieldValue('notes_html', data)
                                        }}
                                        data={`${values.notes_html ? values.notes_html : (values.notes ?? '')}`}
                                        error={touched?.notes_html && Boolean(errors.notes_html)}
                                        helperText={touched?.notes_html ? errors.notes_html : ''}
                                    />
                                </div>

                                <span className="w-full">
                                    {
                                        selectedGeneralNote?.files?.length ?
                                            <div className="mb-4">
                                                <p className="text-primary font-semibold uppercase">{strings.file}</p>
                                                {selectedGeneralNote.files.map((fl, index) => {
                                                    const name = selectedGeneralNote?.filenames?.length
                                                        ? selectedGeneralNote.filenames[index]
                                                        : selectedGeneralNote?.filename
                                                            ? selectedGeneralNote.filename
                                                            : '-'
                                                    return <div className={`flex items-center py-0.5 dark:border-gray-700 ${index !== 0 && 'border-t'}`}>
                                                        <p className="break-all flex-grow" style={{ whiteSpace: 'pre-wrap' }}>{name}</p>
                                                        <IconButton
                                                            onClick={() => {
                                                                if (!(selectedGeneralNote?.files?.length && selectedGeneralNote?.files[index])) return;
                                                                setSelectedFile(selectedGeneralNote.files[index])
                                                                setFileDeleteOpen(true);
                                                                setSelectedIndex(index);
                                                            }}
                                                            children={<DeleteIcon />}
                                                        />
                                                    </div>
                                                })}
                                            </div>
                                            : <ViewModalTextItem title={strings.file} value={values?.filename} />
                                    }
                                    <File
                                        onChange={async (e) => {
                                            const eFiles = e.target.files;
                                            if (!eFiles?.length) return;
                                            let fileLimit = 5;
                                            if (selectedGeneralNote?.files?.length) {
                                                fileLimit -= selectedGeneralNote.files.length;
                                            }
                                            if (eFiles?.length > fileLimit) {
                                                alert(strings.notesFiles_max_select.replace(':limit', `${fileLimit}`));
                                                e.target.value = "";
                                                return;
                                            }
                                            setFieldTouched('files')
                                            setFieldValue('files', eFiles)
                                        }}
                                        multiple
                                        id='general_note_file_input'
                                        name="file"
                                        error={touched?.file && Boolean(errors.file)}
                                        helperText={touched?.file && errors.file}
                                    />
                                </span>

                                <ServerError error={errors?.server} className="mt-4" />
                            </div>
                        </div>
                    </Modal >
                );
            }}
        </Formik>

    );
}

export default ClientGeneralNoteModal;