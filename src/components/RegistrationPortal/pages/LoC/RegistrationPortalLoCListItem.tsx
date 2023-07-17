import IconButton from '@components/form/IconButton';
import * as React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import api from '../../../../configs/api';
import { commonFetch } from '../../../../helper';
import { LetterOfConsentResponse } from '../../../../interfaces/common';
import { LetterOfConsent } from '../../../../interfaces/model/letterOfConsent';
import DeleteIcon from '../../../../partials/Icons/Delete';

export interface RegistrationPortalLoCListItemProps {
    letterId: number,
    onDeleteClick?: (letter: LetterOfConsent) => void,
}

const RegistrationPortalLoCListItem: React.FC<RegistrationPortalLoCListItemProps> = ({
    letterId,
    onDeleteClick = () => {}
}) => {
    const { companyId }: { companyId?: string } = useParams();
    const { data } = useSWR<LetterOfConsentResponse, Error>(api.letterOfConsentPublic.replace(':companyId', companyId!), commonFetch);
    const selectedLetter = data?.data?.find((letter) => letter.id === letterId);

    return (
        <div className="border rounded flex items-center break-words">
            <p className="flex-grow pl-4 font-semibold">{selectedLetter?.consent_title || ''}</p>
            <IconButton onClick={() => selectedLetter ? onDeleteClick(selectedLetter) : {}}>
                <DeleteIcon />
            </IconButton>
        </div>
    );
}

export default RegistrationPortalLoCListItem;