import Input from '@components/form/Input';
import Pagination from '@components/form/Pagination';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import SearchIcon from '@icons/Search';
import React from "react";
import { useParams } from "react-router";
import api from "../../../configs/api";
import { usePaginationSWR } from "../../../hooks/usePaginationSWR";
import { QuestionnaireQuestionPaginatedResponse } from "../../../interfaces/common";
import { QuestionaryQuestion } from "../../../interfaces/model/questionary";
import strings from "../../../lang/Lang";
import AddRoundIcon from "../../../partials/Icons/AddRound";
import Button from '@components/form/Button';
import Card from "../../../partials/Paper/PagePaper";
import Table from "../../../partials/Table/PageTable";
import PageTableBody from "../../../partials/Table/PageTableBody";
import PageTableHead from "../../../partials/Table/PageTableHead";
import PageTableTH from "../../../partials/Table/PageTableTH";
import PageTableTHSort from "../../../partials/Table/PageTableTHSort";
import QuestionnaireQuestionListItem from "./QuestionnaireQuestionListItem";
import ModalSuspense from '@partials/Loadings/ModalLoading';
import MaterialBreadcrumbs from '@partials/Breadcrumbs/MaterialBreadcrumbs';
const QuestionnaireQuestionDeleteModal = React.lazy(() => import("./QuestionnaireQuestionDeleteModal"))
const QuestionnaireQuestionModal = React.lazy(() => import("./QuestionnaireQuestionModal"))


export interface QuestionnaireQuestionsProps {

}

const QuestionnaireQuestions: React.FC<QuestionnaireQuestionsProps> = () => {

    const { questionnaireId }: { questionnaireId?: string } = useParams();

    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);


    const { data, mutate, page, setPage, loading, search, setSearch, orderBy, orderDirection, handleOrder } = usePaginationSWR<QuestionnaireQuestionPaginatedResponse, Error>(api.questionnaireQuestions.replace(':questionary', questionnaireId!), {
        defaultFilter: {
            'withTrashed': true,
            'withDefaultTemplate': true,
        }
    });

    const [selectedQuestion, setSelectedQuestion] = React.useState<QuestionaryQuestion>();

    return (
        <div>
            <ModalSuspense>
                {deleteOpen &&
                    <QuestionnaireQuestionDeleteModal
                        open={deleteOpen}
                        handleClose={() => setDeleteOpen(false)}
                        mutate={mutate}
                        selectedQuestion={selectedQuestion}
                    />
                }

                {openModal &&
                    <QuestionnaireQuestionModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                        selectedQuestion={selectedQuestion}
                    />}
            </ModalSuspense>
            <div className="mt-4 mb-2">
                <MaterialBreadcrumbs />
            </div>
            <div className="flex flex-col md:flex-row justify-between mb-4 items-center">
                <Heading text={strings.Questions} variant="headingTitle" />
                <div className="flex space-x-3">
                    <Input
                        value={search}
                        icon={<SearchIcon className="text-mediumGray" />}
                        placeholder={strings.Search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <Button
                        size='small'
                        onClick={() => {
                            setSelectedQuestion(undefined);
                            setOpenModal(true);
                        }}
                    >
                        <div className="flex items-center">
                            <AddRoundIcon className="text-lg mr-1" />
                            {strings.NewQuestion}
                        </div>
                    </Button>
                </div>
            </div>
            <Card>
                <Table>
                    <PageTableHead>
                        <PageTableTHSort
                            sort={orderBy === 'question' && orderDirection}
                            onClick={() => handleOrder('question')}
                        >{strings.Question}</PageTableTHSort>
                        <PageTableTHSort
                            sort={orderBy === 'order' && orderDirection}
                            onClick={() => handleOrder('order')}
                        >{strings.Order}</PageTableTHSort>
                        <PageTableTHSort
                            sort={orderBy === 'type' && orderDirection}
                            onClick={() => handleOrder('type')}
                        >{strings.Type}</PageTableTHSort>
                        <PageTableTHSort
                            sort={orderBy === 'required' && orderDirection}
                            onClick={() => handleOrder('required')}
                        >{strings.Required}</PageTableTHSort>
                        <PageTableTH className=""></PageTableTH>
                    </PageTableHead>
                    <PageTableBody>
                        {data
                            && data.status === '1'
                            ? data.data.map((question) => {
                                return <QuestionnaireQuestionListItem
                                    key={question.id}
                                    question={question}
                                    onEditClick={() => {
                                        setSelectedQuestion(question);
                                        setOpenModal(true);
                                    }}
                                    onDeleteClick={() => {
                                        setSelectedQuestion(question);
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
        </div>
    );
}

function QuestionnairesSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((value, key) => {
                return (
                    <tr key={key}>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td>
                            <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                        </td>
                        <td>
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

export default QuestionnaireQuestions;