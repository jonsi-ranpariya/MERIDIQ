import Pagination from '@components/form/Pagination';
import Heading from '@components/heading/Heading';
import React from "react";
import { useParams } from "react-router";
import api from "../../../../configs/api";
import { usePaginationSWR } from "../../../../hooks/usePaginationSWR";
import { ClientLogsPaginatedResponse } from "../../../../interfaces/common";
import strings from "../../../../lang/Lang";
import Card from "../../../../partials/Paper/PagePaper";
import Table from "../../../../partials/Table/PageTable";
import PageTableBody from "../../../../partials/Table/PageTableBody";
import PageTableHead from "../../../../partials/Table/PageTableHead";
import PageTableTH from "../../../../partials/Table/PageTableTH";
import PageTableTHSort from "../../../../partials/Table/PageTableTHSort";
import BackToClientDashboard from '../sections/BackToClientDashboard';
import ClientAftercareListItem from "./ClientAftercareListItem";


export interface ClientLogsProps {

}

const ClientAftercares: React.FC<ClientLogsProps> = () => {

    const { clientId }: { clientId?: string } = useParams();

    const { data, page, setPage, orderBy, orderDirection, handleOrder } = usePaginationSWR<ClientLogsPaginatedResponse, Error>(api.clientAftercares(clientId));

    return (
        <>
            <BackToClientDashboard />
            <Heading text={strings.AfterCare} variant="bigTitle" className='mb-4' />
            <Card>
                <Table>
                    <PageTableHead>
                        <PageTableTH>{strings.Details}</PageTableTH>
                        <PageTableTHSort
                            sort={orderBy === 'created_at' && orderDirection}
                            onClick={() => handleOrder('created_at')}
                            children={strings.DateTime}
                        />
                    </PageTableHead>
                    <PageTableBody>
                        {data?.data.map((log) => (
                            <ClientAftercareListItem key={log.id} log={log} />
                        ))}
                    </PageTableBody>
                </Table>
                <Pagination
                    pageSize={data?.per_page ?? 0}
                    totalCount={data?.total ?? 0}
                    currentPage={page}
                    onPageChange={(page) => setPage(page)}
                />
            </Card>
        </>
    );
}

export default ClientAftercares;