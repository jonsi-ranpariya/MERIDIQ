import IconButton from '@components/form/IconButton';
import * as React from 'react';
import api from "../../../configs/api";
import { QuestionaryQuestion } from "../../../interfaces/model/questionary";
import strings from "../../../lang/Lang";
import DeleteIcon from "../../../partials/Icons/Delete";
import EditIcon from "../../../partials/Icons/Edit";

export interface QuestionnaireQuestionListItemProps {
    question: QuestionaryQuestion,
    onEditClick?: (data: QuestionaryQuestion) => void,
    onDeleteClick?: (data: QuestionaryQuestion) => void,
}

const QuestionnaireQuestionListItem: React.FC<QuestionnaireQuestionListItemProps> = ({
    question,
    onEditClick = () => {},
    onDeleteClick = () => {},
}) => {

    return (
        <>
            <tr>
                <td>
                    <p className='py-3'>{question.question}</p>
                </td>
                <td>
                    <p>{question.order}</p>
                </td>
                <td>
                    <p>{api.questionTypes[question?.type]}</p>
                </td>
                <td>
                    <p>{question?.required ? strings.Yes : strings.No}</p>
                </td>
                <td className="flex justify-end space-x-0.5">
                    <IconButton onClick={() => onEditClick(question)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteClick(question)}>
                        <DeleteIcon />
                    </IconButton>
                </td>
            </tr>
        </>
    );
}

export default QuestionnaireQuestionListItem;