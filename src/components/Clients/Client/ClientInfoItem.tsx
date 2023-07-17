import Skeleton from '@components/Skeleton/Skeleton';
import * as React from 'react';
import { nFormatter } from '../../../helper';
import strings from '../../../lang/Lang';
import AddRoundIcon from '../../../partials/Icons/AddRound';
import Button from '@components/form/Button';
import Card from '../../../partials/Paper/PagePaper';

export interface ClientInfoItemProps {
    text: string
    icon: React.ReactChild
    addText?: string
    onClick?: () => void
    addIcon?: boolean
    count?: number
    loading?: boolean
    onAddClick?: () => void
    showAlert?: boolean
}

const ClientInfoItem: React.FC<ClientInfoItemProps> = ({
    text = '',
    icon,
    onClick = () => {},
    addIcon = false,
    count = 0,
    onAddClick = () => {},
    loading = false,
    addText,
    showAlert = false,
}) => {
    if (loading)
        return <Skeleton
            variant="rectangular"
            className="rounded h-24"
        />
    return (
        <Card className="p-4 relative text-left shadow cursor-pointer hover:shadow-xl flex items-center">
            <div className="text-6xl dark:text-gray-300">
                {icon}
            </div>
            <div className="ml-4 flex-grow">
                <p className="text-xl flex items-center font-medium text-dark dark:text-gray-200" key={text}>
                    {text}
                </p>
                <div className="flex justify-between">
                    {
                        count
                            ? <p className="text-3xl font-bold dark:text-gray-200">{nFormatter(count)}</p>
                            : <span></span>
                    }
                    {
                        addIcon
                            ? <Button
                                // size="medium"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onAddClick();
                                }}
                            >
                                <AddRoundIcon className="mr-2" />
                                {addText || strings.New}
                            </Button>
                            : ''
                    }
                </div>
            </div>
        </Card>
    );
}

export default ClientInfoItem;