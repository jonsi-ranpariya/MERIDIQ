import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../../configs/api';
import { File } from '../../../../interfaces/model/File';
import { GeneralNote } from '../../../../interfaces/model/generalNote';
import strings from '../../../../lang/Lang';
import DeleteIcon from '../../../../partials/Icons/Delete';
import Button from '@components/form/Button';
import DeleteModal from '../../../../partials/MaterialModal/DeleteModal';

export interface ClientGeneralNoteFileDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedFile?: File,
    selectedNote?: GeneralNote,
    selectedIndex?: number,
    onSuccess: (note: GeneralNote) => Promise<any>,
}

const ClientGeneralNoteFileDeleteModal: React.FC<ClientGeneralNoteFileDeleteModalProps> = ({
    open = false,
    handleClose = () => {},
    onSuccess,
    selectedFile,
    selectedNote,
    selectedIndex,
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();

    return (
        <DeleteModal
            open={open}
            handleClose={() => {
                if (isSubmitting) return;
                handleClose()
            }}
            icon={
                <div className="flex flex-col items-center">
                    <DeleteIcon className="mb-2" />
                    <p className="text-base font-bold mt-2 break-normal">{`${strings.client_media_are_you_sure}?`}</p>
                </div>
            }
            text={``}
            submitButton={
                <Button
                    fullWidth
                    className=""
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                    onClick={async () => {
                        if (!selectedNote?.id || !selectedFile?.id || selectedIndex === undefined) return;
                        setIsSubmitting(true);
                        const apiUrl = api.generalNoteFileDelete(selectedNote.id, selectedFile.id, selectedIndex)
                        const response = await fetch(apiUrl, {
                            method: 'DELETE',
                            headers: {
                                "Accept": 'application/json',
                                'X-App-Locale': strings.getLanguage(),
                                'Content-Type': 'application/json',
                            },
                            credentials: "include",
                        })

                        const data = await response.json();

                        if (response.status === 401) {
                            navigate('/');
                        }

                        if (data.status === '1') {
                            await onSuccess(data.data);
                            toast.success(data.message);
                        } else {
                            toast.error(data.message || 'server error, please contact admin.');
                        }
                        setIsSubmitting(false);

                        handleClose();
                    }}
                >{strings.Submit}
                </Button>
            }
        />
    );
}

export default ClientGeneralNoteFileDeleteModal;