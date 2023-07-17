import MobileFilterWrapper from '@components/filter/MobileFilterWrapper';
import AddButton from '@components/form/AddButton';
import Button from '@components/form/Button';
import Input from '@components/form/Input';
import Pagination from '@components/form/Pagination';
import Select from '@components/form/Select';
import Skeleton from '@components/Skeleton/Skeleton';
import FilterIcon from '@icons/Filter';
import SearchIcon from '@icons/Search';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { FilterType, OrderDirection, usePaginationSWR } from '../../hooks/usePaginationSWR';
import { TreatmentPaginatedResponse } from '../../interfaces/common';
import { Treatment as ITreatment, TreatmentType } from '../../interfaces/model/treatment';
import strings from '../../lang/Lang';
import AddRoundIcon from '../../partials/Icons/AddRound';
import Table from '../../partials/Table/PageTable';
import TreatmentListItem from './TreatmentListItem';

const TreatmentDeleteModal = React.lazy(() => import('./TreatmentDeleteModal'))
const TreatmentModal = React.lazy(() => import('./TreatmentModal'))

export interface TreatmentsProps {
    type?: TreatmentType
}

export interface Filter {
    text: string
    key: string
}

export interface filterInterFace {
    page: ''
    per_page: ''
}

const Treatments: React.FC<TreatmentsProps> = ({
    type = 'treatment'
}) => {
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
            orderBy: 'name',
            orderDirection: 'asc'
        },
        {
            text: 'Z-A',
            key: 'order_by_za',
            orderBy: 'name',
            orderDirection: 'desc'
        },
    ];

    const statusFilter = [
        {
            text: strings.All,
            key: 'all',
            filter: 'withTrashed',
            filterType: '=',
            filterValue: '',
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

    const [showFilter, setShowFilter] = React.useState(false)

    const { error, data, mutate, filter, page, orderBy, setPage, loading, filterType, filterValue, orderDirection, orderData, filterData, search, setSearch, handleOrder } = usePaginationSWR<TreatmentPaginatedResponse, Error>(api.treatment + `?type=${type}`, {
        orderBy: 'created_at',
        orderDirection: 'desc',
        filter: 'deleted_at',
        filterType: '=',
        filterValue: null,
    });

    const [selectedTreatment, setSelectedTreatment] = React.useState<ITreatment>();

    React.useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return (
        <div>
            <ModalSuspense>
                {(deleteOpen && selectedTreatment) &&
                    <TreatmentDeleteModal
                        open={deleteOpen}
                        handleClose={() => {
                            setDeleteOpen(false);
                        }}
                        mutate={mutate}
                        selectedTreatment={selectedTreatment}
                    />
                }
                {openModal &&
                    <TreatmentModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                        selectedTreatment={selectedTreatment}
                        type={type}
                    />
                }
            </ModalSuspense>
            {mobileFilter()}
            {desktopFilter()}
            <Table>
                <Table.Head>
                    <Table.ThSort
                        children={type === 'treatment' ? strings.Treatment : strings.Text}
                        sort={orderBy === 'name' && orderDirection}
                        onClick={() => handleOrder('name')}
                    />
                    <Table.Th />
                </Table.Head>
                <Table.Body>
                    {data?.data.map((treatment) => (
                        <TreatmentListItem
                            key={treatment.id}
                            treatment={treatment}
                            onEditClick={() => {
                                setSelectedTreatment(treatment);
                                setOpenModal(true);
                            }}
                            onDeleteClick={() => {
                                setSelectedTreatment(treatment);
                                setDeleteOpen(true);
                            }}
                        />
                    ))}
                    {loading ? <TreatmentSkeleton limit={10} /> : <></>}
                </Table.Body>
            </Table>
            <Pagination
                pageSize={data?.per_page}
                totalCount={data?.total}
                currentPage={page}
                onPageChange={setPage}
            />
        </div>
    );

    function mobileFilter() {
        return (
            <>
                <div className="flex justify-end items-center mb-4">
                    <div className="lg:hidden flex space-x-2">
                        <AddButton
                            onClick={() => {
                                setSelectedTreatment(undefined);
                                setOpenModal(true);
                            }}
                        />
                        <Button
                            size="small"
                            variant={'outlined'}
                            onClick={() => setShowFilter(true)}
                        >
                            <FilterIcon className='text-2xl text-primary dark:text-primaryLight' />
                        </Button>
                    </div>
                </div>

                <MobileFilterWrapper
                    show={showFilter}
                    onCancel={() => setShowFilter(false)}
                    onSubmit={() => setShowFilter(false)}
                >
                    <Input
                        placeholder={strings.Search}
                        value={search || ''}
                        icon={<SearchIcon className="text-mediumGray" />}
                        onChange={(event) => setSearch(event.target.value)}
                    />

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
                </MobileFilterWrapper>
            </>
        )
    }

    function desktopFilter() {
        return (
            <div className="hidden lg:grid grid-flow-row grid-cols-1 gap-3 md:grid-cols-2 lg:grid-flow-col lg:grid-cols-5 lg:gap-x-6 mb-6">
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

                <Button onClick={() => {
                    setSelectedTreatment(undefined);
                    setOpenModal(true);
                }}>
                    <div className="flex items-center">
                        <AddRoundIcon className="text-lg mr-1" />
                        {strings.add}
                    </div>
                </Button>
            </div>
        )
    }
}


function TreatmentSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((_, index) => {
                return (
                    <tr key={index}>
                        <td>
                            <div className="flex items-center">
                                <Skeleton className="h-10 mx-4 cursor-wait w-full" />
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

export default Treatments;