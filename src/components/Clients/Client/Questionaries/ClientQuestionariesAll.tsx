import AddButton from '@components/form/AddButton';
import ViewAllButton from '@components/form/ViewAllButton';
import Skeleton from '@components/Skeleton/Skeleton';
import SearchBoxIcon from '@icons/SearchBox';
import { ClientQuestionary } from '@interface/model/clientQuestionary';
import CustomShowText from '@partials/Error/CustomShowText';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import { lazy, useState } from 'react';
import { useParams } from "react-router";
import { useNavigate } from 'react-router-dom';
import api from "../../../../configs/api";
import { usePaginationSWR } from "../../../../hooks/usePaginationSWR";
import { ClientQuestionaryPaginatedResponse } from "../../../../interfaces/common";
import strings from "../../../../lang/Lang";
import Table from "../../../../partials/Table/PageTable";
import ClientQuestionaryListItem from "./ClientQuestionaryListItem";

const ClientAestheticInterestModal = lazy(() => import('./AestethicInterest/ClientAestheticInterestModal'))
const ClientQuestionnerSectionAddModal = lazy(() => import('./ClientQuestionnerSectionAddModal'))
const ClientCovid19QuestionaryModal = lazy(() => import('./Covid19Questionary/ClientCovid19QuestionaryModal'))
const ClientHealthQuestionaryModal = lazy(() => import('./HealthQuestionary/ClientHealthQuestionaryModal'))
const QuestionnerViewModal = lazy(() => import('./QuestionnerViewModal'))

export interface ClientQuestionariesProps {
    // type: string
    // id?: number | null
}

const ClientQuestionariesAllTabSection: React.FC<ClientQuestionariesProps> = () => {

    const { clientId }: { clientId?: string } = useParams();

    const {
        data, mutate, loading, orderBy, orderDirection, handleOrder, error
    } = usePaginationSWR<ClientQuestionaryPaginatedResponse, Error>(api.clientQuestionnaireDataAll(clientId), {
        limit: 5,
    });

    const [openModal, setOpenModal] = useState(false)
    const [openViewModal, setOpenViewModal] = useState(false)
    const [selectedQuestionary, setSelectedQuestionary] = useState<ClientQuestionary>()
    const [openHealthModal, setOpenHealthModal] = useState(false)
    const [openAestheticModal, setOpenAestheticModal] = useState(false)
    const [openCovidModal, setOpenCovidModal] = useState(false)
    const navigate = useNavigate()

    const noData = (data?.data.length === 0 || error)

    if (noData) {
        return (
            <>
                <ModalSuspense>
                    {openModal &&
                        <ClientQuestionnerSectionAddModal
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            onHealthClick={() => { setOpenModal(false); setOpenHealthModal(true) }}
                            onAestheticClick={() => { setOpenModal(false); setOpenAestheticModal(true) }}
                            onCovidClick={() => { setOpenModal(false); setOpenCovidModal(true) }}
                            onCustomClick={() => { setOpenModal(false); navigate(`/clients/${clientId}/client-questionnaires`) }}
                        />
                    }
                    {openHealthModal &&
                        <ClientHealthQuestionaryModal
                            openModal={openHealthModal}
                            setOpenModal={setOpenHealthModal}
                            mutate={async () => { await mutate() }}
                        />
                    }
                    {openCovidModal &&
                        <ClientCovid19QuestionaryModal
                            openModal={openCovidModal}
                            setOpenModal={setOpenCovidModal}
                            mutate={async () => { await mutate() }}
                        />
                    }
                    {openAestheticModal &&
                        <ClientAestheticInterestModal
                            openModal={openAestheticModal}
                            setOpenModal={setOpenAestheticModal}
                            mutate={async () => { await mutate() }}
                        />
                    }
                </ModalSuspense>
                <CustomShowText text={strings.note_questionnaire} icon={<SearchBoxIcon />} >
                    <AddButton onClick={() => setOpenModal(true)} />
                </CustomShowText>
            </>
        )
    }

    return (
        <>
            <ModalSuspense>
                {(openViewModal && selectedQuestionary) &&
                    <QuestionnerViewModal
                        openModal={openViewModal}
                        onClose={() => { setOpenViewModal(false); setSelectedQuestionary(undefined) }}
                        questionary={selectedQuestionary}
                    />
                }
            </ModalSuspense>
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
                    <Table.Th />
                </Table.Head>
                <Table.Body>
                    {data?.data.map((questionary) => (
                        <ClientQuestionaryListItem
                            key={questionary.id}
                            questionary={questionary}
                            onViewClick={(q) => { setSelectedQuestionary(q); setOpenViewModal(true) }}
                        />
                    ))}
                    {loading && <ClientQuestionariesSkeleton limit={5} />}
                </Table.Body>
            </Table>
            <ViewAllButton to={`/clients/${clientId}/all-questionnaire`} />
        </>
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

export default ClientQuestionariesAllTabSection;