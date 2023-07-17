import ViewAllButton from '@components/form/ViewAllButton';
import { usePaginationSWR } from '@hooks/usePaginationSWR';
import { ClientTreatment } from '@interface/model/clientTreatment';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import { SectionLoading } from '@partials/Loadings/SectionLoading';
import Table from '@partials/Table/PageTable';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import api from '../../../../configs/api';
import { ClientProcedurePaginatedResponse } from '../../../../interfaces/common';
import strings from "../../../../lang/Lang";
import ClientEmptyRecordView from '../ClientEmptyRecordView';
import ClientProcedureCopyQuestionModal from './ClientProcedureCopyQuestionModal';
import ClientProcedureListItem from './ClientProcedureListItem';


export interface ClientProcedureProps {

}
const ClientProcedureSignModal = React.lazy(() => import('./ClientProcedureVerifySignModal'))
const ClientProcedureViewModal = React.lazy(() => import('./ClientProcedureViewModal'))

const ClientProcedure: React.FC<ClientProcedureProps> = () => {
    const { clientId }: { clientId?: string } = useParams();


    const { data, loading, mutate, orderBy, orderDirection, handleOrder } = usePaginationSWR<ClientProcedurePaginatedResponse, Error>(api.clientTreatments(clientId), {
        limit: 3
    });

    const navigate = useNavigate();
    const [openModal, setOpenModal] = React.useState(false)
    const [selectedProcedure, setSelectedProcedure] = React.useState<ClientTreatment>()
    const [openViewModal, setOpenViewModal] = React.useState(false)
    const [copyModal, setCopyModal] = React.useState(false)

    if (loading) {
        return <SectionLoading />
    }

    if (data?.data.length === 0) {
        return <ClientEmptyRecordView />
    }

    return (
        <>
            <ModalSuspense>
                {(copyModal && selectedProcedure) &&
                    <ClientProcedureCopyQuestionModal
                        onDone={() => {
                            navigate(`/clients/${clientId}/procedures/${selectedProcedure.id}/edit?copy`);
                            setSelectedProcedure(undefined)
                            setCopyModal(false)
                        }}
                        openModal={copyModal}
                        setOpenModal={setCopyModal}
                    />
                }
                {(openModal && selectedProcedure) &&
                    <ClientProcedureSignModal
                        openModal={true}
                        onClose={() => {
                            setOpenModal(false)
                            setSelectedProcedure(undefined)
                        }}
                        mutate={mutate}
                        selectedProcedure={selectedProcedure}
                    />
                }
                {(openViewModal && selectedProcedure) &&
                    <ClientProcedureViewModal
                        openModal={openViewModal}
                        handleClose={() => {
                            setOpenViewModal(false);
                            setSelectedProcedure(undefined);
                        }}
                        selectedClientTreatment={selectedProcedure}
                    />
                }
            </ModalSuspense>
            <Table>
                <Table.Head>
                    <Table.ThSort sort={orderBy === 'name' && orderDirection} onClick={() => handleOrder('name')}>
                        {strings.TITLE}
                    </Table.ThSort>
                    <Table.ThSort sort={orderBy === 'date' && orderDirection} onClick={() => handleOrder('date')}>
                        {strings.Date}
                    </Table.ThSort>
                    <Table.ThSort sort={orderBy === 'user.last_name' && orderDirection} onClick={() => handleOrder('user.last_name')}>
                        {strings.Changed_by}
                    </Table.ThSort>
                    <Table.ThSort sort={orderBy === 'signed_at' && orderDirection} onClick={() => handleOrder('signed_at')}>
                        {strings.status}
                    </Table.ThSort>
                    <Table.Th className="" style={{}}></Table.Th>
                </Table.Head>
                <Table.Body>
                    {data?.data.map((procedure) => (
                        <ClientProcedureListItem
                            key={procedure.id}
                            procedure={procedure}
                            onViewClick={(procedure) => {
                                setSelectedProcedure(procedure)
                                setOpenViewModal(true)
                            }}
                            onEditClick={() => {
                                navigate(`/clients/${clientId}/procedures/${procedure.id}/edit`);
                            }}
                            onCopyClick={(procedure) => {
                                setSelectedProcedure(procedure)
                                setCopyModal(true)
                            }}
                            onSignClick={(procedure) => {
                                setSelectedProcedure(procedure)
                                setOpenModal(true)
                            }}
                        />
                    ))}
                </Table.Body>
            </Table>
            {
                data?.data.length !== 0 &&
                <ViewAllButton to={`/clients/${clientId}/procedures`} />
            }
        </>
    );
}

export default ClientProcedure;