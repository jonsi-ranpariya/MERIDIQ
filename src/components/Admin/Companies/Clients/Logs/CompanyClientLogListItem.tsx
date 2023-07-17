import * as React from 'react';
import { formatDate } from '../../../../../helper';
import { Log } from '../../../../../interfaces/model/log';

export interface ClientLogListItemProps {
    log: Log,
}

const CompanyClientLogListItem: React.FC<ClientLogListItemProps> = ({
    log,
}) => {

    return (
        <tr className="border-b dark:border-gray-700">
            <td className="py-2">
                <div className="flex pl-2 break-all">
                    <span className="">{log.description}</span>
                </div>
            </td>
            <td className="py-2">
                <div className="flex pl-2 break-all">
                    <span className="">{formatDate(log.created_at)}</span>
                </div>
            </td>
        </tr>
    );
}

export default CompanyClientLogListItem;