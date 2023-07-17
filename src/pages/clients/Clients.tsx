import MobileFilterWrapper from '@components/filter/MobileFilterWrapper';
import Button from '@components/form/Button';
import Input from '@components/form/Input';
import Pagination from '@components/form/Pagination';
import Select from '@components/form/Select';
import Skeleton from '@components/Skeleton/Skeleton';
import FilterIcon from '@icons/Filter';
import SearchIcon from '@icons/Search';
import CloseIcon from '@partials/Icons/Close';
import MergeIcon from '@partials/Icons/Merge';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import ClientListItem from '../../components/Clients/ClientListItem';
import Heading from '../../components/heading/Heading';
import api from '../../configs/api';
import { FilterType, OrderDirection, usePaginationSWR } from '../../hooks/usePaginationSWR';
import { ClientsPaginatedResponse } from '../../interfaces/common';
import { Client } from '../../interfaces/model/client';
import strings from '../../lang/Lang';
import AddRoundIcon from '../../partials/Icons/AddRound';
import Card from '../../partials/Paper/PagePaper';
import Table from '../../partials/Table/PageTable';

const ClientDeleteModal = React.lazy(() => import('../../components/Clients/ClientDeleteModal'))
const ClientModal = React.lazy(() => import('../../components/Clients/ClientModal'))
const ClientRestoreModal = React.lazy(() => import('../../components/Clients/ClientRestoreModal'))
const ClientAccessModal = React.lazy(() => import('@components/ClientAccess/ClientAccessModal'))
const ClientMergeAccountModal = React.lazy(() => import('@components/Clients/Client/Merge/ClientMergeAccount'));


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


