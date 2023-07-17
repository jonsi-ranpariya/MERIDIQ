import Avatar from '@components/avatar/Avatar';
import IconButton from '@components/form/IconButton';
import useAuth from '@hooks/useAuth';
import ClientAccessIcon from '@icons/ClientAccess';
import LoadingIcon from '@icons/Loading';
import LogIcon from '@icons/Log';
import EditIcon from '@partials/Icons/Edit';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import Checkbox from '@partials/MaterialCheckbox/MaterialCheckbox';
import * as React from 'react';
import api from '../../configs/api';
import { aDownload, generateClientFullName, timeZone } from '../../helper';
import { Client } from '../../interfaces/model/client';
import strings from '../../lang/Lang';
import DownloadIcon from '../../partials/Icons/Download';
import PowerIcon from '../../partials/Icons/Power';
const ClientDownloadPopup = React.lazy(() => import('./ClientDownloadPopup'))

async function download(client: Client) {
    const response = await fetch(api.clientDownload(client.id), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-App-Locale': strings.getLanguage(),
            'X-Time-Zone': timeZone(),
        },
        credentials: 'include',
    });

    const data = await response.blob()
    await aDownload(clientZIPFilename(client), window.URL.createObjectURL(data))
}

const clientZIPFilename = (client: Client) => `${client.first_name}_${client.last_name}.zip`.replaceAll(" ", "_");

export interface ClientListItemProps {
    client: Client,
    onEditClick?: (data: Client) => void,
    onClientAccessClick?: (data: Client) => void,
    onDeleteClick?: (data: Client) => void,
    onRestoreClick?: (data: Client) => void,
    onListClick?: (data: Client) => void,
    onClientMergeClick?: (data: Client) => void,
    merge?: boolean,
    clientLiistId?: number[]
}

const ClientListItem: React.FC<ClientListItemProps> = ({
    client,
    onEditClick = () => {},
    onClientAccessClick = () => {},
    onDeleteClick = () => {},
    onRestoreClick = () => {},
    onListClick = () => {},
    onClientMergeClick = () => {},
    merge,
    clientLiistId
}) => {

    const [downloading, setDownloading] = React.useState(false);
    const [downaloadModalOpen, setDownaloadModalOpen] = React.useState(false)
    const onDownloadClick = async (client: Client) => {
        setDownaloadModalOpen(true);
        if (downloading) return;
        setDownloading(true);
        await download(client);
        setDownloading(false);
    }

    const { user } = useAuth()
    const isAdmin = user?.user_role === api.adminRole;

    const editClick = () => onEditClick(client)
    const listClick = () => onListClick(client)
    const clientAccessClick = () => onClientAccessClick(client)

    const deleteClick = () => {
        if (client.deleted_at) {
            onRestoreClick(client);
        } else {
            onDeleteClick(client);
        }
    }

    return (
        <>
            <ModalSuspense>
                {
                    downaloadModalOpen &&
                    <ClientDownloadPopup
                        openModal={downaloadModalOpen}
                        setOpenModal={setDownaloadModalOpen}
                    />
                }
            </ModalSuspense>
            <tr className="md:hidden">
                {mobileListItem()}
            </tr>
            <tr className="hidden md:table-row">
                {desktopListItem()}
            </tr>
        </>
    );

    function desktopListItem() {
        return (<>
            <td className='cursor-pointer py-2 flex items-center space-x-2' >
                {merge &&
                    <Checkbox
                        label=''
                        checked={clientLiistId?.includes(client.id)}
                        onChange={() => onClientMergeClick(client)}
                    />
                }
                <div className={`flex items-center space-x-2 ${client.deleted_at ? "text-mediumGray" : ""}`} onClick={editClick}>
                    <Avatar
                        className={`h-12 w-12 ${client.deleted_at ? "opacity-30 dark:opacity-70" : ''}`}
                        src={client?.profile_picture ? api.storageUrl(client?.profile_picture) : undefined}
                        alt={`${generateClientFullName(client)}`}
                    />
                    <p className="font-medium text-left mr-2">{generateClientFullName(client)}</p>
                </div>
            </td>
            <td><p className={`${client.deleted_at ? "text-mediumGray" : ""}`}>{client.email}</p></td>
            <td><p className={`${client.deleted_at ? "text-mediumGray" : ""}`}>{client.social_security_number ? client.social_security_number : ''}</p></td>
            <td>
                <div className="flex justify-end pr-4 text-primary space-x-0.5">
                    {isAdmin &&
                        <IconButton onClick={clientAccessClick}>
                            <ClientAccessIcon />
                        </IconButton>
                    }
                    <IconButton onClick={listClick}>
                        <LogIcon />
                    </IconButton>
                    <IconButton className="" onClick={deleteClick}>
                        <PowerIcon slash={!client.deleted_at} />
                    </IconButton>
                    <IconButton onClick={() => onDownloadClick(client)}>
                        {downloading ? <LoadingIcon /> : <DownloadIcon />}
                    </IconButton>
                </div>
            </td>
        </>)
    }

    function mobileListItem() {
        return (
            <td className=''>
                <div className="flex py-2 items-start space-x-3">
                    {merge &&
                        <div className='pt-4'>
                            <Checkbox
                                checked={clientLiistId?.includes(client.id)}
                                label=''
                                onChange={() => onClientMergeClick(client)}
                            />
                        </div>
                    }
                    <Avatar
                        className={`h-14 w-14 ${client.deleted_at ? "opacity-30" : ''}`}
                        src={client?.profile_picture ? api.storageUrl(client?.profile_picture) : undefined}
                        alt={`${generateClientFullName(client)} ${strings.ProfilePicture}`}
                        onClick={editClick}
                    />
                    <div className="space-y-1">
                        <p className={`font-medium text-left mr-2 ${client.deleted_at ? "text-mediumGray" : ""} `} onClick={editClick}>{generateClientFullName(client)}</p>
                        <p className={`text-sm break-all dark:text-gray-400 ${client.deleted_at ? "text-mediumGray" : ""}`}>{client.email}</p>
                        <p className={`text-sm dark:text-gray-400 ${client.deleted_at ? "text-mediumGray" : ""}`}>{client.social_security_number ? client.social_security_number : ''}</p>
                        <div className="flex text-primary space-x-0.5">
                            <IconButton onClick={editClick}>
                                <EditIcon />
                            </IconButton>
                            {isAdmin &&
                                <IconButton onClick={clientAccessClick}>
                                    <ClientAccessIcon />
                                </IconButton>
                            }
                            <IconButton onClick={listClick}>
                                <LogIcon />
                            </IconButton>
                            <IconButton className="" onClick={deleteClick}>
                                <PowerIcon slash={!client.deleted_at} />
                            </IconButton>
                            <IconButton onClick={() => onDownloadClick(client)}>
                                {downloading ? <LoadingIcon /> : <DownloadIcon />}
                            </IconButton>
                        </div>
                    </div>
                </div>
            </td>
        )
    }
}

export default ClientListItem;