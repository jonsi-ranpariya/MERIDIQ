import ViewAllButton from "@components/form/ViewAllButton";
import { usePaginationSWR } from "@hooks/usePaginationSWR";
import { GeneralNote } from "@interface/model/generalNote";
import ModalSuspense from "@partials/Loadings/ModalLoading";
import { SectionLoading } from "@partials/Loadings/SectionLoading";
import Table from "@partials/Table/PageTable";
import PageTableBody from "@partials/Table/PageTableBody";
import PageTableHead from "@partials/Table/PageTableHead";
import PageTableTH from "@partials/Table/PageTableTH";
import PageTableTHSort from "@partials/Table/PageTableTHSort";
import React from "react";
import { useParams } from "react-router";
import api from "../../../../configs/api";
import { ClientGeneralNotesPaginatedResponse } from "../../../../interfaces/common";
import strings from "../../../../lang/Lang";
import ClientEmptyRecordView from "../ClientEmptyRecordView";
import ClientGeneralNoteListItem from "./ClientGeneralNoteListItem";

const ClientGeneralNoteModal = React.lazy(() => import('./ClientGeneralNoteModal'))
const ClientGeneralNoteSignModal = React.lazy(() => import('./ClientGeneralNoteSignModal'))
const ClientGeneralNoteViewModal = React.lazy(() => import('./ClientGeneralNoteViewModal'))

export interface GeneralNotesComponentProps {

}

const ClientGeneralNote: React.FC<GeneralNotesComponentProps> = () => {
    const { clientId }: { clientId?: string } = useParams();


    const { data,
        mutate,
        orderBy,
        loading,
        orderDirection,
        handleOrder,
    } = usePaginationSWR<ClientGeneralNotesPaginatedResponse, Error>(api.clientGeneralNotes.replace(':id', clientId!), {
        filter: 'important',
        filterType: '!=',
        filterValue: null,
        limit: 3,
    });

    const [openModal, setOpenModal] = React.useState(false);
    const [openSignModal, setOpenSignModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [selectedGeneralNote, setSelectedGeneralNote] = React.useState<GeneralNote>();

    if (loading) {
        return <SectionLoading />
    }

    if (data?.data.length === 0) {
        return <ClientEmptyRecordView />
    }

    return (
        <>
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
                                setSelectedGeneralNote(note)
                                setOpenSignModal(true)
                            }}
                            onEditClick={(note) => {
                                setSelectedGeneralNote(note)
                                setOpenModal(true)
                            }}
                            onViewClick={(note) => {
                                setSelectedGeneralNote(note)
                                setOpenViewModal(true)
                            }}
                        />
                    })}
                </PageTableBody>
            </Table>
            {
                data?.data.length !== 0 &&
                <ViewAllButton to={`/clients/${clientId}/general-notes`} />
            }
        </>
    );
}

export default ClientGeneralNote;