import Avatar from '@components/avatar/Avatar';
import IconButton from '@components/form/IconButton';
import * as React from 'react';
import { generateClientFullName } from '../../../../helper';
import { Client } from '../../../../interfaces/model/client';
import strings from '../../../../lang/Lang';
import ListIcon from '../../../../partials/Icons/List';

export interface ClientListItemProps {
    client: Client,
    onListClick?: (data: Client) => void,
}

const CompanyClientListItem: React.FC<ClientListItemProps> = ({
    client,
    onListClick = () => {},
}) => {
    return (
        <tr className="break-all">
            <td className="py-2 min-w-full">
                <div className="flex items-center space-x-2">
                    <Avatar
                        className='h-16 w-16'
                        src={client?.profile_picture ? `${process.env.REACT_APP_STORAGE_PATH}/${client?.profile_picture}` : undefined}
                        alt={`${generateClientFullName(client)} ${strings.ProfilePicture}`}
                    />
                    <p className="font-medium text-left mr-2">{generateClientFullName(client)}</p>
                </div>
            </td>
            <td>{client.email}</td>
            <td>
                <IconButton onClick={() => { onListClick(client); }}>
                    <ListIcon />
                </IconButton>
            </td>
        </tr>
    );
}

export default CompanyClientListItem;