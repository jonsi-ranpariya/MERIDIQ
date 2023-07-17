import Button from "@components/form/Button";
import Heading from "@components/heading/Heading";
import strings from "@lang/Lang";
import Modal from "@partials/MaterialModal/Modal";

export interface ClientQuestionnerSectionAddModalProps {
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  onHealthClick: () => void
  onAestheticClick: () => void
  onCovidClick: () => void
  onCustomClick: () => void
}

const ClientQuestionnerSectionAddModal: React.FC<ClientQuestionnerSectionAddModalProps> = ({
  openModal,
  setOpenModal,
  onHealthClick,
  onAestheticClick,
  onCovidClick,
  onCustomClick,
}) => {
  return (
    <Modal
      open={openModal}
      handleClose={() => setOpenModal(false)}
      size="medium"
    >
      <div className="p-8 text-center">
        <Heading text={strings.addAQuestionner} variant="bigTitle" />
        <p className="text-mediumGray mt-2">{strings.selectToAddAQuestionner}</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-4 mt-8">
          <Button onClick={onHealthClick}>{strings.HealthQuestionnaire}</Button>
          <Button onClick={onAestheticClick}>{strings.Aestethicinterest}</Button>
          <Button onClick={onCovidClick}>{strings.Covid19Questionnaire}</Button>
          <Button onClick={onCustomClick}>{strings.CustomQuestionnaire}</Button>
        </div>
      </div>
    </Modal>
  );
}

export default ClientQuestionnerSectionAddModal;