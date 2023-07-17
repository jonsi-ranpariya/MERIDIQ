import IconButton from '@components/form/IconButton';
import strings from '@lang/Lang';
import EyeIcon from '@partials/Icons/Eye';
import Table from '@partials/Table/PageTable';
import React from "react";
import api from "../../../../configs/api";
import { formatDate } from "../../../../helper";
import { ClientQuestionary } from "../../../../interfaces/model/clientQuestionary";
import DownloadIcon from "../../../../partials/Icons/Download";

export interface ClientQuestionaryListItemProps {
    questionary: ClientQuestionary
    onViewClick: (questionary: ClientQuestionary) => void
}

const ClientQuestionaryListItem: React.FC<ClientQuestionaryListItemProps> = ({
    questionary,
    onViewClick,
}) => {
    return (
        <tr>
            <Table.Td>
                <span className="py-2">{getQuestionnerTypeName(questionary)}</span>
            </Table.Td>
            <Table.Td>
                <span className="py-2">{formatDate(questionary?.created_at, "YYYY-MM-DD")}</span>
            </Table.Td>
            <Table.Td className="pl-0 pr-4 flex justify-end space-x-1">
                <IconButton className="focus:outline-none" onClick={() => onViewClick(questionary)}>
                    <EyeIcon />
                </IconButton>
                <a href={api.storageUrl(questionary.pdf)} download={`${questionary.created_at.replace(' ', '_')}`} target="_blank" rel="noreferrer">
                    <IconButton className="focus:outline-none">
                        <DownloadIcon />
                    </IconButton>
                </a>
            </Table.Td>
        </tr>
    );

}
export function getQuestionnerTypeName(value: ClientQuestionary) {
    if (value.modelable_type === "App\\AestheticInterest") {
        return strings.Aestethicinterest;
    }
    if (value.modelable_type === "App\\HealthQuestionary") {
        return strings.HealthQuestionnaire;
    }
    if (value.modelable_type === "App\\Covid19") {
        return strings.Covid19Questionnaire;
    }

    const name = value.modelable?.title
    return name && name.length ? name : strings.CustomQuestionnaire;
}


export default ClientQuestionaryListItem;