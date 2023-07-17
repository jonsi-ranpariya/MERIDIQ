import IconButton from '@components/form/IconButton';
import * as React from 'react';
import { Template } from '../../interfaces/model/template';
import DeleteIcon from "../../partials/Icons/Delete";
import EditIcon from "../../partials/Icons/Edit";
import PowerIcon from '../../partials/Icons/Power';

export interface TemplateListItemProps {
    template: Template,
    onEditClick?: (data: Template) => void,
    onDeleteClick?: (data: Template) => void,
}

const TemplateListItem: React.FC<TemplateListItemProps> = ({
    template,
    onEditClick = () => { },
    onDeleteClick = () => { },
}) => {

    return (
        <>
            <tr>
                <td>
                    <p className={`break-all py-2 ${template.deleted_at ? "text-mediumGray" : ""} `}>{template.name}</p>
                </td>
                <td>
                    <div className="flex justify-end md:pr-2 space-x-1">
                        {template.is_editable
                            ? <>
                                <IconButton onClick={() => onEditClick(template)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDeleteClick(template)} >
                                    <DeleteIcon />
                                </IconButton>
                            </>
                            : <IconButton onClick={() => onDeleteClick(template)}>
                                <PowerIcon className="text-xl" slash={!template.deleted_at} />
                            </IconButton>
                        }
                    </div>
                </td>
            </tr>
        </>
    );
}

export default TemplateListItem;