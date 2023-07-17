
import Pagination from '@components/form/Pagination';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import React from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../../../configs/api";
import { usePaginationSWR } from "../../../../hooks/usePaginationSWR";
import { ClientProcedurePaginatedResponse } from "../../../../interfaces/common";
import { ClientTreatment } from "../../../../interfaces/model/clientTreatment";
import strings from "../../../../lang/Lang";
import Card from "../../../../partials/Paper/PagePaper";
import Table from "../../../../partials/Table/PageTable";
import PageTableBody from "../../../../partials/Table/PageTableBody";
import PageTableHead from "../../../../partials/Table/PageTableHead";
import PageTableTH from "../../../../partials/Table/PageTableTH";
import PageTableTHSort from "../../../../partials/Table/PageTableTHSort";
import BackToClientDashboard from '../sections/BackToClientDashboard';
import ClientProcedureListItem from "./ClientProcedureListItem";

const ClientProcedureSignModal = React.lazy(() => import('./ClientProcedureVerifySignModal'))
const ClientProcedureViewModal = React.lazy(() => import('./ClientProcedureViewModal'))

export interface ClientProceduresProps {

}

const ClientProcedures: React.FC<ClientProceduresProps> = () => {

    const { clientId }: { clientId?: string } = useParams();

    const { data, page, setPage, loading, mutate, orderBy, orderDirection, handleOrder } = usePaginationSWR<ClientProcedurePaginatedResponse, Error>(api.clientTreatments(clientId));

    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [openSignModal, setOpenSignModal] = React.useState(false);

    const [selectedProcedure, setSelectedProcedure] = React.useState<ClientTreatment>();
    const navigate = useNavigate();


    return (
        <div className="">
            <ModalSuspense>
                {openSignModal &&
                    <ClientProcedureSignModal
                        openModal={openSignModal}
                        onClose={() => {
                            setOpenSignModal(false);
                            setSelectedProcedure(undefined);
                        }}
                        selectedProcedure={selectedProcedure}
                        mutate={mutate}
                    />
                }
                {openViewModal &&
                    <ClientProcedureViewModal
                        openModal={openViewModal}
                        handleClose={() => {
                            setOpenViewModal(false);
                            setSelectedProcedure(undefined);
                        }}
                        selectedClientTreatment={selectedProcedure}
                    />
                }
            </ModalSuspense>
            <BackToClientDashboard />
            <Heading text={strings.Procedures} variant="bigTitle" className='mb-4' />
            <Card>
                <Table>
                    <PageTableHead>
                        <PageTableTHSort
                            sort={orderBy === 'name' && orderDirection}
                            onClick={() => handleOrder('name')}
                        >{strings.TITLE}</PageTableTHSort>
                        <PageTableTHSort className="capitalize"
                            sort={orderBy === 'date' && orderDirection}
                            onClick={() => handleOrder('date')}
                        >
                            {strings.Date}
                        </PageTableTHSort>
                        <PageTableTHSort
                            sort={orderBy === 'user.last_name' && orderDirection}
                            onClick={() => handleOrder('user.last_name')}
                        >{strings.Changed_by}</PageTableTHSort>
                        <PageTableTHSort
                            sort={orderBy === 'signed_at' && orderDirection}
                            onClick={() => handleOrder('signed_at')}
                        >
                            {strings.status}
                        </PageTableTHSort>

                        <PageTableTH></PageTableTH>
                    </PageTableHead>
                    <PageTableBody>
                        {data?.data.map((procedure) => (
                            <ClientProcedureListItem
                                key={procedure.id}
                                procedure={procedure}
                                onViewClick={(procedure) => {
                                    setSelectedProcedure(procedure);
                                    setOpenViewModal(true);
                                }}
                                onEditClick={() => {
                                    navigate(`/clients/${clientId}/procedures/${procedure.id}/edit`);
                                }}
                                onCopyClick={() => {
                                    navigate(`/clients/${clientId}/procedures/${procedure.id}/edit?copy`);
                                }}
                                onSignClick={(procedure) => {
                                    setSelectedProcedure(procedure);
                                    setOpenSignModal(true);
                                }}
                            />
                        ))}
                        {loading && <ClientProceduresSkeleton limit={10} />}
                    </PageTableBody>
                </Table>
                <Pagination
                    pageSize={data?.per_page}
                    totalCount={data?.total}
                    currentPage={page}
                    onPageChange={(page) => setPage(page)}
                />
            </Card>
        </div >
    );
}

function ClientProceduresSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((value, key) => {
                return (
                    <tr key={key}>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
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

export default ClientProcedures;