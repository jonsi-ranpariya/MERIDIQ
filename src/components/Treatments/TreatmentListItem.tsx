import IconButton from '@components/form/IconButton';
import * as React from 'react';
import { Treatment } from '../../interfaces/model/treatment';
import EditIcon from "../../partials/Icons/Edit";
import PowerIcon from '../../partials/Icons/Power';

export interface TreatmentListItemProps {
    treatment: Treatment,
    onEditClick?: (data: Treatment) => void,
    onDeleteClick?: (data: Treatment) => void,
}

const TreatmentListItem: React.FC<TreatmentListItemProps> = ({
    treatment,
    onEditClick = () => { },
    onDeleteClick = () => { },
}) => {
    return (
        <>
            <tr >
                <td>
                    <p className={`break-all py-2 ${treatment.deleted_at ? "text-mediumGray" : ""} `}>{treatment.name}</p>
                </td>
                <td>
                    <div className="flex justify-end md:pr-2 space-x-1">
                        <IconButton onClick={() => onEditClick(treatment)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDeleteClick(treatment)}>
                            <PowerIcon slash={!treatment.deleted_at} />
                        </IconButton>
                    </div>
                </td>
            </tr>
        </>
    );
}

export default TreatmentListItem;