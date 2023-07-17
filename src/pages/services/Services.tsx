import MobileFilterWrapper from '@components/filter/MobileFilterWrapper';
import Button from '@components/form/Button';
import Input from '@components/form/Input';
import Select from '@components/form/Select';
// import Pagination from '@components/form/Pagination';
// import Skeleton from '@components/Skeleton/Skeleton';
import FilterIcon from '@icons/Filter';
import SearchIcon from '@icons/Search';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
// import { toast } from 'react-toastify';
import Heading from '@components/heading/Heading';
import ServiceListItem from '@components/Services/ServiceListItem';
import { usePaginationSWR } from '@hooks/usePaginationSWR';
import { CategoryResponse, ServicePaginatedResponse } from '@interface/common';
import { Service } from '@interface/model/service';
import { useNavigate } from 'react-router';
import useSWR from 'swr';
import api from '../../configs/api';
import { commonFetch } from '../../helper';
import strings from '../../lang/Lang';
import AddRoundIcon from '../../partials/Icons/AddRound';
import Card from '../../partials/Paper/PagePaper';
import Table from '../../partials/Table/PageTable';


const ServiceDeleteModal = React.lazy(() => import('../../components/Services/ServiceDeleteModal'))
const ServiceModal = React.lazy(() => import('../../components/Services/ServiceModal'))

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


