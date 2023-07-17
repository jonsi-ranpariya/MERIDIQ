
import IconButton from '@components/form/IconButton';
import SignIcon from '@icons/Sign';
import strings from '@lang/Lang';
import * as React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import api from '../../../../configs/api';
import { formatDate, generateClientFullName, generateUserFullName } from '../../../../helper';
import { ClientResponse } from '../../../../interfaces/common';
import { ClientLetterOfConsent } from '../../../../interfaces/model/clientLetterOfConsent';
import DeleteIcon from '../../../../partials/Icons/Delete';
import EyeIcon from '../../../../partials/Icons/Eye';
import PageTableTD from '../../../../partials/Table/PageTableTD';

export interface ClientLetterOfConsentListItemProps {
    consent: ClientLetterOfConsent,
    onDeleteClick?: (data: ClientLetterOfConsent) => void,
    onViewClick?: (data: ClientLetterOfConsent) => void,
    onSignClick?: (data: ClientLetterOfConsent) => void,
}

const ClientLetterOfConsentListItem: React.FC<ClientLetterOfConsentListItemProps> = ({
    consent,
    onDeleteClick = () => { },
    onViewClick = () => { },
    onSignClick = () => { },
}) => {
    const { clientId }: { clientId?: string } = useParams();

    const { data } = useSWR<ClientResponse, Error>(api.clientSingle(clientId));

    return (
        <>
            <tr className={`md:hidden ${!consent?.verified_signed_at ? 'bg-red-500/20' : ''}`}>
                {mobileListItem()}
            </tr>
            <tr className={`hidden md:table-row ${!consent?.verified_signed_at ? 'bg-red-500/20 hover:bg-red-500/30' : 'hover:bg-primary/5'}`}>
                {desktopListItem()}
            </tr>
        </>
    );

    function desktopListItem() {
        return (
            <>
                <PageTableTD>
                    <button
                        className="w-full"
                        onClick={() => {
                            onViewClick(consent);
                        }}>
                        <div className="flex pl-2 break-all">
                            <span className="">{consent.consent_title || '-'}</span>
                        </div>
                    </button>
                </PageTableTD>
                <PageTableTD>
                    <div className="flex pl-2 break-all">
                        <span className="">{formatDate(consent?.created_at) || '-'}</span>
                    </div>
                </PageTableTD>
                <PageTableTD>
                    <div>{generateUserFullName(consent?.verified_signed_by)}</div>
                </PageTableTD>
                <PageTableTD>
                    <div className='flex justify-end pr-4'>
                        {!consent?.verified_signed_at &&
                            <IconButton
                                onClick={() => onSignClick(consent)}
                                children={<SignIcon />}
                            />
                        }
                        <IconButton
                            onClick={() => onViewClick(consent)}
                            children={<EyeIcon />}
                        />
                        {!consent.verified_sign &&
                            <IconButton
                                onClick={() => onDeleteClick(consent)}
                                children={<DeleteIcon />}
                            />
                        }
                    </div>
                </PageTableTD>
            </>
        )
    }
    function mobileListItem() {
        return (
            <PageTableTD>
                <div className="py-2">
                    <p>{consent.consent_title || '-'}</p>
                    <p className='text-xs flex justify-between mt-1'>
                        <span className="text-mediumGray">{strings.Signed_by} {generateClientFullName(data?.data)}</span>
                        <span className="font-medium">{formatDate(consent?.created_at, "YYYY-MM-DD") || '-'}</span>
                    </p>

                    <div className="mt-1">
                        {!consent?.verified_signed_at &&
                            <IconButton
                                onClick={() => onSignClick(consent)}
                                children={<SignIcon />}
                            />
                        }
                        <IconButton
                            onClick={() => onViewClick(consent)}
                            children={<EyeIcon />}
                        />
                        {!consent.verified_sign &&
                            <IconButton
                                onClick={() => onDeleteClick(consent)}
                                children={<DeleteIcon />}
                            />
                        }
                    </div>
                </div>
            </PageTableTD>
        )
    }
}

export default ClientLetterOfConsentListItem;