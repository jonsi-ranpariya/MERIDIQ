import Avatar from '@components/avatar/Avatar';
import IconButton from '@components/form/IconButton';
import Table from '@partials/Table/PageTable';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../configs/api';
import { formatDate } from '../../../helper';
import { Company } from '../../../interfaces/model/company';
import strings from '../../../lang/Lang';
import DeleteIcon from '../../../partials/Icons/Delete';
import EditIcon from '../../../partials/Icons/Edit';
import EditNoteIcon from '../../../partials/Icons/EditNote';
import UsersIcon from '../../../partials/Icons/Users';
import Switch from '../../form/Switch';


export interface CompanyListItemProps {
    company: Company,
    onLeadClick?: (data: Company) => void,
    onEditClick?: (data: Company) => void,
    onDeleteClick?: (data: Company) => void,
    onListClick?: (data: Company) => void,
    mutate: () => Promise<any>,
}

const CompanyListItem: React.FC<CompanyListItemProps> = ({
    company,
    mutate,
    onLeadClick = () => {},
    onEditClick = () => {},
    onDeleteClick = () => {},
    onListClick = () => {},
}) => {

    function getCompanyNameColor() {
        if (company?.lead?.status === api.leadTypes.win)
            return 'text-green-600 dark:text-green-400'
        if (company?.lead?.status === api.leadTypes.lost)
            return 'text-error'
        if (company?.lead?.status === api.leadTypes.not_decided)
            return 'text-yellow-500 dark:text-yellow-400'
        return '';
    }

    const [isBlockedSubmitting, setIsBlockedSubmitting] = React.useState(false);
    const [isReadOnlySubmitting, setIsReadOnlySubmitting] = React.useState(false);
    const navigate = useNavigate();

    return (
        <tr className="break-all alternate-tr">
            <Table.Td className="">
                <button onClick={() => { onEditClick(company); }}>
                    <div className="flex items-center space-x-2 w-60">
                        <Avatar
                            className='h-16 w-16'
                            src={company?.profile_photo ? `${process.env.REACT_APP_STORAGE_PATH}/${company?.profile_photo}` : undefined}
                            alt={`${company.company_name} ${strings.ProfilePicture}`}
                        />
                        <p className={`font-medium text-left mr-2 ${getCompanyNameColor()} border-b-2 ${company?.lead?.contacted ? 'border-success' : 'border-error'}`}>{company.company_name}</p>
                    </div>
                </button>
            </Table.Td>
            <Table.Td><p className='w-48'>{company.email}</p></Table.Td>
            <Table.Td>
                {`${company?.is_subscribed
                    ? company?.subscriptions?.find(
                        (subscription) => subscription.stripe_status === api.stripeActive,
                    )?.plan?.name
                    : (company.is_cancelled
                        ? strings.Cancelled
                        : strings.NotSubscribed
                    )}`}
            </Table.Td>
            <Table.Td>{company.users_count}</Table.Td>
            <Table.Td>{company.clients_count}</Table.Td>
            <Table.Td>{company.procedures_count}</Table.Td>
            <Table.Td>{company.storage_usage}</Table.Td>
            <Table.Td><p className='whitespace-pre'>{formatDate(company.created_at)}</p></Table.Td>
            <Table.Td><p className='whitespace-pre'>{formatDate(company.last_login_at)}</p></Table.Td>
            <Table.Td>
                <Switch
                    checked={company.is_blocked}
                    loading={isBlockedSubmitting}
                    onChange={changeIsBlocked}
                />
            </Table.Td>
            <Table.Td>
                <Switch
                    checked={company.is_read_only}
                    loading={isReadOnlySubmitting}
                    onChange={changeIsReadOnly}
                />
            </Table.Td>
            <Table.Td>
                <div className="flex space-x-1">
                    <IconButton onClick={() => onLeadClick(company)}>
                        <EditNoteIcon />
                    </IconButton>
                    <IconButton onClick={() => onEditClick(company)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteClick(company)}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => onListClick(company)} title={strings.Clients}>
                        <UsersIcon />
                    </IconButton>
                </div>
            </Table.Td>
        </tr>
    );

    async function changeIsBlocked() {
        if (isBlockedSubmitting) return
        setIsBlockedSubmitting(true);

        const response = await fetch(api.companyMasterUpdate.replace(':id', company?.id?.toString()), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json',
                'X-App-Locale': strings.getLanguage(),
            },
            body: JSON.stringify({
                is_blocked: company.is_blocked ? 0 : 1,
            }),
            credentials: 'include',
        })
        const data = await response.json();
        if (response.status === 401) {
            navigate('/');
        }
        if (data.status === '1') {
            mutate();
            toast.success(data.message);
        }
        if (data.status === '2' || data.status === '3' || data.status === '0') {
            toast.error(data.message || 'please try again.');
        }
        setIsBlockedSubmitting(false);

    }

    async function changeIsReadOnly() {
        if (isReadOnlySubmitting) return;
        setIsReadOnlySubmitting(true);

        const response = await fetch(api.companyMasterUpdate.replace(':id', company?.id?.toString()), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'content-type': 'application/json',
                'X-App-Locale': strings.getLanguage(),
            },
            body: JSON.stringify({
                is_read_only: company.is_read_only ? 0 : 1,
            }),
            credentials: 'include',
        })
        const data = await response.json();
        if (response.status === 401) {
            navigate('/');
        }
        if (data.status === '1') {
            mutate();
            toast.success(data.message);
        }
        if (data.status === '2' || data.status === '3' || data.status === '0') {
            toast.error(data.message || 'please try again.');
        }
        setIsReadOnlySubmitting(false);

    }
}

export default CompanyListItem;