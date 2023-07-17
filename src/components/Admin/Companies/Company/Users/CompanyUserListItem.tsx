import Avatar from "@components/avatar/Avatar";
import IconButton from "@components/form/IconButton";
import { generateUserFullName, userRole } from "../../../../../helper";
import { User } from "../../../../../interfaces/model/user";
import strings from "../../../../../lang/Lang";
import DeleteIcon from "../../../../../partials/Icons/Delete";
import EditIcon from "../../../../../partials/Icons/Edit";

export interface CompanyUserListItemProps {
    user: User,
    onEditClick?: (data: User) => void,
    onDeleteClick?: (data: User) => void,
    disableDelete?: boolean,
}

const CompanyUserListItem: React.FC<CompanyUserListItemProps> = ({
    user,
    onEditClick = () => {},
    disableDelete = false,
    onDeleteClick = () => {},
}) => {
    return (
        <tr>
            <td className="py-2">
                <div className="flex space-x-2 items-center py-2">
                    <Avatar
                        className='h-12 w-12'
                        src={user?.profile_photo ? `${process.env.REACT_APP_STORAGE_PATH}/${user?.profile_photo}` : undefined}
                        alt={`${generateUserFullName(user)} ${strings.ProfilePicture}`}
                    />
                    <div className="">
                        <p className="font-medium">{generateUserFullName(user)}</p>
                        <p className="text-sm text-primary dark:text-primary">{userRole(user)}</p>
                    </div>
                </div>
            </td>
            <td>
                <IconButton onClick={() => { onEditClick(user); }}>
                    <EditIcon />
                </IconButton>
                {
                    !disableDelete &&
                    <IconButton onClick={() => { if (disableDelete) return; onDeleteClick(user); }}>
                        <DeleteIcon />
                    </IconButton>
                }
            </td>
        </tr>
    );
}

export default CompanyUserListItem;