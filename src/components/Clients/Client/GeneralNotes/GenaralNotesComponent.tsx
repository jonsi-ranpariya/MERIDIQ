import React from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import api from "../../../../configs/api";
import { commonFetch } from "../../../../helper";
import { ClientResponse } from "../../../../interfaces/common";
import strings from "../../../../lang/Lang";
import GeneralNoteIcon from "../../../../partials/Icons/ClientProfile/GeneralNote";
import ClientInfoItem from "../ClientInfoItem";
import ClientGeneralNotesModal from "./ClientGeneralNoteModal";

export interface GeneralNotesComponentProps {

}

const ClientGeneralNote: React.FC<GeneralNotesComponentProps> = () => {
    const { clientId }: { clientId?: string } = useParams();
    const { data, error, mutate } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientId),
        commonFetch
    );
    const loading = !data && !error;

    const [openModal, setOpenModal] = React.useState(false);
    return (
        <>
            <ClientGeneralNotesModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                selectedGeneralNote={undefined}
                mutate={mutate}
            />
            <ClientInfoItem
                text={strings.GeneralNotes}
                icon={<GeneralNoteIcon />}
                addIcon
                loading={loading}
                count={data?.data.general_notes_count || 0}
            />
        </>
    );
}

export default ClientGeneralNote;