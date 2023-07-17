import Pagination from '@components/form/Pagination';
import ViewAllButton from '@components/form/ViewAllButton';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import React from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../../../../configs/api";
import { usePaginationSWR } from "../../../../../hooks/usePaginationSWR";
import { ClientQuestionariesResponse } from "../../../../../interfaces/common";
import { Questionary } from "../../../../../interfaces/model/questionary";
import strings from "../../../../../lang/Lang";
import Card from "../../../../../partials/Paper/PagePaper";
import Table from "../../../../../partials/Table/PageTable";
import PageTableBody from "../../../../../partials/Table/PageTableBody";
import PageTableHead from "../../../../../partials/Table/PageTableHead";
import PageTableTH from "../../../../../partials/Table/PageTableTH";
import PageTableTHSort from "../../../../../partials/Table/PageTableTHSort";
import BackToClientDashboard from '../../sections/BackToClientDashboard';
import ClientDynamicQuestionariesModal from "./ClientDynamicQuestionariesModal";
import ClientDynamicQuestionaryListItem from "./ClientDynamicQuestionaryListItem";

export interface ClientDynamicQuestionariesProps {
    section?: boolean
}

const ClientDynamicQuestionaries: React.FC<ClientDynamicQuestionariesProps> = ({ section = false }) => {

    const { clientId }: { clientId?: string } = useParams();

    const { data, error, mutate, orderBy, orderDirection, handleOrder, page, setPage } = usePaginationSWR<ClientQuestionariesResponse, Error>(
        api.clientQuestionnaire.replace(':client', clientId!),
        { limit: section ? 3 : 20 }
    )

    const loading = !data && !error;
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedQuestionary, setSelectedQuestionary] = React.useState<Questionary>();

    const navigate = useNavigate();
    if (section) {
        return (
            <>
                {DataTable()}
                {
                    data?.data.length !== 0 &&
                    <ViewAllButton to={`/clients/${clientId}/client-questionnaires`} />
                }
            </>
        )
    };

    return (
        <>
            <BackToClientDashboard />
            <Heading text={strings.Questionnaires} variant="bigTitle" className='mb-4' />
            <Card>
                {DataTable()}
                <Pagination
                    pageSize={data?.per_page}
                    totalCount={data?.total}
                    currentPage={page}
                    onPageChange={setPage}
                />
            </Card>
        </>
    );

    function DataTable() {
        // const list = section ? data?.data.slice(0, 3) : data?.data
        return (
            <>
                <ModalSuspense>
                    {(selectedQuestionary && openModal) &&
                        <ClientDynamicQuestionariesModal
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            mutate={mutate}
                            selectedQuestionary={selectedQuestionary}
                        />
                    }
                </ModalSuspense>
                <Table>
                    <PageTableHead>
                        <PageTableTHSort
                            sort={orderBy === 'title' && orderDirection}
                            onClick={() => handleOrder('title')}
                        >{strings.TITLE}</PageTableTHSort>
                        <PageTableTHSort
                            sort={orderBy === 'datas_count' && orderDirection}
                            onClick={() => handleOrder('datas_count')}
                            className="uppercase"
                        >{strings.DataCount}</PageTableTHSort>
                        <PageTableTH className="" style={{}}></PageTableTH>
                    </PageTableHead>
                    <PageTableBody>
                        {data?.data?.map((questionary) => (
                            <ClientDynamicQuestionaryListItem
                                key={questionary.id}
                                questionary={questionary}
                                onViewClick={(questionary) => {
                                    navigate(`/clients/${clientId}/questionnaire/${questionary.id}?questionnaireType=App\\Questionary`)
                                }}
                                onAddClick={(questionary) => {
                                    setSelectedQuestionary(questionary)
                                    setOpenModal(true);
                                }}
                            />
                        ))}
                        {loading && <ClientDynamicQuestionariesSkeleton limit={10} />}
                    </PageTableBody>
                </Table>
            </>
        );
    }
}




function ClientDynamicQuestionariesSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((value, key) => {
                return (
                    <tr key={key}>
                        <td className="px-2">
                            <Skeleton className="h-10 cursor-wait w-full" />
                        </td>
                        <td className="px-2">
                            <Skeleton className="h-10 cursor-wait w-full" />
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

export default ClientDynamicQuestionaries;