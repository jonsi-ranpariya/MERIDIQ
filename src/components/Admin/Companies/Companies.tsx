import Input from '@components/form/Input';
import Pagination from '@components/form/Pagination';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import SearchIcon from '@partials/Icons/Search';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../../configs/api";
import { timeZone } from "../../../helper";
import { usePaginationSWR } from "../../../hooks/usePaginationSWR";
import { CompaniesPaginatedResponse } from "../../../interfaces/common";
import { Company } from "../../../interfaces/model/company";
import strings from "../../../lang/Lang";
import Button from '@components/form/Button';
import Card from "../../../partials/Paper/PagePaper";
import Table from "../../../partials/Table/PageTable";
import CompanyListItem from "./CompanyListItem";

const CompanyDeleteModal = React.lazy(() => import("./Company/CompanyDeleteModal"))
const CompanyLeadModal = React.lazy(() => import("./Company/CompanyLeadModal"))

export interface CompaniesProps {

}

async function download() {
    const response = await fetch(api.companiesExport, {
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
    a.setAttribute('download', `companies.xlsx`);
    a.click();
}

const Companies: React.FC<CompaniesProps> = () => {
    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [loadingExport, setLoadingExport] = React.useState(false);

    const location = useLocation();

    const { error, data, mutate, page, orderBy, setPage, loading, orderDirection, handleOrder, search, setSearch } = usePaginationSWR<CompaniesPaginatedResponse, Error>(api.companies);

    React.useEffect(() => {
        const requestSearch = location.search.split('search=')[1];
        setSearch(decodeURI(requestSearch || '') ?? '');
    }, [location.search, setSearch])

    const [selectedCompany, setSelectedCompany] = React.useState<Company>();

    const navigate = useNavigate();

    React.useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return (
        <div className="">
            <ModalSuspense>
                {openModal &&
                    <CompanyLeadModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                        selectedCompany={selectedCompany}
                    />
                }
                {deleteOpen &&
                    <CompanyDeleteModal
                        open={deleteOpen}
                        handleClose={() => setDeleteOpen(false)}
                        mutate={mutate}
                        selectedCompany={selectedCompany}
                    />
                }
            </ModalSuspense>
            <Heading text={strings.Companies} variant="bigTitle" className='mb-4' />
            <Card>
                <div className="grid grid-flow-row grid-cols-1 gap-3 md:grid-cols-2 lg:grid-flow-col lg:grid-cols-5 lg:gap-x-6">
                    <div className="lg:col-span-2">
                        <Input
                            placeholder={strings.Search}
                            value={search || ''}
                            icon={<SearchIcon className="text-mediumGray" />}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    <div>
                        <Button
                            onClick={async () => {
                                setLoadingExport(true);
                                await download();
                                setLoadingExport(false);
                            }}
                            loading={loadingExport}
                        >
                            Export
                        </Button>
                    </div>
                </div>

                <Table>
                    <Table.Head>
                        <Table.ThSort
                            sort={orderBy === 'company_name' && orderDirection}
                            onClick={() => {
                                handleOrder('company_name');
                            }}
                        >
                            {strings.Name}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'email' && orderDirection}
                            onClick={() => {
                                handleOrder('email');
                            }}
                        >
                            {strings.Email}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'subscription' && orderDirection}
                            onClick={() => {
                                handleOrder('subscription');
                            }}
                        >
                            {strings.SUBSCRIPTION}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'users_count' && orderDirection}
                            onClick={() => {
                                handleOrder('users_count');
                            }}
                        >
                            {strings.Users}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'clients_count' && orderDirection}
                            onClick={() => {
                                handleOrder('clients_count');
                            }}
                        >
                            {strings.master_Clients}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'procedures_count' && orderDirection}
                            onClick={() => {
                                handleOrder('procedures_count');
                            }}
                        >
                            {strings.Treatments}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'storage_usage' && orderDirection}
                            onClick={() => {
                                handleOrder('storage_usage');
                            }}
                        >
                            {strings.storageUsage}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'created_at' && orderDirection}
                            onClick={() => {
                                handleOrder('created_at');
                            }}
                        >
                            {strings.created_at}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'last_login_at' && orderDirection}
                            onClick={() => {
                                handleOrder('last_login_at');
                            }}
                        >
                            {strings.last_login_at}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'is_blocked' && orderDirection}
                            onClick={() => {
                                handleOrder('is_blocked');
                            }}
                        >
                            {strings.IsBlocked}
                        </Table.ThSort>
                        <Table.ThSort
                            sort={orderBy === 'is_read_only' && orderDirection}
                            onClick={() => {
                                handleOrder('is_read_only');
                            }}
                        >
                            {strings.IsReadOnly}
                        </Table.ThSort>
                        <Table.Th>{strings.Actions}</Table.Th>
                    </Table.Head>
                    <Table.Body>
                        {data?.data.filter((company) => company.email !== 'meridiq@gmail.com').map((company) => (
                            <CompanyListItem
                                key={company.id}
                                mutate={mutate}
                                onEditClick={() => {
                                    navigate(`/admin/companies/${company?.id}`);
                                }}
                                onLeadClick={() => {
                                    setSelectedCompany(company);
                                    setOpenModal(true);
                                }}
                                onDeleteClick={() => {
                                    setSelectedCompany(company);
                                    setDeleteOpen(true);
                                }}
                                onListClick={() => {
                                    navigate(`/admin/companies/${company.id}/clients`);
                                }}
                                company={company}
                            />
                        ))}
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
                            <div className="flex items-center">
                                <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                            </div>
                        </td>
                        <td>
                            <div className="flex items-center">
                                <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                            </div>
                        </td>
                        <td className="flex">
                            <Skeleton className="h-9 w-9 mx-1" variant="circular" />
                            <Skeleton className="h-9 w-9 ml-1" variant="circular" />
                            <Skeleton className="h-9 w-9 ml-1" variant="circular" />
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default Companies;