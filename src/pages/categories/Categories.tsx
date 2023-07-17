import MobileFilterWrapper from '@components/filter/MobileFilterWrapper';
import Button from '@components/form/Button';
import Input from '@components/form/Input';
import Select from '@components/form/Select';
import Pagination from '@components/form/Pagination';
import Skeleton from '@components/Skeleton/Skeleton';
import FilterIcon from '@icons/Filter';
import SearchIcon from '@icons/Search';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import { toast } from 'react-toastify';
import { CategoryPaginatedResponse } from '../../interfaces/common';
import CategoryListItem from '@components/Category/CategoryListItem';
import Heading from '@components/heading/Heading';
import api from '../../configs/api';
import { FilterType, OrderDirection, usePaginationSWR } from '../../hooks/usePaginationSWR';
import { Category } from '@interface/model/category';
import strings from '../../lang/Lang';
import AddRoundIcon from '../../partials/Icons/AddRound';
import Card from '../../partials/Paper/PagePaper';
import Table from '../../partials/Table/PageTable';

const CategoryDeleteModal = React.lazy(() => import('../../components/Category/CategoryDeleteModal'))
const CategoryModal = React.lazy(() => import('../../components/Category/CategoryModal'))

export interface CategoryProps {
}

export interface Filter {
    text: string
    key: string
}

const Categories: React.FC<CategoryProps> = () => {

    const orderFilter = [
        {
            text: strings.MostRecent,
            key: 'Most Recent',
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
            filter: 'is_active',
            filterType: '!=',
            filterValue: '',
        },
        {
            text: strings.Active,
            key: 'active',
            filter: 'is_active',
            filterType: '=',
            filterValue: "1",
        },
        {
            text: strings.InActive,
            key: 'inactive',
            filter: 'is_active',
            filterType: '=',
            filterValue: "0",
        }
    ];

    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [showFilter, setShowFilter] = React.useState(false);
    const { error, data, mutate, filter, page, orderBy, setPage, loading, filterType, filterValue, orderDirection, orderData, filterData, search, setSearch, handleOrder } = usePaginationSWR<CategoryPaginatedResponse, Error>(api.category, {
        orderBy: 'created_at',
        orderDirection: 'desc',
        filter: statusFilter[0].filter,
        filterType: statusFilter[0].filterType as any,
        filterValue: statusFilter[0].filterValue,
    });

    const [selectedCategory, setSelectedCategory] = React.useState<Category>();

    React.useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return (
        <div className="">

            <ModalSuspense>
                {openModal &&
                    <CategoryModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                        selectedCategory={selectedCategory}
                    />
                }
                {deleteOpen &&
                    <CategoryDeleteModal
                        open={deleteOpen}
                        handleClose={() => {
                            setDeleteOpen(false);
                        }}
                        mutate={mutate}
                        selectedCategory={selectedCategory}
                    />
                }
            </ModalSuspense>

            <div className="flex justify-between items-center mb-4 lg:mb-0">
                <Heading variant="headingTitle" text={strings.category} />
                <div className="lg:hidden flex space-x-2">
                    <Button
                        size="small"
                        variant={'outlined'}
                        onClick={() => setShowFilter(true)}
                    >
                        <FilterIcon className='text-2xl text-primary' />
                    </Button>
                    <Button
                        onClick={() => {
                            setSelectedCategory(undefined);
                            setOpenModal(true);
                        }}
                        size="small"
                    >
                        <div className="flex items-center">
                            <AddRoundIcon className="mr-1" />
                            {strings.add}
                        </div>
                    </Button>
                </div>
            </div>
            {mobileFilter()}
            <div className="hidden lg:grid grid-flow-row grid-cols-1 gap-3 py-4 md:grid-cols-2 lg:grid-flow-row lg:grid-cols-4 lg:gap-x-6 xl:grid-flow-col xl:grid-cols-6">
                {
                    <>
                        <div className="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-2">
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

                                if (selectedFilter && selectedFilter.orderBy) {
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
                            {statusFilter.map((filter) => <Select.Option value={filter.key} key={`list_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                        </Select>
                        <Button
                            fullWidth
                            onClick={() => {
                                // toast.success('hahha')
                                setSelectedCategory(undefined);
                                setOpenModal(true);
                            }}
                        >
                            <div className="flex items-center">
                                <AddRoundIcon className="mr-1" />
                                {strings.add}
                            </div>
                        </Button>
                    </>
                }
            </div>

            <Card>
                <Table>
                    <Table.Head>
                        <Table.ThSort
                            sort={orderBy === 'name' && orderDirection}
                            onClick={() => handleOrder('name')}
                            children={strings.category}
                        />
                        <Table.Th children="" />
                    </Table.Head>
                    <Table.Body>
                        {
                            data?.data
                                ? data?.data.map((category) => (
                                    <CategoryListItem
                                        key={category.id}
                                        onEditClick={() => {
                                            setSelectedCategory(category);
                                            setOpenModal(true);
                                        }}
                                        onDisableClick={() => {
                                            setSelectedCategory(category);
                                            setDeleteOpen(true);

                                        }}
                                        categories={category}
                                    />
                                )) : <></>}
                        {loading ? <CategorySkeleton limit={10} /> : <></>}
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

    function mobileFilter() {
        return (
            <MobileFilterWrapper
                show={showFilter}
                onCancel={() => setShowFilter(false)}
                onSubmit={() => setShowFilter(false)}
            >
                <div className="">
                    <Input
                        placeholder={strings.Search}
                        value={search || ''}
                        icon={<SearchIcon className="text-mediumGray" />}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div><Select
                    value={orderFilter.find((oFilter) => oFilter.orderBy === orderBy && oFilter.orderDirection === orderDirection)?.key ?? orderFilter[orderFilter.length - 1].key}
                    onChange={(val) => {
                        const selectedFilter = orderFilter.find((oFilter) => oFilter.key === val);

                        if (selectedFilter && selectedFilter.orderBy) {
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
                    {statusFilter.map((filter) => <Select.Option value={filter.key} key={`list_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                </Select>
            </MobileFilterWrapper>
        )
    }
}


function CategorySkeleton({ limit }: { limit: number }) {
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
export default Categories;
