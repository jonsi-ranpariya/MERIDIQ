import * as React from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../../configs/api';
import { File } from '../../../../interfaces/model/File';
import strings from '../../../../lang/Lang';
import DeleteIcon from '../../../../partials/Icons/Delete';
import Button from '@components/form/Button';
import DeleteModal from '../../../../partials/MaterialModal/DeleteModal';

export interface ClientMediaDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedFile?: File,
    onSuccess: () => Promise<any>,
}

const ClientMediaDeleteModal: React.FC<ClientMediaDeleteModalProps> = ({
    open = false,
    handleClose = () => {},
    onSuccess,
    selectedFile,
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();
    const { clientId }: { clientId?: string } = useParams();

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
                        setIsSubmitting(true);
                        const response = await fetch(`${api.clientMediaDelete.replace(':id', clientId || '').replace(':fileId', selectedFile?.id.toString() || '')}`, {
                            method: 'DELETE',
                            headers: {
                                "Accept": 'application/json',
                                'X-CSRF-TOKEN': 'test',
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
                            await onSuccess();
                            toast.success(data.message);
                        } else {
                            toast.error(data.message || 'server error, please contact admin.');
                        }
                        setIsSubmitting(false);

                        handleClose();
                        // if (handleSubmit) return handleSubmit();
                    }}
                >{strings.Submit}
                </Button>
            }
        />
    );
}

export default ClientMediaDeleteModal;