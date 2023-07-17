import Avatar from "@components/avatar/Avatar";
import IconButton from "@components/form/IconButton";
import SuperUserIcon from "@icons/SuperUser";
import api from "../../../configs/api";
import { generateUserFullName, userRole } from "../../../helper";
import useAuth from "../../../hooks/useAuth";
import { User } from "../../../interfaces/model/user";
import strings from "../../../lang/Lang";
import DeleteIcon from "../../../partials/Icons/Delete";
import EditIcon from "../../../partials/Icons/Edit";
import PowerIcon from "../../../partials/Icons/Power";

export interface CompanyUserListItemProps {
    user: User,
    onEditClick?: (data: User) => void,
    onDeleteClick?: (data: User) => void,
    onRestoreClick?: (data: User) => void,
    onSuperUserClick?: (data: User) => void,
}

const CompanyUserListItem: React.FC<CompanyUserListItemProps> = ({
    user,
    onEditClick = () => {},
    onDeleteClick = () => {},
    onRestoreClick = () => {},
    onSuperUserClick = () => {},
}) => {
    const { user: authUser } = useAuth()

    const isAuthAdmin = authUser?.user_role === api.adminRole;
    const isAuthSuperUser = authUser?.email === authUser?.company?.email;

    const thisUserSuperUser = user?.email === authUser?.company?.email;
    const thisUserAdmin = user?.user_role === api.adminRole;
    const thisUserUser = user?.user_role === api.userRole;

    const showButtons = isAuthSuperUser ? true : isAuthAdmin && (thisUserUser || thisUserAdmin) && !thisUserSuperUser ? true : false;

    return (
        <tr key={`user_company_list_item_${user.id}`}>
            <td>
                <div className="py-2">
                    <div className="flex space-x-2 items-center">
                        <Avatar
                            className="h-12"
                            src={user?.profile_photo ? `${process.env.REACT_APP_STORAGE_PATH}/${user?.profile_photo}` : undefined}
                            alt={`${generateUserFullName(user)} ${strings.ProfilePicture}`}
                        />
                        <div className="">
                            <p className="font-medium">{generateUserFullName(user)}</p>
                            <p className="text-sm text-primary dark:text-primaryLight">{userRole(user)}</p>
                        </div>
                    </div>
                    <div className="md:hidden mt-1 space-x-1">
                        {buttons()}
                    </div>
                </div>
            </td>
            <td className="hidden md:block">
                <div className="py-2">
                    {buttons()}
                </div>
            </td>
        </tr>
    );

    function buttons() {
        if (!showButtons) return <></>
        return (
            <>
                <IconButton onClick={() => onEditClick(user)} children={<EditIcon />} />
                {
                    (!thisUserSuperUser && user.id !== authUser?.id) &&
                    <>
                        <IconButton onClick={() => onRestoreClick(user)} children={<PowerIcon slash={user.is_active} />} />
                        <IconButton onClick={() => onDeleteClick(user)} children={<DeleteIcon />} />
                    </>
                }
                {(isAuthSuperUser && !thisUserSuperUser && user.user_role === "admin") &&
                    <IconButton title="Convert to Super User" onClick={() => onSuperUserClick(user)} children={<SuperUserIcon />} />
                }
            </>
        )
    }
}

export default CompanyUserListItem;