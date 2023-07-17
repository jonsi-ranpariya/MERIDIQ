import AddButton from "@components/form/AddButton";
import api from "@configs/api";
import { usePaginationSWR } from "@hooks/usePaginationSWR";
import NoteIcon from "@icons/Note";
import { ClientGeneralNotesPaginatedResponse, ClientLetterOfConsentPaginatedResponse } from "@interface/common";
import strings from "@lang/Lang";
import CustomShowText from "@partials/Error/CustomShowText";
import ModalSuspense from "@partials/Loadings/ModalLoading";
import React from "react";
import { useParams } from "react-router";


const ClientGeneralNoteModal = React.lazy(() => import('./GeneralNotes/ClientGeneralNoteModal'))
const ClientLetterOfConsentModal = React.lazy(() => import('./LetterOfConsents/ClientLetterOfConsentModal'))
const ClientMainCardAddModal = React.lazy(() => import('./sections/MainCardAddModal'))

export interface ClientEmptyRecordViewProps {

}

const ClientEmptyRecordView: React.FC<ClientEmptyRecordViewProps> = () => {
    const { clientId }: { clientId?: string } = useParams();

    const [openAddModal, setOpenAddModal] = React.useState(false)
    const [openGeneralNote, setopenGeneralNote] = React.useState(false)
    const [OpenLoC, setOpenLoC] = React.useState(false)
    const { mutate: generalNotesMutate } = usePaginationSWR<ClientGeneralNotesPaginatedResponse, Error>(
        openGeneralNote && clientId ? api.clientGeneralNotes.replace(':id', clientId) : null,
        { filter: 'important', filterType: '!=', filterValue: null, limit: 3, }
    );
    const { mutate: LOCMutate } = usePaginationSWR<ClientLetterOfConsentPaginatedResponse, Error>(!OpenLoC ? null : api.clientLetterOfConsents(clientId), {
        limit: 3
    });
    return (
        <>
            <ModalSuspense>
                {openAddModal &&
                    <ClientMainCardAddModal
                        openModal={openAddModal}
                        key={"main_modal"}
                        handleClose={() => setOpenAddModal(false)}
                        onLoCClick={() => { setOpenAddModal(false); setTimeout(() => setOpenLoC(true), 100) }}
                        onGeneralNotesClick={() => { setOpenAddModal(false); setTimeout(() => setopenGeneralNote(true), 100) }}
                    />
                }
                {openGeneralNote &&
                    <ClientGeneralNoteModal
                        key={`general_modal`}
                        openModal={openGeneralNote}
                        setOpenModal={setopenGeneralNote}
                        mutate={generalNotesMutate} />
                }
                {OpenLoC &&
                    <ClientLetterOfConsentModal
                        key={`loc_modal`}
                        openModal={OpenLoC}
                        setOpenModal={setOpenLoC}
                        mutate={LOCMutate} />
                }

            </ModalSuspense>
            <CustomShowText text={strings.note_records} icon={<NoteIcon />} >
                <AddButton onClick={() => setOpenAddModal(true)} />
            </CustomShowText>
        </>
    )
}

export default ClientEmptyRecordView;