import Pagination from '@components/form/Pagination';
import Select from '@components/form/Select';
import Heading from '@components/heading/Heading';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import { useParams } from 'react-router';
import api from '../../../../configs/api';
import { FilterType, usePaginationSWR } from '../../../../hooks/usePaginationSWR';
import { ClientGeneralNotesPaginatedResponse } from '../../../../interfaces/common';
import { GeneralNote } from '../../../../interfaces/model/generalNote';
import strings from '../../../../lang/Lang';
import FullPageError from '../../../../partials/Error/FullPageError';
import Card from '../../../../partials/Paper/PagePaper';
import Table from '../../../../partials/Table/PageTable';
import PageTableBody from '../../../../partials/Table/PageTableBody';
import PageTableHead from '../../../../partials/Table/PageTableHead';
import PageTableTH from '../../../../partials/Table/PageTableTH';
import PageTableTHSort from '../../../../partials/Table/PageTableTHSort';
import BackToClientDashboard from '../sections/BackToClientDashboard';
import ClientGeneralNoteListItem from './ClientGeneralNoteListItem';

const ClientGeneralNoteModal = React.lazy(() => import('./ClientGeneralNoteModal'))
const ClientGeneralNoteSignModal = React.lazy(() => import('./ClientGeneralNoteSignModal'))
const ClientGeneralNoteViewModal = React.lazy(() => import('./ClientGeneralNoteViewModal'))

export interface ClientGeneralNotesProps {

}


const ClientGeneralNotes: React.FC<ClientGeneralNotesProps> = () => {
    const statusFilter = [{
        text: strings.All,
        key: 'all',
        filter: 'important',
        filterType: '!=',
        filterValue: null,
    }, {
        text: strings.important,
        key: 'important',
        filter: 'important',
        filterType: '=',
        filterValue: '1',
    }, {
        text: strings.not_important,
        key: 'not_important',
        filter: 'important',
        filterType: '!=',
        filterValue: '1',
    },];

    const { clientId }: { clientId?: string } = useParams();

    const { data,
        page,
        setPage,
        error,
        filter,
        mutate,
        filterType,
        filterValue,
        filterData,
        orderBy,
        orderDirection,
        handleOrder,
    } = usePaginationSWR<ClientGeneralNotesPaginatedResponse, Error>(api.clientGeneralNotes.replace(':id', clientId!), {
        filter: 'important',
        filterType: '!=',
        filterValue: null,
    });
    const [openModal, setOpenModal] = React.useState(false);
    const [openSignModal, setOpenSignModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [selectedGeneralNote, setSelectedGeneralNote] = React.useState<GeneralNote>();

    if (error) {
        return <FullPageError code={error?.status || 500} message={error.message || 'server error'} />
    }

    return (
        <div className="">
            <ModalSuspense>
                {openModal &&
                    <ClientGeneralNoteModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                        selectedGeneralNote={selectedGeneralNote}
                    />
                }
                {openViewModal &&
                    <ClientGeneralNoteViewModal
                        openModal={openViewModal}
                        handleClose={() => {
                            setOpenViewModal(false);
                            setSelectedGeneralNote(undefined);
                        }}
                        selectedGeneralNote={selectedGeneralNote}
                    />
                }
                {openSignModal &&
                    <ClientGeneralNoteSignModal
                        openModal={openSignModal}
                        setOpenModal={setOpenSignModal}
                        mutate={mutate}
                        selectedGeneralNote={selectedGeneralNote}
                    />
                }
            </ModalSuspense>
            <BackToClientDashboard />
            <Heading text={strings.GeneralNotes} variant="bigTitle" className='mb-4' />
            <Card>
                <div className="grid grid-flow-row grid-cols-1 gap-3 md:grid-cols-2 lg:grid-flow-row lg:grid-cols-4 lg:gap-x-6 xl:grid-flow-col xl:grid-cols-5 mb-4">
                    <Select
                        displayValue={(val) => statusFilter.find((v) => v.key === val)?.text ?? ""}
                        onChange={(e) => {
                            const selectedFilter = statusFilter.find((oFilter) => oFilter.key === e);
                            if (selectedFilter && selectedFilter.filter) {
                                filterData(selectedFilter.filter, selectedFilter.filterType as FilterType, selectedFilter.filterValue);
                            }
                        }}
                        value={statusFilter.find((oFilter) => oFilter.filter === filter && oFilter.filterType === filterType && oFilter.filterValue === filterValue)?.key}
                    >
                        {statusFilter.map((filter) => <Select.Option value={filter.key} key={filter.key}>{filter.text}</Select.Option>)}
                    </Select>
                </div>
                <Table>
                    <PageTableHead>
                        <PageTableTHSort
                            sort={orderBy === 'title' && orderDirection}
                            onClick={() => handleOrder('title')}
                            children={strings.TITLE}
                        />
                        <PageTableTHSort
                            sort={orderBy === 'created_at' && orderDirection}
                            onClick={() => handleOrder('created_at')}
                            children={strings.Date}
                        />
                        <PageTableTHSort
                            sort={orderBy === 'filename' && orderDirection}
                            onClick={() => handleOrder('filename')}
                            children={strings.file}
                        />
                        <PageTableTHSort
                            sort={orderBy === 'signed_at' && orderDirection}
                            onClick={() => handleOrder('signed_at')}
                            children={strings.status}
                        />
                        <PageTableTH />
                    </PageTableHead>
                    <PageTableBody>
                        {data?.data.map((note) => {
                            return <ClientGeneralNoteListItem
                                key={note.id}
                                note={note}
                                onSignClick={() => {
                                    setSelectedGeneralNote(note);
                                    setOpenSignModal(true);
                                }}
                                onEditClick={(note) => {
                                    setSelectedGeneralNote(note);
                                    setOpenModal(true);
                                }}
                                onViewClick={(note) => {
                                    setSelectedGeneralNote(note);
                                    setOpenViewModal(true);
                                }}
                            />
                        })}
                    </PageTableBody>
                </Table>
                <Pagination
                    pageSize={data?.per_page ?? 0}
                    totalCount={data?.total ?? 0}
                    currentPage={page}
                    onPageChange={(page) => setPage(page)}
                />
            </Card>
        </div>
    );
}

export default ClientGeneralNotes;