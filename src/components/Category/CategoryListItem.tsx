import * as React from 'react'
import IconButton from '../form/IconButton';
import PowerIcon from '../../partials/Icons/Power';
import EditIcon from '@partials/Icons/Edit';
import { Category } from '@interface/model/category';

export interface ClientListItemProps {
    onEditClick?: (data: Category) => void,
    categories: Category,
    onDisableClick?: (data: Category) => void,
}

const CategoryListItem: React.FC<ClientListItemProps> = ({
    onEditClick = () => { },
    categories,
    onDisableClick = () => { },
}) => {

    const editClick = () => onEditClick(categories)
    const disableClick = () => onDisableClick(categories)
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
                    <p className="font-medium text-left mr-2">{categories.name}</p>
                </div>
            </td>
            <td>
                <div className="flex text-primary space-x-0.5">
                    <IconButton onClick={editClick}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={disableClick}>
                        <PowerIcon slash={categories?.is_active} />
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
                            <p className="font-medium text-left mr-2">{categories.name}</p>
                        </div>
                    </div>
                </td>
                <td >
                    <IconButton onClick={editClick}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={disableClick}>
                        <PowerIcon slash={categories.is_active} />
                    </IconButton>
                </td>
            </>
        )
    }
}

export default CategoryListItem;