const Services: React.FC<ClientsProps> = () => {

    const orderFilter = [
        {
            text: strings.MostRecent,
            key: 'Most Recent',
            orderBy: 'recent',
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
        {
            text: strings.custom,
            key: 'custom',
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
    // const [restoreOpen, setRestoreOpen] = React.useState(false);
    // const [clientAccessModalOpen, setClientAccessModalOpen] = React.useState(false)
    const [defaultFilter] = React.useState<{ [value: string]: any }>({
        "withTrashed": 'null',
    });
    const [showFilter, setShowFilter] = React.useState(false);

    // const location = useLocation();

    // React.useEffect(() => {
    //     const requestSearch = location.search.split('search=')[1];
    //     setSearch(decodeURI(requestSearch || '') ?? '');
    // }, [location.search, setSearch])

    const [selectedService, setSelectedService] = React.useState<Service>();
    const { data: categoryData } = useSWR<CategoryResponse, Error>(api.category, commonFetch)
    const { error, data, mutate, filter, page, orderBy, setPage, loading, filterType, filterValue, orderDirection, orderData, filterData, search, setSearch, handleOrder } = usePaginationSWR<ServicePaginatedResponse, Error>(api.service, {
        orderBy: 'created_at',
        orderDirection: 'desc',
        filter: statusFilter[0].filter,
        filterType: statusFilter[0].filterType as any,
        filterValue: statusFilter[0].filterValue,
    });
    const navigate = useNavigate();

    return (
        <div className="">

            <ModalSuspense>
                {openModal &&
                    <ServiceModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                        selectedService={selectedService}
                        categoryData={categoryData}
                    />
                }
                <ServiceDeleteModal
                    open={deleteOpen}
                    handleClose={() => {
                        setDeleteOpen(false);
                    }}
                    // mutate={mutate}
                    selectedService={selectedService}
                />
            </ModalSuspense>

            <div className="flex justify-between items-center mb-4 lg:mb-0">
                <Heading variant="headingTitle" text={strings.services} />
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
                            // handleChange()
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
                                value={'' || ''}
                                icon={<SearchIcon className="text-mediumGray" />}
                                onChange={(event) => (event.target.value)}
                            />
                        </div>
                        <Select
                            value={orderFilter.find((oFilter) => oFilter.orderBy === "recent")?.key ?? orderFilter[orderFilter.length - 1].key}
                            onChange={(val) => {
                                const selectedFilter = orderFilter.find((oFilter) => oFilter.key === val);

                                if (selectedFilter && selectedFilter.orderBy) {
                                    // orderData(selectedFilter.orderBy, selectedFilter.orderDirection as OrderDirection);
                                }
                            }}
                            displayValue={(val) => orderFilter.find((oFilter) => oFilter.key === val)?.text}
                        >
                            {orderFilter.map((filter) => <Select.Option key={`order_filter_${filter.key}`} value={filter.key}>{filter.text}</Select.Option>)}
                        </Select>

                        <Select
                            value={statusFilter.find((oFilter) => oFilter.filter === "all")?.key}
                            onChange={(val) => {
                                const selectedFilter = statusFilter.find((oFilter) => oFilter.key === val);
                                if (selectedFilter) {
                                    // filterData(selectedFilter.filter, selectedFilter.filterType as FilterType, selectedFilter.filterValue);
                                }
                            }}
                            displayValue={(val) => statusFilter.find((oFilter) => oFilter.key === val)?.text}
                        >
                            {statusFilter.map((filter) => <Select.Option value={filter.key} key={`status_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                        </Select>
                        <Button
                            fullWidth
                            onClick={() => {
                                // toast.success('hahha')
                                // setSelectedClient(undefined);
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
                            children={strings.services}
                        />
                        <Table.ThSort
                            sort={orderBy === 'email' && orderDirection}
                            onClick={() => handleOrder('email')}
                            children={strings.category}
                        />
                        <Table.Th children="" />
                    </Table.Head>
                    <Table.Body>
                        <>
                            {data?.data
                                ?
                                data?.data.map((service, index) => {
                                    return (
                                        <ServiceListItem
                                            // key={`client_list_item_${client.id}`}
                                            onEditClick={() => navigate(`/services/${service?.id}`)}
                                            onDeleteClick={() => {
                                                // setSelectedService(service);
                                                setDeleteOpen(true);
                                            }}
                                            onDisableClick={() => {
                                                // setSelectedService(service);
                                                setDeleteOpen(true);

                                            }}
                                            services={service}
                                        />
                                    )
                                })
                                : <></>
                            }
                        </>
                        {/* {clientList ? <Clientskeleton limit={10} /> : <></>} */}
                    </Table.Body>
                </Table>
                {/* <Pagination
                    pageSize={data?.per_page}
                    totalCount={data?.total}
                    currentPage={page}
                    onPageChange={(page) => setPage(page)}
                /> */}
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
                        value={'' || ''}
                        icon={<SearchIcon className="text-mediumGray" />}
                        onChange={(event) => (event.target.value)}
                    />
                </div>
                <Select
                    value={orderFilter.find((oFilter) => oFilter.orderBy === "recent")?.key ?? orderFilter[orderFilter.length - 1].key}
                    onChange={(val) => {
                        const selectedFilter = orderFilter.find((oFilter) => oFilter.key === val);

                        if (selectedFilter && selectedFilter.orderBy) {
                            // orderData(selectedFilter.orderBy, selectedFilter.orderDirection as OrderDirection);
                        }
                    }}
                    displayValue={(val) => orderFilter.find((oFilter) => oFilter.key === val)?.text}
                >
                    {orderFilter.map((filter) => <Select.Option key={`order_filter_${filter.key}`} value={filter.key}>{filter.text}</Select.Option>)}
                </Select>

                <Select
                    value={statusFilter.find((oFilter) => oFilter.filter === "all")?.key}
                    onChange={(val) => {
                        const selectedFilter = statusFilter.find((oFilter) => oFilter.key === val);
                        if (selectedFilter) {
                            // filterData(selectedFilter.filter, selectedFilter.filterType as FilterType, selectedFilter.filterValue);
                        }
                    }}
                    displayValue={(val) => statusFilter.find((oFilter) => oFilter.key === val)?.text}
                >
                    {statusFilter.map((filter) => <Select.Option value={filter.key} key={`status_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                </Select>
            </MobileFilterWrapper>
        )
    }
}


// function Clientskeleton({ limit }: { limit: number }) {
//     return (
//         <>
//             {[...Array(limit)].map((_, index) => {
//                 return (
//                     <tr key={`loading_${index}`}>
//                         <td className="py-2">
//                             <div className="flex items-center">
//                                 <div className="mx-2">
//                                     <Skeleton variant="circular" className="h-10 w-10 block" />
//                                 </div>
//                                 <Skeleton className="h-10 mr-4 cursor-wait w-full" />
//                             </div>
//                         </td>
//                         <td>
//                             <div className="flex items-center">
//                                 <Skeleton className="h-10 mr-4 cursor-wait w-full" />
//                             </div>
//                         </td>
//                         <td>
//                             <div className="flex items-center">
//                                 <Skeleton className="h-10 mr-4 cursor-wait w-full" />
//                             </div>
//                         </td>
//                         <td className="flex">
//                             <Skeleton className="h-9 w-9 mx-1" variant="circular" />
//                         </td>
//                     </tr>
//                 );
//             })}
//         </>
//     );
// }

export default Services;
