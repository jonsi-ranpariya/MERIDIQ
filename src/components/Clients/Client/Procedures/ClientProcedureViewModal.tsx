import * as React from 'react';
import api from '../../../../configs/api';
import { formatDate, generateUserFullName, getUnitKeyToValue } from '../../../../helper';
import useAuth from '../../../../hooks/useAuth';
import { ClientTreatment } from '../../../../interfaces/model/clientTreatment';
import strings from '../../../../lang/Lang';
import Modal from '../../../../partials/MaterialModal/Modal';
import ViewModalTextItem from '../../../../partials/ViewModal/ViewModalTextItem';

export interface ClientProcedureViewModalProps {
    selectedClientTreatment?: ClientTreatment,
    openModal?: boolean,
    handleClose?: () => void,
}

const ClientProcedureViewModal: React.FC<ClientProcedureViewModalProps> = ({
    selectedClientTreatment,
    openModal = false,
    handleClose = () => {},
}) => {

    const { user } = useAuth();

    return (
        <Modal
            open={openModal}
            title={strings.Procedure}
            handleClose={handleClose}
        >
            <div className="p-4">
                <ViewModalTextItem
                    title={strings.DATE_OF_PROCEDURE}
                    value={selectedClientTreatment?.date}
                    showIfEmpty
                />
                <ViewModalTextItem
                    title={strings.Name}
                    value={selectedClientTreatment?.name}
                    showIfEmpty
                />
                <ViewModalTextItem
                    title={strings.total_cost}
                    value={`${getUnitKeyToValue(user?.company?.unit || '')} ${(selectedClientTreatment?.details || []).reduce((cost, treatment) => cost + parseFloat(treatment.actual_cost), 0)}`}
                />
                <ViewModalTextItem
                    title={strings.NOTES}
                    value={`${selectedClientTreatment?.notes_html ? selectedClientTreatment?.notes_html ?? '' : (selectedClientTreatment?.notes ?? '')}`}
                    html={true}
                    showIfEmpty
                />
                <ViewModalTextItem
                    title={strings.Signed_at}
                    show={!!selectedClientTreatment?.signed_at}
                    value={`${formatDate(selectedClientTreatment?.signed_at) || ''} ${strings.By} ${generateUserFullName(selectedClientTreatment?.signed_by)}`}
                />
                <ViewModalTextItem
                    title={strings.Treatments}
                    show={!!selectedClientTreatment?.details?.length}
                    value={selectedClientTreatment?.details?.map((treatment) => `${treatment.name} ${treatment.type === 'treatment' ? `(${getUnitKeyToValue(treatment.unit)} ${treatment.actual_cost})` : ''}`).join('\n')}
                />
                <ViewModalTextItem
                    title={strings.VerifiedSign}
                    show={!!selectedClientTreatment?.signed_at}
                    value={`${api.storage}${selectedClientTreatment?.sign}`}
                    image
                />
                <ViewModalTextItem
                    title='Pictures'
                    imagesArray={selectedClientTreatment?.images || []}
                />
            </div>
        </Modal>
    );
}

export default ClientProcedureViewModal;