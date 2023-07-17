import Pagination from '@components/form/Pagination';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import React from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import api from "../../../../configs/api";
import { commonFetch, generateClientFullName, timeZone } from "../../../../helper";
import { usePaginationSWR } from "../../../../hooks/usePaginationSWR";
import { ClientLogsPaginatedResponse, ClientResponse } from "../../../../interfaces/common";
import { Client } from "../../../../interfaces/model/client";
import strings from "../../../../lang/Lang";
import DownloadIcon from "../../../../partials/Icons/Download";
import Button from '@components/form/Button';
import Card from "../../../../partials/Paper/PagePaper";
import Table from "../../../../partials/Table/PageTable";
import PageTableBody from "../../../../partials/Table/PageTableBody";
import PageTableHead from "../../../../partials/Table/PageTableHead";
import PageTableTH from "../../../../partials/Table/PageTableTH";
import PageTableTHSort from "../../../../partials/Table/PageTableTHSort";
import ClientLogListItem from "./ClientLogListItem";
import MaterialBreadcrumbs from '@partials/Breadcrumbs/MaterialBreadcrumbs';


export interface ClientLogsProps {

}


async function download(client: Client) {
    const response = await fetch(api.clientLogDownload.replace(':id', client?.id.toString() || ''), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-App-Locale': strings.getLanguage(),
            'X-Time-Zone': timeZone(),
        },
        credentials: 'include',
    });

    const data = await response.blob();
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(data);
    a.setAttribute('download', `${generateClientFullName(client)} logs.pdf`);
    a.click();
}

const ClientLogs: React.FC<ClientLogsProps> = () => {

    const { clientId }: { clientId?: string } = useParams();

    const { data, page, setPage, loading, orderBy, orderDirection, handleOrder } = usePaginationSWR<ClientLogsPaginatedResponse, Error>(api.clientSingleLogs(clientId));
    const [downloading, setDownloading] = React.useState(false);

    const { data: clientData } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientId),
        commonFetch
    );

    return (
        <div className='mt-4'>
            <div className="mb-4">
                <MaterialBreadcrumbs />
            </div>
            <Heading text={strings.Client_Logs} variant="bigTitle" className='mb-4' />
            <Card>
                <Table>
                    <PageTableHead>
                        <PageTableTH>{strings.Details}</PageTableTH>
                        <PageTableTHSort
                            sort={orderBy === 'created_at' && orderDirection}
                            onClick={() => handleOrder('created_at')}
                        >{strings.DateTime}</PageTableTHSort>
                    </PageTableHead>
                    <PageTableBody>
                        {data && data.status === '1'
                            ? data.data.map((log) => <ClientLogListItem key={log.id} log={log} />)
                            : <></>
                        }

                        {loading && <ClientLogsSkeleton limit={10} />}
                    </PageTableBody>
                </Table>
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outlined"
                        size='small'
                        loading={downloading}
                        onClick={onDownload}
                    >
                        <DownloadIcon className="text-lg mr-2" />
                        {strings.Download}
                    </Button>
                    <Pagination
                        pageSize={data?.per_page ?? 0}
                        totalCount={data?.total ?? 0}
                        currentPage={page}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>
            </Card>
        </div >
    );

    async function onDownload() {
        if (downloading) return;
        setDownloading(true);
        if (clientData?.data) {
            await download(clientData?.data);
        }
        setDownloading(false);
    }
}

function ClientLogsSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((value, key) => {
                return (
                    <tr key={key}>
                        <td>
                            <div className="flex items-center">
                                <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                            </div>
                        </td>
                        <td>
                            <div className="flex items-center">
                                <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                            </div>
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default ClientLogs;