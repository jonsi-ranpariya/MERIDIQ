import IconButton from '@components/form/IconButton';
import * as React from 'react';
import { Questionary } from '../../../../../interfaces/model/questionary';
import AddRoundIcon from '../../../../../partials/Icons/AddRound';
import ListIcon from '../../../../../partials/Icons/List';
import PageTableTD from '../../../../../partials/Table/PageTableTD';

export interface ClientDynamicQuestionaryListItemProps {
    questionary: Questionary,
    onAddClick?: (data: Questionary) => void,
    onViewClick?: (data: Questionary) => void,
    onSignClick?: (data: Questionary) => void,
}

const ClientDynamicQuestionaryListItem: React.FC<ClientDynamicQuestionaryListItemProps> = ({
    questionary,
    onAddClick = () => {},
    onViewClick = () => {},
}) => {
    return (
        <tr className="">
            <PageTableTD className="py-2">
                <div className="flex pl-2 break-all">
                    <span className="">{questionary.title || '-'}</span>
                </div>
            </PageTableTD>
            <PageTableTD className="py-2">
                <div className="flex pl-2 break-all">
                    <span className="">{questionary.datas_count || '-'}</span>
                </div>
            </PageTableTD>
            <PageTableTD className="flex items-center justify-end">
                {!!questionary.datas_count &&
                    <IconButton onClick={() => onViewClick(questionary)}>
                        <ListIcon />
                    </IconButton>
                }
                <IconButton onClick={() => onAddClick(questionary)}>
                    <AddRoundIcon />
                </IconButton>
            </PageTableTD>
        </tr>
    );
}

export default ClientDynamicQuestionaryListItem;