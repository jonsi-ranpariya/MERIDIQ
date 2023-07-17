import { Formik } from "formik";
import { useMemo } from "react";
import { AestheticInterestValues, Covid19QuestionaryValues, HealthQuestionaryValues, INITIAL_AESTETHIC_STATE, INITIAL_COVID19_STATE, INITIAL_HEALTH_STATE } from "../../../interfaces/questionary";
import strings from "../../../lang/Lang";
import Modal from "../../../partials/MaterialModal/Modal";
import AestheticInterestComponent from "../../../partials/Qestionary/AestheticInterestComponent";
import Covid19QuestionaryComponent from "../../../partials/Qestionary/Covid19QuestionaryComponent";
import HealthQuestionaryComponent from "../../../partials/Qestionary/HealthQuestionaryComponent";

export interface StandardQuestionnairesViewModalProps {
    isModalOpen?: boolean
    handleClose?: () => void
    modalType?: string
    // 'health' | 'aesthetic' | 'covid19'
}

const StandardQuestionnairesViewModal: React.FC<StandardQuestionnairesViewModalProps> = ({
    isModalOpen = false,
    handleClose = () => {},
    modalType,
}) => {

    const titleName = useMemo(() => {
        if (modalType === 'aesthetic') {
            return strings.UpdateAestethicInterest;
        } else if (modalType === 'covid19') {
            return strings.UpdateCovid19Questionnaire;
        }
        return strings.UpdateHealthQuestionnaire;
    }, [modalType]);

    const onSubmit = () => {};

    return (
        <Modal
            open={isModalOpen}
            title={titleName}
            size="large"
            handleClose={handleClose}
        >
            {modalType === 'health'
                ? (
                    <Formik<HealthQuestionaryValues> initialValues={{ data: INITIAL_HEALTH_STATE }} onSubmit={onSubmit}>
                        <div className="p-4">
                            <HealthQuestionaryComponent key="health" />
                        </div>
                    </Formik>
                ) : <></>}

            {modalType === 'aesthetic'
                ? (
                    <Formik<AestheticInterestValues> initialValues={{ data: INITIAL_AESTETHIC_STATE }} onSubmit={onSubmit}>
                        <div className="p-4">
                            <AestheticInterestComponent key="aesthetic" />
                        </div>
                    </Formik>
                ) : <></>}

            {modalType === 'covid19'
                ? (
                    <Formik<Covid19QuestionaryValues> initialValues={{ data: INITIAL_COVID19_STATE }} onSubmit={onSubmit}>
                        <div className="p-4">
                            <Covid19QuestionaryComponent key="covid19" />
                        </div>
                    </Formik>
                ) : <></>}
        </Modal>
    );
}

export default StandardQuestionnairesViewModal;