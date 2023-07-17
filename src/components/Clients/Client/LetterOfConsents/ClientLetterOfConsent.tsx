import ViewAllButton from '@components/form/ViewAllButton';
import api from '@configs/api';
import { usePaginationSWR } from '@hooks/usePaginationSWR';
import { ClientLetterOfConsentPaginatedResponse } from '@interface/common';
import { ClientLetterOfConsent as ClientLetterOfConsentModel } from '@interface/model/clientLetterOfConsent';
import strings from '@lang/Lang';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import { SectionLoading } from '@partials/Loadings/SectionLoading';
import Table from '@partials/Table/PageTable';
import PageTableBody from '@partials/Table/PageTableBody';
import PageTableHead from '@partials/Table/PageTableHead';
import PageTableTH from '@partials/Table/PageTableTH';
import PageTableTHSort from '@partials/Table/PageTableTHSort';
import * as React from 'react';
import { useParams } from 'react-router';
import ClientEmptyRecordView from '../ClientEmptyRecordView';
import ClientLetterOfConsentListItem from './ClientLetterOfConsentListItem';

const ClientLetterOfConsentDeleteModal = React.lazy(() => import('./ClientLetterOfConsentDeleteModal'));
const ClientLetterOfConsentVerifySignModal = React.lazy(() => import('./ClientLetterOfConsentVerifySignModal'));
const ClientLetterOfConsentViewModal = React.lazy(() => import('./ClientLetterOfConsentViewModal'));

export interface ClientLetterOfConsentProps {

}

const ClientLetterOfConsent: React.FC<ClientLetterOfConsentProps> = () => {
    const { clientId }: { clientId?: string } = useParams();

    const { data, mutate, loading, orderBy, orderDirection, handleOrder } = usePaginationSWR<ClientLetterOfConsentPaginatedResponse, Error>(api.clientLetterOfConsents(clientId), {
        limit: 3
    });

    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openSignModal, setOpenSignModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [selectedLetterOfConsent, setSelectedLetterOfConsent] = React.useState<ClientLetterOfConsentModel>();

    if (loading) {
        return <SectionLoading />
    }

    if (data?.data.length === 0) {
        return <ClientEmptyRecordView />
    }

    return (
        <>
            <ModalSuspense>
                {
                    openDeleteModal &&
                    <ClientLetterOfConsentDeleteModal
                        open={openDeleteModal}
                        handleClose={() => {
                            setOpenDeleteModal(false)
                            setSelectedLetterOfConsent(undefined)
                        }}
                        mutate={mutate}
                        selectedClientLetterOfConsent={selectedLetterOfConsent}
                    />
                }
                {
                    openViewModal &&
                    <ClientLetterOfConsentViewModal
                        openModal={openViewModal}
                        handleClose={() => {
                            setOpenViewModal(false)
                            setSelectedLetterOfConsent(undefined)
                        }}
                        selectedClientLetterOfConsent={selectedLetterOfConsent}
                    />
                }
                {
                    openSignModal &&
                    <ClientLetterOfConsentVerifySignModal
                        openModal={openSignModal}
                        setOpenModal={setOpenSignModal}
                        mutate={mutate}
                        selectedLetterOfConsent={selectedLetterOfConsent}
                    />
                }
            </ModalSuspense>
            <Table>
                <PageTableHead>
                    <PageTableTHSort
                        sort={orderBy === 'consent_title' && orderDirection}
                        onClick={() => handleOrder('consent_title')}
                        children={strings.TITLE}
                    />
                    <PageTableTHSort
                        sort={orderBy === 'created_at' && orderDirection}
                        onClick={() => handleOrder('created_at')}
                        children={strings.Signed_at}
                    />
                    <PageTableTH children={strings.VerifiedBy} />
                    <PageTableTH />
                </PageTableHead>
                <PageTableBody>
                    {data?.data.map((consent) => (
                        <ClientLetterOfConsentListItem
                            key={consent.id}
                            consent={consent}
                            onSignClick={() => {
                                setSelectedLetterOfConsent(consent)
                                setOpenSignModal(true)
                            }}
                            onDeleteClick={(consent) => {
                                setSelectedLetterOfConsent(consent);
                                setOpenDeleteModal(true);
                            }}
                            onViewClick={(consent) => {
                                setSelectedLetterOfConsent(consent);
                                setOpenViewModal(true);
                            }}
                        />
                    ))}
                </PageTableBody>
            </Table>
            {data?.data.length !== 0 && <ViewAllButton to={`/clients/${clientId}/client-letters-of-consents`} />}
        </>
    );
}

export default ClientLetterOfConsent;