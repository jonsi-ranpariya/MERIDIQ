import api from "@configs/api";
import { ClientQuestionary } from "@interface/model/clientQuestionary";
import Modal from "@partials/MaterialModal/Modal";
import { getQuestionnerTypeName } from "./ClientQuestionaryListItem";

export interface QuestionnerViewModalProps {
  openModal: boolean,
  onClose: () => void,
  questionary: ClientQuestionary
}

const QuestionnerViewModal: React.FC<QuestionnerViewModalProps> = ({
  openModal,
  questionary,
  onClose,
}) => {

  return (
    <Modal
      open={openModal}
      handleClose={onClose}
      title={getQuestionnerTypeName(questionary)}
      size="large"
    >
      <div className="overflow-hidden rounded-b-2xl">
        <iframe title="PDF viewer" className="w-full h-[85vh]" src={api.storageUrl(questionary.pdf)}></iframe>
      </div>
    </Modal>
  );
}

export default QuestionnerViewModal;