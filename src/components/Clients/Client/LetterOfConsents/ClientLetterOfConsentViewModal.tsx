import * as React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import api from '../../../../configs/api';
import { commonFetch, formatDate, generateClientFullName, generateUserFullName } from '../../../../helper';
import { ClientResponse } from '../../../../interfaces/common';
import { ClientLetterOfConsent } from '../../../../interfaces/model/clientLetterOfConsent';
import strings from '../../../../lang/Lang';
import Checkbox from '../../../../partials/MaterialCheckbox/MaterialCheckbox';
import Modal from '../../../../partials/MaterialModal/Modal';
import ViewModalTextItem from '../../../../partials/ViewModal/ViewModalTextItem';

export interface ClientLetterOfConsentViewModalProps {
    selectedClientLetterOfConsent?: ClientLetterOfConsent,
    openModal?: boolean,
    handleClose?: () => void,
}

const ClientLetterOfConsentViewModal: React.FC<ClientLetterOfConsentViewModalProps> = ({
    selectedClientLetterOfConsent,
    openModal = false,
    handleClose = () => {},
}) => {
    const { clientId }: { clientId?: string } = useParams();

    const { data: client } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientId),
        commonFetch
    );

    const { data } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientId),
        commonFetch
    );

    return (
        <Modal
            open={openModal}
            title={strings.letter_of_consent}
            handleClose={handleClose}
        >
            <div className="p-4">
                <ViewModalTextItem
                    title={strings.TITLE}
                    value={selectedClientLetterOfConsent?.consent_title}
                />
                <ViewModalTextItem
                    title={strings.Are_we_allowed_to_publish_before_and_after_pictures}
                    value={
                        selectedClientLetterOfConsent?.is_publish_before_after_pictures === '1'
                            ? strings.Yes :
                            selectedClientLetterOfConsent?.is_publish_before_after_pictures === '0'
                                ? strings.No
                                : '-'
                    }
                />
                <ViewModalTextItem
                    title={strings.Signed_at}
                    show={!!selectedClientLetterOfConsent?.created_at}
                    value={`${formatDate(selectedClientLetterOfConsent?.created_at)} ${strings.By} ${generateClientFullName(data?.data)}`}
                />
                <ViewModalTextItem
                    title={strings.Sign}
                    show={!!selectedClientLetterOfConsent?.signature}
                    value={`${process.env.REACT_APP_STORAGE_PATH}/${selectedClientLetterOfConsent?.signature}`}
                    image
                />
                {
                    !selectedClientLetterOfConsent?.signature &&
                    <div className="mb-4">
                        <Checkbox
                            checked={true}
                            readOnly
                            name="consent_agreed"
                            label={strings.formatString(strings.i_accept_the_consent, generateClientFullName(client?.data)) as string}
                        />
                    </div>
                }
                <ViewModalTextItem
                    title={strings.VerifiedSignAt}
                    show={!!selectedClientLetterOfConsent?.verified_signed_at}
                    value={`${formatDate(selectedClientLetterOfConsent?.verified_signed_at) || ''} ${strings.By} ${generateUserFullName(selectedClientLetterOfConsent?.verified_signed_by)}`}
                />
                <ViewModalTextItem
                    title={strings.VerifiedSign}
                    show={!!selectedClientLetterOfConsent?.verified_sign}
                    value={`${process.env.REACT_APP_STORAGE_PATH}/${selectedClientLetterOfConsent?.verified_sign}`}
                    image
                />
                <ViewModalTextItem
                    title={strings.Information}
                    value={selectedClientLetterOfConsent?.letter}
                    show={!!selectedClientLetterOfConsent?.letter}
                    html
                />
            </div>
        </Modal>
    );
}

export default ClientLetterOfConsentViewModal;