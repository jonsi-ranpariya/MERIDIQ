import Select from '@components/form/Select';
import Skeleton from '@components/Skeleton/Skeleton';
import * as React from 'react';
import useSWR from "swr";
import api from "../../../configs/api";
import { commonFetch } from "../../../helper";
import { CompanyUserResponse } from "../../../interfaces/common";
import { User } from "../../../interfaces/model/user";
import strings from "../../../lang/Lang";
import AddRoundIcon from "../../../partials/Icons/AddRound";
import Button from '@components/form/Button';
import Table from "../../../partials/Table/PageTable";
import PageTableBody from "../../../partials/Table/PageTableBody";
import PageTableHead from "../../../partials/Table/PageTableHead";
import PageTableTH from "../../../partials/Table/PageTableTH";
import CompanyUserDeleteModal from "./CompanyUserDeleteModal";
import CompanyUserListItem from "./CompanyUserListItem";
import CompanyUserModal from "./CompanyUserModal";
import CompanyUserStatusModal from './CompanyUserStatusModal';

export interface CompanyUsersProps {

}
const listFilter = [
    {
        text: strings.All,
        key: 'all',
        filter: 'withTrashed',
        filterType: '=',
        filterValue: 'true',
    },
    {
        text: strings.Active,
        key: 'active',
        filter: 'deleted_at',
        filterType: '=',
        filterValue: null,
    },
    {
        text: strings.InActive,
        key: 'inactive',
        filter: 'onlyTrashed',
        filterType: '!=',
        filterValue: "true",
    }
];

const CompanyUsers: React.FC<CompanyUsersProps> = () => {

    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [activeOpen, setActiveOpen] = React.useState(false);

    const [filter, setFilter] = React.useState<'all' | 'active' | 'inactive'>('all');

    const { data, mutate } = useSWR<CompanyUserResponse, Error>(api.userAllFilter({ filter: filter }), commonFetch)

    const [selectedUser, setSelectedUser] = React.useState<User>();

    return (
        <div className='p-4'>
            <CompanyUserModal
                openModal={openModal}
                handleClose={() => setOpenModal(false)}
                mutate={mutate}
                selectedUser={selectedUser}
            />
            <CompanyUserDeleteModal
                open={deleteOpen}
                handleClose={() => {
                    setDeleteOpen(false);
                }}
                mutate={mutate}
                selectedUser={selectedUser}
            />
            <CompanyUserStatusModal
                open={activeOpen}
                handleClose={() => setActiveOpen(false)}
                mutate={mutate}
                selectedUser={selectedUser}
            />
            <div className="grid grid-flow-row grid-cols-1 gap-3 md:grid-cols-2 lg:grid-flow-row lg:grid-cols-4 lg:gap-x-6 xl:grid-flow-col xl:grid-cols-5">

                <Select
                    displayValue={(value) => listFilter.find(val => val.key === value)?.text ?? ""}
                    value={filter}
                    onChange={(value) => setFilter(value as 'all')}
                >
                    {listFilter.map((filter) => {
                        return <Select.Option value={filter.key} key={`list_filter_${filter.key}`}>{filter.text}</Select.Option>
                    })}
                </Select>
                <div className="flex justify-end  lg:col-start-4 xl:col-start-5">
                    <Button
                        className=""
                        onClick={() => {
                            setSelectedUser(undefined);
                            setOpenModal(true);
                        }}
                    >
                        <AddRoundIcon className="text-lg mr-2" />
                        {strings.NewUser}
                    </Button>
                </div>
            </div>
            <Table>
                <PageTableHead>
                    <PageTableTH>{strings.Name}</PageTableTH>
                    <PageTableTH className=""></PageTableTH>
                </PageTableHead>
                <PageTableBody>
                    {data
                        && data.status === '1'
                        ? data.data.map((user) => {
                            return <CompanyUserListItem
                                key={user.id}
                                user={user}
                                onEditClick={() => {
                                    setSelectedUser(user);
                                    setOpenModal(true);
                                }}
                                onDeleteClick={(us) => {
                                    setSelectedUser(us);
                                    setDeleteOpen(true);
                                }}
                                onRestoreClick={(us) => {
                                    setSelectedUser(us);
                                    setActiveOpen(true);
                                }}
                            />
                        })
                        : <></>}
                    {!data ? <CompanyUsersSkeleton limit={5} /> : ''}
                </PageTableBody>
            </Table>
        </div>
    );
}

function CompanyUsersSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((_, index) => {
                return (
                    <tr key={index}>
                        <td className="py-2">
                            <div className="flex">
                                <Skeleton className="h-10 w-10 mx-2" variant="circular" />
                                <div className="">
                                    <Skeleton className="mr-4 cursor-wait w-48" />
                                    <Skeleton className="h-4 mr-4 cursor-wait w-20" />
                                </div>
                            </div>
                        </td>
                        <td className="flex">
                            <Skeleton className="h-9 w-9 mx-1" variant="circular" />
                            <Skeleton className="h-9 w-9 ml-1" variant="circular" />
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default CompanyUsers;