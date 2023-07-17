import IconButton from '@components/form/IconButton';
import { LetterOfConsent } from "../../interfaces/model/letterOfConsent";
import EditIcon from "../../partials/Icons/Edit";
import PowerIcon from "../../partials/Icons/Power";

export interface LetterOfConstentListItemProps {
    letter: LetterOfConsent
    onEditClick?: (data: LetterOfConsent) => void,
    onDeleteClick?: (data: LetterOfConsent) => void,
}

const LetterOfConstentListItem: React.FC<LetterOfConstentListItemProps> = ({
    letter,
    onEditClick = () => { },
    onDeleteClick = () => { },
}) => {
    return (
        <tr>
            <td>
                <p className={`break-all py-3 ${letter.deleted_at ? "text-mediumGray" : ""} `}>{letter.consent_title}</p>
            </td>
            <td>
                <div className="flex justify-end space-x-2">
                    <IconButton onClick={() => onEditClick(letter)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteClick(letter)}>
                        <PowerIcon slash={!letter.deleted_at} />
                    </IconButton>
                </div>
            </td>
        </tr>
    );
}

export default LetterOfConstentListItem;