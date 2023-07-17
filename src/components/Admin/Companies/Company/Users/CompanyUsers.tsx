import Skeleton from '@components/Skeleton/Skeleton';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import { useParams } from 'react-router';
import useSWR from "swr";
import api from "../../../../../configs/api";
import { commonFetch } from "../../../../../helper";
import { CompanyResponse } from "../../../../../interfaces/common";
import { User } from "../../../../../interfaces/model/user";
import strings from "../../../../../lang/Lang";
import FullPageError from '../../../../../partials/Error/FullPageError';
import Card from "../../../../../partials/Paper/PagePaper";
import Table from "../../../../../partials/Table/PageTable";
import CompanyUserListItem from "./CompanyUserListItem";

const CompanyUserDeleteModal = React.lazy(() => import("./CompanyUserDeleteModal"))
const CompanyUserModal = React.lazy(() => import("./CompanyUserModal"))

export interface CompanyUsersProps {

}

const CompanyUsers: React.FC<CompanyUsersProps> = () => {

    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);


    const { companyId }: { companyId?: string } = useParams();

    const { data, error, mutate } = useSWR<CompanyResponse, Error>(
        api.companySingle.replace(":id", companyId || ""),
        commonFetch
    );

    const [selectedUser, setSelectedUser] = React.useState<User>();

    if (error) {
        return <FullPageError code={error?.status || 500} message={error.message || 'server error'} />
    }

    return (
        <Card>
            <ModalSuspense>
                {openModal &&
                    <CompanyUserModal
                        openModal={openModal}
                        handleClose={() => setOpenModal(false)}
                        mutate={mutate}
                        selectedUser={selectedUser}
                    />
                }
                {deleteOpen &&
                    <CompanyUserDeleteModal
                        open={deleteOpen}
                        handleClose={() => setDeleteOpen(false)}
                        mutate={mutate}
                        selectedUser={selectedUser}
                    />
                }
            </ModalSuspense>
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl">{strings.Users}</h2>
            </div>
            <Table>
                <Table.Head>
                    <Table.Th>{strings.Name}</Table.Th>
                    <Table.Th className=""></Table.Th>
                </Table.Head>
                <Table.Body>
                    {data?.data?.users?.map((user) => (
                        <CompanyUserListItem
                            key={user.id}
                            user={user}
                            disableDelete={user.email === data?.data.email}
                            onEditClick={() => {
                                setSelectedUser(user);
                                setOpenModal(true);
                            }}
                            onDeleteClick={() => {
                                setSelectedUser(user);
                                setDeleteOpen(true);
                            }}
                        />
                    ))}
                </Table.Body>
            </Table>
            {!data ? <CompanyUsersSkeleton limit={5} /> : ''}
        </Card>
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