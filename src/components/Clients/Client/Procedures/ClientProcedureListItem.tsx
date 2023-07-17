import IconButton from "@components/form/IconButton";
import SignIcon from "@icons/Sign";
import CopyIcon from "@icons/Copy";
import React from "react";
import { generateUserFullName } from "../../../../helper";
import { ClientTreatment } from "../../../../interfaces/model/clientTreatment";
import strings from "../../../../lang/Lang";
import PageTableTD from "../../../../partials/Table/PageTableTD";
import Table from "@partials/Table/PageTable";
import EditIcon from "@partials/Icons/Edit";
import EyeIcon from "@partials/Icons/Eye";

export interface ClientProcedureListItemProps {
    procedure: ClientTreatment
    onEditClick?: (data: ClientTreatment) => void,
    onViewClick?: (data: ClientTreatment) => void,
    onSignClick?: (data: ClientTreatment) => void,
    onCopyClick?: (data: ClientTreatment) => void,
}

const ClientProcedureListItem: React.FC<ClientProcedureListItemProps> = ({
    procedure,
    onEditClick = () => { },
    onViewClick = () => { },
    onSignClick = () => { },
    onCopyClick = () => { },
}) => {

    function onClick() {
        if (procedure?.signed_at) {
            onViewClick(procedure);
            return
        }
        onEditClick(procedure);
    }

    return (
        <>
            <tr className="md:hidden">
                {mobileListItem()}
            </tr>
            <tr className="hidden md:table-row hover:bg-primary/5">
                {desktopListItem()}
            </tr>
        </>

    );

    function desktopListItem() {
        return (
            <>
                <Table.Td className="py-2">
                    <button className="w-full text-left" onClick={onClick}>
                        <p>{procedure.name || '-'}</p>
                    </button>
                </Table.Td>
                <Table.Td>
                    <p className="break-all">{procedure.date || '-'}</p>
                </Table.Td>
                <Table.Td>
                    <p className="break-all">{generateUserFullName(procedure.user)}</p>
                </Table.Td>
                <Table.Td>
                    <p className={`text-sm uppercase ${procedure?.signed_at ? "" : 'text-error'}`}>{procedure?.signed_at ? strings.Signed : strings.unsigned}</p>
                </Table.Td>
                <Table.Td>
                    <div className="items-center flex justify-end pr-4 space-x-0.5">
                        {!procedure?.signed_at ? <IconButton onClick={() => onSignClick(procedure)} children={<SignIcon />} /> : <></>}
                        <IconButton onClick={() => onViewClick(procedure)}>
                            <EyeIcon />
                        </IconButton>
                        <IconButton onClick={() => onCopyClick(procedure)} children={<CopyIcon />} />
                    </div>
                </Table.Td>
            </>
        );
    }

    function mobileListItem() {
        return (
            <PageTableTD>
                <div className="py-2">
                    <p className={`text-xs uppercase ${procedure?.signed_at ? "" : 'text-error'}`}>{procedure?.signed_at ? strings.Signed : strings.unsigned}</p>
                    <p>{procedure.name || '-'}</p>
                    <p className="break-all flex justify-between mt-1">
                        <span className="text-xs text-mediumGray">{strings.Changed_by} {generateUserFullName(procedure.user)}</span>
                        <span className="text-xs font-medium">{procedure.date || '-'}</span>
                    </p>
                    <div className="items-center flex space-x-0.5 mt-1">
                        {!procedure?.signed_at ? <IconButton onClick={onClick} children={<EditIcon />} /> : <></>}
                        <IconButton onClick={() => onViewClick(procedure)}>
                            <EyeIcon />
                        </IconButton>
                        {!procedure?.signed_at ? <IconButton onClick={() => onSignClick(procedure)} children={<SignIcon />} /> : <></>}
                        <IconButton onClick={() => onCopyClick(procedure)} children={<CopyIcon />} />
                    </div>
                </div>
            </PageTableTD>
        )
    }

}

export default ClientProcedureListItem;