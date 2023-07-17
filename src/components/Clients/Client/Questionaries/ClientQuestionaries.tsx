import Pagination from '@components/form/Pagination';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import { ClientQuestionary } from '@interface/model/clientQuestionary';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import { useState } from 'react';
import { useParams } from "react-router";
import api from "../../../../configs/api";
import { questionaryTypeToName } from "../../../../helper";
import { usePaginationSWR } from "../../../../hooks/usePaginationSWR";
import useQuery from "../../../../hooks/useQuery";
import { ClientQuestionaryPaginatedResponse } from "../../../../interfaces/common";
import strings from "../../../../lang/Lang";
import Card from "../../../../partials/Paper/PagePaper";
import Table from "../../../../partials/Table/PageTable";
import BackToClientDashboard from '../sections/BackToClientDashboard';
import ClientQuestionaryListItem from "./ClientQuestionaryListItem";
import QuestionnerViewModal from './QuestionnerViewModal';

export interface ClientQuestionariesProps {

}

const ClientQuestionaries: React.FC<ClientQuestionariesProps> = () => {

    const { clientId, questionnaireId }: { clientId?: string, questionnaireId?: string } = useParams();
    const query = useQuery();
    const [openViewModal, setOpenViewModal] = useState(false)
    const [selectedQuestionary, setSelectedQuestionary] = useState<ClientQuestionary>()


    const {
        data, page, setPage, loading, orderBy, orderDirection, handleOrder,
    } = usePaginationSWR<ClientQuestionaryPaginatedResponse, Error>(
        questionnaireId ? api.clientQuestionnaireData(clientId) : api.clientQuestionnaireDataAll(clientId), {
        defaultFilter: {
            questionary_id: questionnaireId,
            questionary_type: query.get('questionnaireType'),
        }
    });

    return (
        <div className="">
            <ModalSuspense>
                {(openViewModal && selectedQuestionary) &&
                    <QuestionnerViewModal
                        openModal={openViewModal}
                        onClose={() => { setOpenViewModal(false); setSelectedQuestionary(undefined) }}
                        questionary={selectedQuestionary}
                    />
                }
            </ModalSuspense>
            <BackToClientDashboard />
            <Heading text={questionaryTypeToName(query.get('questionnaireType') || '')} variant="bigTitle" className='mb-4' />
            <Card>
                <Table>
                    <Table.Head>
                        <Table.ThSort
                            sort={orderBy === 'modelable_type' && orderDirection}
                            onClick={() => handleOrder('modelable_type')}
                            children={strings.TITLE}
                        />
                        <Table.ThSort
                            sort={orderBy === 'created_at' && orderDirection}
                            onClick={() => handleOrder('created_at')}
                            children={strings.DateTime}
                        />
                        <Table.Th></Table.Th>
                    </Table.Head>
                    <Table.Body>
                        {data?.data.map((questionary) => (
                            <ClientQuestionaryListItem
                                key={questionary.id}
                                questionary={questionary}
                                onViewClick={(q) => { setSelectedQuestionary(q); setOpenViewModal(true) }}
                            />
                        ))}
                        {loading && <ClientQuestionariesSkeleton limit={10} />}
                    </Table.Body>
                </Table>
                <Pagination
                    pageSize={data?.per_page}
                    totalCount={data?.total}
                    currentPage={page}
                    onPageChange={(page) => setPage(page)}
                />
            </Card>
        </div >
    );
}

function ClientQuestionariesSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((value, key) => {
                return (
                    <tr key={key}>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td className="flex">
                            <Skeleton className="h-9 w-9 mx-1" variant="circular" />
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default ClientQuestionaries;