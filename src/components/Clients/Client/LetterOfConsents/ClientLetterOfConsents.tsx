import Pagination from '@components/form/Pagination';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import { useParams } from 'react-router';
import api from '../../../../configs/api';
import { usePaginationSWR } from '../../../../hooks/usePaginationSWR';
import { ClientLetterOfConsentPaginatedResponse } from '../../../../interfaces/common';
import { ClientLetterOfConsent } from '../../../../interfaces/model/clientLetterOfConsent';
import strings from '../../../../lang/Lang';
import FullPageError from '../../../../partials/Error/FullPageError';
import Card from '../../../../partials/Paper/PagePaper';
import Table from '../../../../partials/Table/PageTable';
import PageTableBody from '../../../../partials/Table/PageTableBody';
import PageTableHead from '../../../../partials/Table/PageTableHead';
import PageTableTH from '../../../../partials/Table/PageTableTH';
import PageTableTHSort from '../../../../partials/Table/PageTableTHSort';
import BackToClientDashboard from '../sections/BackToClientDashboard';
import ClientLetterOfConsentListItem from './ClientLetterOfConsentListItem';

const ClientLetterOfConsentDeleteModal = React.lazy(() => import('./ClientLetterOfConsentDeleteModal'))
const ClientLetterOfConsentVerifySignModal = React.lazy(() => import('./ClientLetterOfConsentVerifySignModal'))
const ClientLetterOfConsentViewModal = React.lazy(() => import('./ClientLetterOfConsentViewModal'))

export interface ClientLetterOfConsentsProps {

}

const ClientLetterOfConsents: React.FC<ClientLetterOfConsentsProps> = () => {

    const { clientId }: { clientId?: string } = useParams();

    const { data, page, setPage, loading, error, mutate, orderBy, orderDirection, handleOrder } = usePaginationSWR<ClientLetterOfConsentPaginatedResponse, Error>(api.clientLetterOfConsents(clientId));
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openSignModal, setOpenSignModal] = React.useState(false);
    const [openViewModal, setOpenViewModal] = React.useState(false);
    const [selectedLetterOfConsent, setSelectedLetterOfConsent] = React.useState<ClientLetterOfConsent>();

    if (error) {
        return <FullPageError code={error?.status || 500} message={error.message || 'server error'} />
    }

    return (
        <div className="">
            <ModalSuspense>
                {openDeleteModal &&
                    <ClientLetterOfConsentDeleteModal
                        open={openDeleteModal}
                        handleClose={() => {
                            setOpenDeleteModal(false);
                            setSelectedLetterOfConsent(undefined);
                        }}
                        mutate={mutate}
                        selectedClientLetterOfConsent={selectedLetterOfConsent}
                    />
                }
                {openViewModal &&
                    <ClientLetterOfConsentViewModal
                        openModal={openViewModal}
                        handleClose={() => {
                            setOpenViewModal(false);
                            setSelectedLetterOfConsent(undefined);
                        }}
                        selectedClientLetterOfConsent={selectedLetterOfConsent}
                    />
                }
                {openSignModal &&
                    <ClientLetterOfConsentVerifySignModal
                        openModal={openSignModal}
                        setOpenModal={setOpenSignModal}
                        mutate={mutate}
                        selectedLetterOfConsent={selectedLetterOfConsent}
                    />
                }
            </ModalSuspense>
            <BackToClientDashboard />
            <Heading text={strings.LettersofConsents} variant="bigTitle" className='mb-4' />
            <Card>
                <Table>
                    <PageTableHead>
                        <PageTableTHSort
                            sort={orderBy === 'consent_title' && orderDirection}
                            onClick={() => handleOrder('consent_title')}
                        >{strings.TITLE}</PageTableTHSort>
                        <PageTableTHSort
                            sort={orderBy === 'created_at' && orderDirection}
                            onClick={() => handleOrder('created_at')}
                        >{strings.Signed_at}</PageTableTHSort>
                        <PageTableTH>{strings.VerifiedBy}</PageTableTH>
                        <PageTableTH></PageTableTH>
                    </PageTableHead>
                    <PageTableBody>
                        {data?.data.map((consent) => (
                            <ClientLetterOfConsentListItem
                                key={consent.id}
                                consent={consent}
                                onSignClick={() => {
                                    setSelectedLetterOfConsent(consent);
                                    setOpenSignModal(true);
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
                        {loading && <ClientLogsSkeleton limit={10} />}
                    </PageTableBody>
                </Table>
                <Pagination
                    pageSize={data?.per_page ?? 0}
                    totalCount={data?.total ?? 0}
                    currentPage={page}
                    onPageChange={(page) => setPage(page)}
                />
            </Card>
        </div>
    );
}


function ClientLogsSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((value, key) => {
                return (
                    <tr key={key}>
                        <td className="px-2">
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td className="px-2">
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td className="px-2">
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td className="flex">
                            <Skeleton className="h-9 w-9 mx-1" variant="circular" />
                            <Skeleton className="h-9 w-9 ml-1" variant="circular" />
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default ClientLetterOfConsents;