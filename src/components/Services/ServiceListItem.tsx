// import * as React from 'react';
import { Service } from '@interface/model/service';
import DeleteIcon from '@partials/Icons/Delete';
import EditIcon from '@partials/Icons/Edit';
import * as React from 'react';
import PowerIcon from '../../partials/Icons/Power';
import IconButton from '../form/IconButton';

export interface ClientListItemProps {
    onEditClick?: (data: Service) => void,
    services: Service,
    onDeleteClick?: (data: Service) => void,
    onDisableClick?: (data: Service) => void,
}

const ServiceListItem: React.FC<ClientListItemProps> = ({
    onEditClick = () => {},
    services,
    onDeleteClick = () => {},
    onDisableClick = () => {},
}) => {

    const editClick = () => onEditClick(services)
    // const listClick = () => onListClick(client)
    // const clientAccessClick = () => onClientAccessClick(client)
    const disableClick = () => onDisableClick(services)
    const deleteClick = () => onDeleteClick(services)
    return (
        <>
            <tr className="md:hidden">
                {mobileListItem()}
            </tr>
            <tr className="hidden md:table-row">
                {desktopListItem()}
            </tr>
        </>
    );

    function desktopListItem() {
        return (<>
            <td className='cursor-pointer'  >
                <div className="flex items-center space-x-2" >
                    <p className="font-medium text-left mr-2">{services.name}</p>
                </div>
            </td>
            <td><p className={`font-medium text-left mr-2 text-mediumGray`}>{services.category.name}</p></td>
            <td>
                <div className="flex text-primary space-x-0.5">
                    <IconButton onClick={editClick}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={disableClick}>
                        <PowerIcon />
                    </IconButton>
                    <IconButton onClick={deleteClick}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </td>
        </>)
    }
    function mobileListItem() {
        return (
            < >
                <td onClick={editClick}>
                    <div className="flex py-2 items-start space-x-3 ">
                        <div className="space-y-1">
                            <p className="font-medium text-left mr-2">{services.name}</p>
                            <p className={`text-sm break-all dark:text-gray-400 text-mediumGray `}>{services.category.name}</p>
                        </div>
                    </div>
                </td>
                <td >
                    <IconButton onClick={editClick}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={disableClick}>
                        <PowerIcon />
                    </IconButton>
                    <IconButton onClick={deleteClick}>
                        <DeleteIcon />
                    </IconButton>
                </td>
                {/* <td className=''>
                    <div className="flex py-2 items-start space-x-3">
                        <Avatar
                            className={`h-14 w-14 opacity-30`}
                        // src={client?.profile_picture ? api.storageUrl(client?.profile_picture) : undefined}
                        // alt={`${generateClientFullName(client)} ${strings.ProfilePicture}`}
                        />
                        <div className="space-y-1">
                            <p className="font-medium text-left mr-2">{services.service_name}</p>
                            <p className={`text-sm break-all dark:text-gray-400 text-mediumGray `}>{services.category}</p>
                            <div className="flex text-primary space-x-0.5">
                                <IconButton onClick={editClick}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={disableClick}>
                                    <PowerIcon />
                                </IconButton>
                                <IconButton onClick={deleteClick}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </td> */}
                {/* <td >
                    <div className="flex py-2 items-start space-x-3 ">
                        <Avatar
                            className={`h-14 w-14 opacity-30`}
                        // src={client?.profile_picture ? api.storageUrl(client?.profile_picture) : undefined}
                        // alt={`${generateClientFullName(client)} ${strings.ProfilePicture}`}
                        />
                        <div className="space-y-1">
                            <>
                                <td>
                                    <p className="font-medium text-left mr-2">{services.service_name}</p>
                                </td>
                            </>
                            <p className={`text-sm break-all dark:text-gray-400 text-mediumGray `}>{services.category}</p>
                        </div>
                    </div>
                </td>*/}
            </>
        )
    }
}

export default ServiceListItem;