import * as React from 'react';
import { formatDate } from '../../../../helper';
import { Log } from "../../../../interfaces/model/log";

export interface ClientLogListItemProps {
    log: Log,
}

const ClientLogListItem: React.FC<ClientLogListItemProps> = ({
    log,
}) => {

    return (
        <tr className="border-b dark:border-gray-700">
            <td>
                <p className='py-2 pl-1'>{log.description}</p>
            </td>
            <td className="">
                <p>{formatDate(log.created_at)}</p>
            </td>
        </tr>
    );
}

export default ClientLogListItem;