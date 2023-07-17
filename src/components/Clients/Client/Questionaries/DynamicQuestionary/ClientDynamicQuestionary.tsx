import React from "react";
import { useNavigate, useParams } from "react-router";
import useSWR from "swr";
import api from "../../../../../configs/api";
import { commonFetch } from "../../../../../helper";
import { ClientResponse } from "../../../../../interfaces/common";
import strings from "../../../../../lang/Lang";
import HealthQuestionsIcon from "../../../../../partials/Icons/ClientProfile/HealthQuestions";
import ClientInfoItem from "../../ClientInfoItem";

export interface GeneralNotesComponentProps {

}

const ClientDynamicQuestionary: React.FC<GeneralNotesComponentProps> = () => {
    const { clientId }: { clientId?: string } = useParams();
    const { data, error } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientId),
        commonFetch
    );
    const loading = !data && !error;

    const navigate = useNavigate();

    // const [openModal, setOpenModal] = React.useState(false);
    return (
        <>
            <ClientInfoItem
                text={strings.CustomQuestionnaire}
                icon={<HealthQuestionsIcon />}
                loading={loading}
                onClick={() => {
                    navigate(`/clients/${clientId}/client-questionnaires`);
                }}
                onAddClick={() => {
                    // setOpenModal(true);
                }}
                count={data?.data?.questionaries_count || 0}
            />
        </>
    );
}

export default ClientDynamicQuestionary;