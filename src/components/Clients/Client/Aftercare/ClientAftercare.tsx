import Card from '@components/card';
import AddButton from '@components/form/AddButton';
import ViewAllButton from '@components/form/ViewAllButton';
import Heading from '@components/heading/Heading';
import api from '@configs/api';
import { usePaginationSWR } from '@hooks/usePaginationSWR';
import MessageIcon from '@icons/Message';
import { ClientLogsPaginatedResponse } from '@interface/common';
import CustomShowText from '@partials/Error/CustomShowText';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import Table from '@partials/Table/PageTable';
import * as React from 'react';
import { useParams } from "react-router";
import strings from "../../../../lang/Lang";
import ClientAftercareListItem from './ClientAftercareListItem';
const ClientAftercareModal = React.lazy(() => import('./ClientAftercareModal'));

export interface ClientAftercareProps {

}

const ClientAftercare: React.FC<ClientAftercareProps> = () => {

    const { clientId }: { clientId?: string } = useParams();

    const [openModal, setOpenModal] = React.useState(false);
    const { data, orderBy, orderDirection, handleOrder, mutate } = usePaginationSWR<ClientLogsPaginatedResponse, Error>(api.clientAftercares(clientId), { limit: 4 });

    return (
        <>
            <ModalSuspense>
                {
                    openModal &&
                    <ClientAftercareModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                    />
                }
            </ModalSuspense>
            <Card>
                <div className="px-2 py-1 flex justify-between items-start">
                    <Heading text={strings.AfterCare} variant="subHeader" count={data?.total} />
                    <AddButton onClick={() => setOpenModal(true)} />
                </div>

                {(data?.data.length === 0) ?
                    <CustomShowText text={strings.note_send_info} icon={<MessageIcon />} >
                        <AddButton onClick={() => setOpenModal(true)} />
                    </CustomShowText> :
                    <Table>
                        <Table.Head>
                            <Table.Th children={strings.send_by} />
                            <Table.ThSort
                                sort={orderBy === 'created_at' && orderDirection}
                                onClick={() => handleOrder('created_at')}
                                children={strings.DateTime}
                            />
                        </Table.Head>
                        <Table.Body>
                            {data?.data.map((log) => (
                                <ClientAftercareListItem key={log.id} log={log} showName />
                            ))}
                        </Table.Body>
                    </Table>
                }
                {
                    data?.data.length !== 0 &&
                    <ViewAllButton to={`/clients/${clientId}/aftercare`} />
                }
            </Card>
        </>
    );
}

export default ClientAftercare;