const Clients: React.FC<ClientsProps> = () => {

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
            orderBy: 'last_name',
            orderDirection: 'asc'
        },
        {
            text: 'Z-A',
            key: 'order_by_za',
            orderBy: 'last_name',
            orderDirection: 'desc'
        },
        {
            text: strings.PendingSign,
            key: 'pending_sign',
            orderBy: 'pending_sign',
            orderDirection: 'desc'
        },
        {
            text: strings.custom,
            key: 'custom',
        },
    ];

    const statusFilter = [
        {
            text: strings.AllClients,
            key: 'all',
            filter: "",
            filterType: '=',
            filterValue: '',
        },
        {
            text: strings.MyClients,
            key: 'my',
            filter: 'my',
            filterType: '=',
            filterValue: null,
        },
    ];

    const listFilter = [
        {
            text: strings.All,
            key: 'all',
            filter: 'withTrashed',
            filterType: '=',
            filterValue: 'true',
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
            filterValue: "true",
        }
    ];

    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [restoreOpen, setRestoreOpen] = React.useState(false);
    const [merge, setMerge] = React.useState(false);
    const [openMergeModal, setOpenMergeModal] = React.useState(false);
    const [clientAccessModalOpen, setClientAccessModalOpen] = React.useState(false)
    const [clientListId, setClientLiistId] = React.useState<number[]>([]);
    const [defaultFilter, setDefaultFilter] = React.useState<{ [value: string]: any }>({
        "deleted_at": 'null',
    });
    const [showFilter, setShowFilter] = React.useState(false);

    const location = useLocation();

    const {
        error,
        data,
        mutate,
        filter,
        page,
        orderBy,
        setPage,
        loading,
        filterType,
        filterValue,
        orderDirection,
        orderData,
        handleOrder,
        filterData,
        search,
        setSearch,
    } = usePaginationSWR<ClientsPaginatedResponse, Error>(api.clients, {
        orderBy: 'created_at',
        orderDirection: 'desc',
        filter: "",
        filterType: '=',
        filterValue: '',
        defaultFilter: defaultFilter,
        // limit: 3,
    });

    React.useEffect(() => {
        const requestSearch = location.search.split('search=')[1];
        setSearch(decodeURI(requestSearch || '') ?? '');
    }, [location.search, setSearch])

    const [selectedClient, setSelectedClient] = React.useState<Client>();
    const navigate = useNavigate();
    function addOrRemoveClientId(id: number) {
        const arr = [...clientListId];
        if (arr.includes(id)) {
            arr.splice(arr.indexOf(id), 1);
            setClientLiistId(arr);
        } else if (clientListId.length >= 2) {
            toast.error('Only two clients are seleted')
        }
        else {
            arr.push(id);
            setClientLiistId(arr);
        }
    }
    
    React.useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return (
        <div className="">
            <ModalSuspense>
                {restoreOpen &&
                    <ClientRestoreModal
                        open={restoreOpen}
                        handleClose={() => setRestoreOpen(false)}
                        mutate={mutate}
                        selectedClient={selectedClient}
                    />
                }

                {deleteOpen &&
                    <ClientDeleteModal
                        open={deleteOpen}
                        handleClose={() => {
                            setDeleteOpen(false);
                        }}
                        mutate={mutate}
                        selectedClient={selectedClient}
                    />
                }

                {openModal &&
                    <ClientModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                        selectedClient={selectedClient}
                    />
                }
                {openMergeModal &&
                    <ClientMergeAccountModal
                        openModal={openMergeModal}
                        setOpenModal={setOpenMergeModal}
                        mutate={mutate}
                        clientLiistId={clientListId}
                    />
                }

                {(clientAccessModalOpen && selectedClient)
                    && <ClientAccessModal
                        openModal={clientAccessModalOpen}
                        setOpenModal={setClientAccessModalOpen}
                        selectedClient={selectedClient}
                    />
                }
            </ModalSuspense>
            <div className="flex justify-between items-center mb-4 lg:mb-0">
                {!merge &&
                    <Heading variant="headingTitle" text={strings.Clients} />
                }
                {merge &&
                    <p className='flex gap-2 items-center font-bold md:hidden'>{strings.formatString(strings.client_seleted, <span className='text-primary dark:text-primaryLight'> {clientListId.length}</span>) as string}</p>
                }
                <div className="lg:hidden flex space-x-2">
                    {!merge && <Button
                        onClick={() => {
                            setSelectedClient(undefined);
                            setOpenModal(true);
                        }}
                        size="small"
                    >
                        <div className="flex items-center">
                            <AddRoundIcon className="mr-1" />
                            {strings.add}
                        </div>
                    </Button>
                    }
                    {merge && <Button
                        size="small"
                        onClick={() => {
                            setShowFilter(false);
                            if (!merge) {
                                setMerge(true)
                            } else {
                                if (clientListId.length !== 2) {
                                    toast.error("Please at least maximum two clients selected");
                                    return;
                                }
                                setOpenMergeModal(true);
                            }
                        }}
                    >
                        <div className="flex items-center space-x-1">
                            <MergeIcon className="mr-1" />
                            <p>{strings.merge_clients}</p>
                        </div>
                    </Button>
                    }
                    {merge &&
                        <>
                            <Button
                                size="small"
                                onClick={() => {
                                    setMerge(false);
                                    setClientLiistId([])
                                }}
                            >
                                <div className="flex items-center space-x-1">
                                    {<CloseIcon />}
                                </div>
                            </Button>
                        </>
                    }
                    {!merge &&
                        <Button
                            size="small"
                            variant={'outlined'}
                            onClick={() => setShowFilter(true)}
                        >
                            <FilterIcon className='text-2xl text-primary' />
                        </Button>
                    }
                </div>
            </div>
            {mobileFilter()}
            <div className={`hidden lg:grid grid-flow-row grid-cols-1 gap-3 py-4 md:grid-cols-2 lg:grid-flow-row lg:grid-cols-4 lg:gap-x-6 xl:grid-flow-col xl:grid-cols-6`}>
                {
                    <>
                        {!merge &&
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
                                    {statusFilter.map((filter) => <Select.Option value={filter.key} key={`status_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                                </Select>

                                <Select
                                    value={listFilter.find((oFilter) => Object.keys(defaultFilter ?? {}).find((data: string) => data === oFilter.filter))?.key}
                                    onChange={(val) => {
                                        const selectedFilter = listFilter.find((oFilter) => oFilter.key === val);

                                        if (selectedFilter && selectedFilter?.filter) {
                                            setDefaultFilter({ [selectedFilter.filter]: selectedFilter?.filterValue });
                                        }
                                    }}
                                    displayValue={(val) => listFilter.find((oFilter) => oFilter.key === val)?.text}
                                >
                                    {listFilter.map((filter) => <Select.Option value={filter.key} key={`list_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                                </Select>
                            </>}
                        {merge && <>
                            <p className='flex gap-2 items-center font-extrabold  text-lg'>{strings.formatString(strings.client_seleted, <span className='text-primary dark:text-primaryLight'> {clientListId.length}</span>) as string}</p>
                            <div></div>
                            <div></div>
                            <div></div>
                        </>
                        }
                        <Button
                            fullWidth
                            onClick={() => {
                                if (!merge) {
                                    setMerge(true)
                                } else {
                                    if (clientListId.length !== 2) {
                                        toast.error("Please at least maximum two clients selected");
                                        return;
                                    }
                                    setOpenMergeModal(true);
                                }
                            }}
                        >
                            <div className="flex items-center space-x-1">
                                <MergeIcon className="mr-1" />
                                <p>{strings.merge_clients}</p>
                            </div>
                        </Button>
                        {!merge &&
                            <Button
                                fullWidth
                                onClick={() => {
                                    setSelectedClient(undefined);
                                    setOpenModal(true);
                                }}
                            >
                                <div className="flex items-center">
                                    <AddRoundIcon className="mr-1" />
                                    {strings.add}
                                </div>
                            </Button>
                        }

                        {merge &&
                            <>
                                <Button
                                    fullWidth
                                    onClick={() => {
                                        setMerge(false);
                                        setClientLiistId([])
                                    }}
                                >
                                    <div className="flex items-center space-x-1">
                                        {<CloseIcon />}
                                        <p>{strings.close_merge}</p>
                                    </div>
                                </Button>
                            </>
                        }
                    </>
                }
            </div>

            <Card>
                <Table>
                    <Table.Head>
                        <Table.ThSort
                            sort={orderBy === 'last_name' && orderDirection}
                            onClick={() => handleOrder('last_name')}
                            children={strings.client_name}
                        />
                        <Table.ThSort
                            sort={orderBy === 'email' && orderDirection}
                            onClick={() => handleOrder('email')}
                            children={strings.Email}
                        />
                        <Table.ThSort
                            sort={orderBy === 'phone_number' && orderDirection}
                            onClick={() => handleOrder('phone_number')}
                            children={strings.Date}
                        />
                        <Table.Th children="" />
                    </Table.Head>
                    <Table.Body>
                        {data
                            && data.status === '1'
                            ? data.data.map((client) => {
                                return <ClientListItem
                                    key={`client_list_item_${client.id}`}
                                    onEditClick={() => navigate(`/clients/${client?.id}`)}
                                    onDeleteClick={() => {
                                        setSelectedClient(client);
                                        setDeleteOpen(true);
                                    }}
                                    onRestoreClick={() => {
                                        setSelectedClient(client);
                                        setRestoreOpen(true);
                                    }}
                                    onClientAccessClick={() => {
                                        setSelectedClient(client)
                                        setClientAccessModalOpen(true)
                                    }}
                                    onClientMergeClick={() => {
                                        addOrRemoveClientId(client.id)
                                    }}
                                    onListClick={() => navigate(`/clients/${client.id}/logs`)}
                                    client={client}
                                    merge={merge}
                                    clientLiistId={clientListId}
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
                    {statusFilter.map((filter) => <Select.Option value={filter.key} key={`status_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                </Select>

                <Select
                    value={listFilter.find((oFilter) => Object.keys(defaultFilter ?? {}).find((data: string) => data === oFilter.filter))?.key}
                    onChange={(val) => {
                        const selectedFilter = listFilter.find((oFilter) => oFilter.key === val);

                        if (selectedFilter && selectedFilter?.filter) {
                            setDefaultFilter({ [selectedFilter.filter]: selectedFilter?.filterValue });
                        }
                    }}
                    displayValue={(val) => listFilter.find((oFilter) => oFilter.key === val)?.text}
                >
                    {listFilter.map((filter) => <Select.Option value={filter.key} key={`list_filter_${filter.key}`}>{filter.text}</Select.Option>)}
                </Select>
                <Button
                    size="small"
                    onClick={() => {
                        setShowFilter(false);
                        if (!merge) {
                            setMerge(true)
                        } else {
                            if (clientListId.length !== 2) {
                                toast.error("Please at least maximum two clients selected");
                                return;
                            }
                            setOpenMergeModal(true);
                        }
                    }}
                >
                    <div className="flex items-center space-x-1">
                        <MergeIcon className="mr-1" />
                        <p>{strings.merge_clients}</p>
                    </div>
                </Button>
            </MobileFilterWrapper>
        )
    }
}


function Clientskeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((_, index) => {
                return (
                    <tr key={`loading_${index}`}>
                        <td className="py-2">
                            <div className="flex items-center">
                                <div className="mx-2">
                                    <Skeleton variant="circular" className="h-10 w-10 block" />
                                </div>
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

export default Clients;