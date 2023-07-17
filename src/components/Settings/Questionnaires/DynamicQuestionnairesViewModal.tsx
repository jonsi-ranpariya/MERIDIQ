
import { SectionLoading } from '@partials/Loadings/SectionLoading';
import { Formik } from 'formik';
import * as React from 'react';
import useSWR from 'swr';
import config from '../../../config';
import api from '../../../configs/api';
import { QuestionaryQuestionResponse } from '../../../interfaces/common';
import { Questionary } from '../../../interfaces/model/questionary';
import strings from '../../../lang/Lang';
import Modal from '../../../partials/MaterialModal/Modal';
import DynamicQuestionaryComponent from '../../../partials/Qestionary/DynamicQuestionaryComponent';
import { DynamicQuestionaryValues } from '../../Clients/Client/Questionaries/DynamicQuestionary/ClientDynamicQuestionariesModal';

export interface DynamicQuestionnairesViewModalProps {
    isModalOpen: boolean
    selectedQuestionary: Questionary
    handleClose?: () => void
}

const DynamicQuestionnairesViewModal: React.FC<DynamicQuestionnairesViewModalProps> = ({
    isModalOpen = false,
    selectedQuestionary,
    handleClose = () => {},
}) => {

    const { data: questionnaireQuestionData, error } = useSWR<QuestionaryQuestionResponse, Error>(
        api.questionnaireQuestions.replace(":questionary", selectedQuestionary.id.toString() || "")
    );

    const loading = !questionnaireQuestionData && !error;

    return (
        <Modal
            open={isModalOpen}
            title={`${strings.view_or_update} ${selectedQuestionary?.title} ${strings.Questionnaire}`}
            size="large"
            handleClose={handleClose}
        >
            <Formik<DynamicQuestionaryValues>
                initialValues={selectedQuestionary ? {
                    data: questionnaireQuestionData?.data?.map((question, index) => {
                        if (question.type === config.questionTypes1.yes_no_textbox.value) {
                            return {
                                question: question.question,
                                type: question.type,
                                value: selectedQuestionary?.data && selectedQuestionary.data?.formatted_response[index]?.value ? (selectedQuestionary.data.formatted_response[index]?.value === 'yes' ? 1 : 0) : '',
                                text: selectedQuestionary?.data && selectedQuestionary.data?.formatted_response[index]?.text ? selectedQuestionary.data.formatted_response[index]?.text : '',
                            };
                        }

                        if (question.type === config.questionTypes1.yes_no.value) {
                            return {
                                question: question.question,
                                type: question.type,
                                value: selectedQuestionary?.data && selectedQuestionary.data?.formatted_response[index]?.value ? (selectedQuestionary.data.formatted_response[index]?.value === 'yes' ? 1 : 0) : '',
                                text: "",
                            };
                        }

                        if (question.type === config.questionTypes1.textbox.value) {
                            return {
                                question: question.question,
                                type: question.type,
                                text: selectedQuestionary?.data && selectedQuestionary.data?.formatted_response[index] ? selectedQuestionary.data.formatted_response[index] : '',
                            };
                        }

                        return {
                            question: question.question,
                            text: "",
                            type: question.type,
                        };
                    }) || []
                } : {
                    data: [],
                }}
                enableReinitialize
                onSubmit={() => {}}
            >
                <div className="p-4">
                    <DynamicQuestionaryComponent />
                    {
                        questionnaireQuestionData?.data && !questionnaireQuestionData?.data?.length
                            ? strings.NoQuestions
                            : ''
                    }
                    {loading
                        ? <SectionLoading />
                        : ''
                    }
                </div>
            </Formik>
        </Modal>
    );
}

export default DynamicQuestionnairesViewModal;