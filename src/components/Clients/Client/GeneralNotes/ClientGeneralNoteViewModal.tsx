import * as React from 'react';
import { formatDate, generateUserFullName } from '../../../../helper';
import { GeneralNote } from '../../../../interfaces/model/generalNote';
import strings from '../../../../lang/Lang';
import Modal from '../../../../partials/MaterialModal/Modal';
import ViewModalTextItem from '../../../../partials/ViewModal/ViewModalTextItem';

export interface ClientGeneralNoteViewModalProps {
    selectedGeneralNote?: GeneralNote,
    openModal?: boolean,
    handleClose?: () => void,
}

const ClientGeneralNoteViewModal: React.FC<ClientGeneralNoteViewModalProps> = ({
    selectedGeneralNote,
    openModal = false,
    handleClose = () => {},
}) => {

    return (
        <Modal
            open={openModal}
            title={strings.general_note}
            handleClose={handleClose}
        >
            <div className="p-4">
                <ViewModalTextItem title={strings.TITLE} value={selectedGeneralNote?.title} />
                <ViewModalTextItem title={strings.NOTES} value={`${selectedGeneralNote?.notes_html ? selectedGeneralNote?.notes_html ?? '' : (selectedGeneralNote?.notes ?? '')}`} html={true} />
                <ViewModalTextItem title={strings.created_at} value={formatDate(selectedGeneralNote?.created_at)} />
                <ViewModalTextItem title={strings.file} value={selectedGeneralNote?.filename} />
                <ViewModalTextItem title={strings.Signed_at} show={!!selectedGeneralNote?.signed_at} value={formatDate(selectedGeneralNote?.signed_at)} />
                <ViewModalTextItem title={strings.Signed_by} show={!!selectedGeneralNote?.signed_at} value={generateUserFullName(selectedGeneralNote?.signed_by)} />
                <ViewModalTextItem title={strings.Sign} show={!!selectedGeneralNote?.signed_at} value={`${process.env.REACT_APP_STORAGE_PATH}/${selectedGeneralNote?.sign}`} image />
            </div>
        </Modal >
    );
}

export default ClientGeneralNoteViewModal;