import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { generateClientFullName } from '../../helper';
import { Client } from '../../interfaces/model/client';
import strings from '../../lang/Lang';
import PowerIcon from '../../partials/Icons/Power';
import Button from '@components/form/Button';
import DeleteModal from '../../partials/MaterialModal/DeleteModal';

export interface ClientRestoreModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedClient?: Client,
    mutate: () => Promise<any>,
}

const ClientRestoreModal: React.FC<ClientRestoreModalProps> = ({ open = false, handleClose = () => {}, selectedClient, mutate }) => {
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
                    <PowerIcon slash={!selectedClient?.deleted_at} />
                    <p className="text-base font-bold mt-2">{`${strings.RESTORE_CLIENT_1} ${generateClientFullName(selectedClient)}?`}</p>
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
                        const response = await fetch(`${api.clientRestore.replace(':id', selectedClient?.id.toString() || '')}`, {
                            method: 'GET',
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
                            await mutate();
                            toast.success(data.message);
                            handleClose();
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

export default ClientRestoreModal;