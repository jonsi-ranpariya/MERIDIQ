import IconButton from '@components/form/IconButton';
import * as React from 'react';
import { useNavigate } from "react-router";
import { Questionary } from "../../interfaces/model/questionary";
import DeleteIcon from "../../partials/Icons/Delete";
import EditIcon from "../../partials/Icons/Edit";
import ListIcon from "../../partials/Icons/List";

export interface QuestionnaireListItemProps {
    questionnaire: Questionary,
    onEditClick?: (data: Questionary) => void,
    onDeleteClick?: (data: Questionary) => void,
}

const QuestionnaireListItem: React.FC<QuestionnaireListItemProps> = ({
    questionnaire,
    onEditClick = () => {},
    onDeleteClick = () => {},
}) => {

    const navigate = useNavigate();

    return (
        <>
            <tr className="">
                <td>
                    <div className="flex py-3 break-all">
                        <span className="">{questionnaire.title}</span>
                    </div>
                </td>
                <td className="flex justify-end space-x-0.5 text-primary">
                    <IconButton onClick={() => onEditClick(questionnaire)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/questionnaires/${questionnaire?.id}/questions`)}>
                        <ListIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteClick(questionnaire)}>
                        <DeleteIcon />
                    </IconButton>
                </td>
            </tr>
        </>
    );
}

export default QuestionnaireListItem;