import strings from "../../../lang/Lang";

export interface QuestionnairesViewModalProps {
    isModalOpen?: boolean
    handleClose?: () => {}
    modalType: 'health' | 'aesthetic' | 'covid19'
}

const QuestionnairesViewModal: React.FC<QuestionnairesViewModalProps> = ({
    isModalOpen = false,
    handleClose = () => {},
    modalType,
}) => {
    let titleName;
    if (modalType === 'health') {
        titleName = strings.UpdateHealthQuestionnaire;
    } else if (modalType === 'aesthetic') {
        titleName = strings.UpdateAestethicInterest;
    } else if (modalType === 'covid19') {
        titleName = strings.UpdateCovid19Questionnaire;
    }
    return (
        <div className="">

        </div>
    );
}

export default QuestionnairesViewModal;