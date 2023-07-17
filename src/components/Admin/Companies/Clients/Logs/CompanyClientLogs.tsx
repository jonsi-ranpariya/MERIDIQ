import Pagination from '@components/form/Pagination';
import Skeleton from '@components/Skeleton/Skeleton';
import React from "react";
import { useParams } from "react-router";
import api from "../../../../../configs/api";
import { timeZone } from "../../../../../helper";
import { usePaginationSWR } from "../../../../../hooks/usePaginationSWR";
import { ClientLogsPaginatedResponse } from "../../../../../interfaces/common";
import strings from "../../../../../lang/Lang";
import DownloadIcon from "../../../../../partials/Icons/Download";
import Button from '@components/form/Button';
import Card from "../../../../../partials/Paper/PagePaper";
import Table from "../../../../../partials/Table/PageTable";
import PageTableBody from "../../../../../partials/Table/PageTableBody";
import PageTableHead from "../../../../../partials/Table/PageTableHead";
import PageTableTH from "../../../../../partials/Table/PageTableTH";
import PageTitle from "../../../../../partials/Title/PageTitle";
import CompanyClientLogListItem from "./CompanyClientLogListItem";


export interface ClientLogsProps {

}


async function download(clientId: string) {
    const response = await fetch(api.clientLogDownload.replace(':id', clientId || ''), {
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
    a.setAttribute('download', 'logs.pdf');
    a.click();
}

const CompanyClientLogs: React.FC<ClientLogsProps> = () => {

    const { clientId }: { clientId?: string } = useParams();

    const { data, page, setPage, loading } = usePaginationSWR<ClientLogsPaginatedResponse, Error>(api.clientSingleLogs(clientId));
    const [downloading, setDownloading] = React.useState(false);

    return (
        <div className="container mx-auto">
            <PageTitle size="big" breadcumb>
                {strings.Client_Logs}
            </PageTitle>
            <Card>
                <Table>
                    <PageTableHead>
                        <PageTableTH>{strings.Details}</PageTableTH>
                        <PageTableTH>{strings.DateTime}</PageTableTH>
                    </PageTableHead>
                    <PageTableBody>
                        {data
                            && data.status === '1'
                            ? data.data.map((log) => {
                                return <CompanyClientLogListItem
                                    key={log.id}
                                    log={log}
                                />
                            })
                            : <></>}

                        {loading && <ClientLogsSkeleton limit={10} />}
                    </PageTableBody>
                </Table>
                <div className="flex justify-between">
                    <Button
                        className=""
                        variant="outlined"
                        color="secondary"
                        loading={downloading}
                        onClick={async () => {
                            if (downloading) return;
                            setDownloading(true);
                            await download(clientId!);
                            setDownloading(false);
                        }}
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

export default CompanyClientLogs;