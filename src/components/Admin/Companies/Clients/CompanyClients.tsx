import Pagination from '@components/form/Pagination';
import Skeleton from '@components/Skeleton/Skeleton';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../../configs/api';
import { usePaginationSWR } from '../../../../hooks/usePaginationSWR';
import { ClientsPaginatedResponse } from '../../../../interfaces/common';
import strings from '../../../../lang/Lang';
import Card from '../../../../partials/Paper/PagePaper';
import SearchTextField from '../../../../partials/SearchTextField/SearchTextField';
import Table from '../../../../partials/Table/PageTable';
import PageTitle from '../../../../partials/Title/PageTitle';
import CompanyClientListItem from './CompanyClientListItem';

export interface ClientsProps {

}

export interface Filter {
    text: string
    key: string
}

export interface filterInterFace {
    page: ''
    per_page: ''
}

const CompanyClients: React.FC<ClientsProps> = () => {

    const { companyId }: { companyId?: string } = useParams();

    const { error, data, page, setPage, loading, search, setSearch } = usePaginationSWR<ClientsPaginatedResponse, Error>(api.companyClients.replace(':id', companyId || ''), {
        orderBy: 'created_at',
        orderDirection: 'desc',
        filter: undefined,
        filterType: '=',
        filterValue: '',
    });

    const navigate = useNavigate();

    React.useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return (
        <div className="container mx-auto">

            <PageTitle size="big" breadcumb>
                {strings.Clients}
            </PageTitle>
            <Card>
                <div className="grid grid-flow-row grid-cols-1 gap-3 md:grid-cols-2 lg:grid-flow-col lg:grid-cols-5 lg:gap-x-6">
                    <div className="lg:col-span-2">
                        <SearchTextField
                            value={search || ''}
                            onChange={(event) => {
                                setSearch(event.target.value);
                            }}
                        />
                    </div>
                </div>

                <Table>
                    <Table.Head>
                        <Table.Th>{strings.Name}</Table.Th>
                        <Table.Th>{strings.Email}</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Head>
                    <Table.Body>
                        {data
                            && data.status === '1'
                            ? data.data.map((client) => {
                                return <CompanyClientListItem
                                    key={client.id}
                                    onListClick={() => {
                                        navigate(`/admin/companies/${companyId}/clients/${client.id}/logs`);
                                    }}
                                    client={client}
                                />
                            })
                            : <></>}
                        {loading ? <Clientskeleton limit={10} /> : <></>}
                    </Table.Body>
                </Table>
                <Pagination
                    pageSize={data?.per_page}
                    totalCount={data?.total}
                    currentPage={page}
                    onPageChange={(page) => setPage(page)}
                />
            </Card>
        </div>
    );
}


function Clientskeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((_, index) => {
                return (
                    <tr key={index}>
                        <td className="py-2">
                            <div className="flex items-center">
                                <Skeleton variant="circular" className="mx-2 h-10 w-10 table" />
                                <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                            </div>
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

export default CompanyClients;