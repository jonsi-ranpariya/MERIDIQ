import AddButton from '@components/form/AddButton';
import Input from '@components/form/Input';
import Pagination from '@components/form/Pagination';
import Select from '@components/form/Select';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import SearchIcon from '@icons/Search';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import React from "react";
import api from "../../configs/api";
import { FilterType, OrderDirection, usePaginationSWR } from "../../hooks/usePaginationSWR";
import { LetterOfConsentPaginatedResponse } from "../../interfaces/common";
import { LetterOfConsent } from "../../interfaces/model/letterOfConsent";
import strings from "../../lang/Lang";
import AddRoundIcon from "../../partials/Icons/AddRound";
import Button from '@components/form/Button';
import Card from "../../partials/Paper/PagePaper";
import Table from "../../partials/Table/PageTable";
import PageTableTH from "../../partials/Table/PageTableTH";
import LetterOfConstentListItem from "./LetterOfConstentListItem";

const LetterOfConsentDeleteModal = React.lazy(() => import("./LetterOfConsentDeleteModal"))
const LetterOfConsentModal = React.lazy(() => import("./LetterOfConsentModal"))

export interface LetterOfConsentsProps {

}

export interface Filter {
    text: string
    key: string
}



const LetterOfConsents: React.FC<LetterOfConsentsProps> = () => {

    const orderFilter = [
        {
            text: strings.RecentlyAdded,
            key: 'order_by_recent',
            orderBy: 'created_at',
            orderDirection: 'desc'
        },
        {
            text: 'A-Z',
            key: 'order_by_az',
            orderBy: 'consent_title',
            orderDirection: 'asc'
        },
        {
            text: 'Z-A',
            key: 'order_by_za',
            orderBy: 'consent_title',
            orderDirection: 'desc'
        },
    ];

    const statusFilter = [
        {
            text: strings.All,
            key: 'all',
            filter: 'withTrashed',
            filterType: '=',
            filterValue: null,
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
            filterValue: null,
        }
    ];

    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const {
        data, mutate, filter, page, orderBy, setPage, loading, filterType, filterValue, orderDirection, orderData, filterData, search, setSearch, handleOrder
    } = usePaginationSWR<LetterOfConsentPaginatedResponse, Error>(api.letterOfConsent, {
        orderBy: 'created_at',
        orderDirection: 'desc',
        filter: 'deleted_at',
        filterType: '=',
        filterValue: null,
    });

    const [selectedLetter, setSelectedLetter] = React.useState<LetterOfConsent>();

    return (
        <div>
            <ModalSuspense>
                {openModal &&
                    <LetterOfConsentModal
                        openModal={openModal}
                        mutate={mutate}
                        selectedLetter={selectedLetter}
                        setOpenModal={setOpenModal}
                    />
                }
                {deleteOpen &&
                    <LetterOfConsentDeleteModal
                        open={deleteOpen}
                        handleClose={() => setDeleteOpen(false)}
                        mutate={mutate}
                        selectedLetterOfConsent={selectedLetter}
                    />
                }
            </ModalSuspense>

            <div className="flex justify-between mb-4 lg:mb-0">
                <Heading variant="headingTitle" text={strings.LettersofConsents} />
                <div className="lg:hidden flex space-x-2">
                    <AddButton
                        onClick={() => {
                            setSelectedLetter(undefined);
                            setOpenModal(true);
                        }}
                    />

                </div>
            </div>

            <div className="hidden lg:grid grid-flow-row grid-cols-1 gap-3 md:grid-cols-2 lg:grid-flow-col lg:grid-cols-5 lg:gap-x-6 py-4">
                <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
                    <Input
                        placeholder={strings.Search}
                        value={search || ''}
                        icon={<SearchIcon className="text-mediumGray" />}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <Select
                    value={orderFilter.find((oFilter) => oFilter.orderBy === orderBy && oFilter.orderDirection === orderDirection)?.key ?? orderFilter[orderFilter.length - 1].key}
                    onChange={(val) => {
                        const selectedFilter = orderFilter.find((oFilter) => oFilter.key === val);

                        if (selectedFilter) {
                            orderData(selectedFilter.orderBy, selectedFilter.orderDirection as OrderDirection);
                        }
                    }}
                    displayValue={(val) => orderFilter.find((oFilter) => oFilter.key === val)?.text}
                >
                    {orderFilter.map((filter) => <Select.Option key={`order_filter_${filter.key}`} value={filter.key}>{filter.text}</Select.Option>)}
                </Select>

                <Select
                    value={statusFilter.find((oFilter) => oFilter.filter === filter && oFilter.filterType === filterType && oFilter.filterValue === filterValue)?.key}
                    onChange={(val) => {
                        const selectedFilter = statusFilter.find((oFilter) => oFilter.key === val);
                        if (selectedFilter) {
                            filterData(selectedFilter.filter, selectedFilter.filterType as FilterType, selectedFilter.filterValue);
                        }
                    }}
                    displayValue={(val) => statusFilter.find((oFilter) => oFilter.key === val)?.text}
                >
                    {statusFilter.map((filter) => <Select.Option value={filter.key} key={`status_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                </Select>
                <div>
                    <Button
                        fullWidth
                        onClick={() => {
                            setSelectedLetter(undefined);
                            setOpenModal(true);
                        }}
                    >
                        <div className="flex items-center">
                            <AddRoundIcon className="mr-1" />
                            {strings.add}
                        </div>
                    </Button>
                </div>
            </div>
            <Card>
                <Table>
                    <Table.Head>
                        <Table.ThSort
                            sort={orderBy === 'consent_title' && orderDirection}
                            onClick={() => handleOrder('consent_title')}
                            children={strings.CONSENT_TITLE}
                        />
                        <PageTableTH />
                    </Table.Head>
                    <Table.Body>
                        {data?.data.map((letter) => (
                            <LetterOfConstentListItem
                                key={letter.id}
                                letter={letter}
                                onEditClick={() => {
                                    setSelectedLetter(letter);
                                    setOpenModal(true);
                                }}
                                onDeleteClick={() => {
                                    setSelectedLetter(letter);
                                    setDeleteOpen(true);
                                }}
                            />
                        ))}
                        {loading && <LetterOfConsentSkeleton limit={10} />}
                    </Table.Body>
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


function LetterOfConsentSkeleton({ limit }: { limit: number }) {
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

export default LetterOfConsents;