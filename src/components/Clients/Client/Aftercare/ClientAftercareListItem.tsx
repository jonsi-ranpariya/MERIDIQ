import * as React from 'react';
import { formatDate, generateUserFullName } from '../../../../helper';
import { Log } from "../../../../interfaces/model/log";

export interface ClientLogListItemProps {
    log: Log,
    showName?: boolean
}

const ClientAftercareListItem: React.FC<ClientLogListItemProps> = ({
    log,
    showName = false,
}) => {

    return (
        <tr>
            <td>
                <p className='py-2'>{!showName ? log.description : log.user ? generateUserFullName(log.user) : log.description}</p>
            </td>
            <td>
                <p>{formatDate(log.created_at, "YYYY-MM-DD")}</p>
            </td>
        </tr>
    );
}

export default ClientAftercareListItem;