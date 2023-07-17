import Input from '@components/form/Input';
import Pagination from '@components/form/Pagination';
import Heading from '@components/heading/Heading';
import SearchIcon from '@icons/Search';
import Skeleton from '@components/Skeleton/Skeleton';
import React from "react";
import api from "../../configs/api";
import { usePaginationSWR } from "../../hooks/usePaginationSWR";
import { QuestionnairePaginatedResponse } from "../../interfaces/common";
import { Questionary } from "../../interfaces/model/questionary";
import strings from "../../lang/Lang";
import AddRoundIcon from "../../partials/Icons/AddRound";
import Button from '@components/form/Button';
import Card from "../../partials/Paper/PagePaper";
import Table from "../../partials/Table/PageTable";
import PageTableBody from "../../partials/Table/PageTableBody";
import PageTableHead from "../../partials/Table/PageTableHead";
import PageTableTH from "../../partials/Table/PageTableTH";
import PageTableTHSort from "../../partials/Table/PageTableTHSort";
import QuestionnaireDeleteModal from "./QuestionnaireDeleteModal";
import QuestionnaireListItem from "./QuestionnaireListItem";
import QuestionnaireModal from "./QuestionnaireModal";

export interface QuestionnairesProps {

}

const Questionnaires: React.FC<QuestionnairesProps> = () => {
    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);


    const { data, mutate, page, setPage, loading, search, setSearch, orderBy, handleOrder, orderDirection } = usePaginationSWR<QuestionnairePaginatedResponse, Error>(api.questionnaires, {
        defaultFilter: {
            'withTrashed': true,
            'withDefaultTemplate': true,
        },
        limit: 1,
    });

    const [selectedQuestionary, setSelectedQuestionary] = React.useState<Questionary>();

    return (
        <div>
            <QuestionnaireDeleteModal
                open={deleteOpen}
                handleClose={() => {
                    setDeleteOpen(false)
                }}
                mutate={mutate}
                selectedQuestionary={selectedQuestionary}
            />

            <QuestionnaireModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                mutate={mutate}
                selectedQuestionary={selectedQuestionary}
            />
            <div className="flex flex-col md:flex-row justify-between mb-4 items-center">
                <Heading text={strings.Questionnaires} variant="headingTitle" />
                <div className="flex space-x-3">
                    <Input
                        value={search}
                        icon={<SearchIcon className="text-mediumGray" />}
                        placeholder={strings.Search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <Button
                        onClick={() => {
                            setSelectedQuestionary(undefined);
                            setOpenModal(true);
                        }}
                    >
                        <div className="flex items-center">
                            <AddRoundIcon className="mr-1" />
                            {strings.add}
                        </div>
                    </Button>
                </div>
            </div>
            <Card>
                <Table>
                    <PageTableHead>
                        <PageTableTHSort
                            sort={orderBy === 'title' && orderDirection}
                            onClick={() => handleOrder('title')}
                        >{strings.TITLE}</PageTableTHSort>
                        <PageTableTH className=""></PageTableTH>
                    </PageTableHead>
                    <PageTableBody>
                        {data
                            && data.status === '1'
                            ? data.data.map((questionnaire) => {
                                return <QuestionnaireListItem
                                    key={questionnaire.id}
                                    questionnaire={questionnaire}
                                    onEditClick={() => {
                                        setSelectedQuestionary(questionnaire);
                                        setOpenModal(true);
                                    }}
                                    onDeleteClick={() => {
                                        setSelectedQuestionary(questionnaire);
                                        setDeleteOpen(true);
                                    }}
                                />
                            })
                            : <></>}

                        {loading && <QuestionnairesSkeleton limit={10} />}
                    </PageTableBody>
                </Table>
                <Pagination
                    pageSize={data?.per_page ?? 0}
                    totalCount={data?.total ?? 0}
                    currentPage={page}
                    onPageChange={(page) => setPage(page)}
                />
            </Card>
        </div >
    );
}

function QuestionnairesSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((value, key) => {
                return (
                    <tr key={key}>
                        <td>
                            <div className="flex items-center">
                                <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                            </div>
                        </td>
                        <td className="flex">
                            <Skeleton className="h-9 w-9 mx-1" variant="circular" />
                            <Skeleton className="h-9 w-9 ml-1" variant="circular" />
                            <Skeleton className="h-9 w-9 ml-1" variant="circular" />
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default Questionnaires;