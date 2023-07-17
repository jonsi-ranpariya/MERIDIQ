import Button from "@components/form/Button";
import strings from "@lang/Lang";
import Modal from "@partials/MaterialModal/Modal";

export interface ClientProcedureCopyQuestionModalProps {
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  onDone: () => void,
}

const ClientProcedureCopyQuestionModal: React.FC<ClientProcedureCopyQuestionModalProps> = ({
  openModal,
  onDone,
  setOpenModal,
}) => {
  return (
    <Modal
      open={openModal}
      handleClose={() => setOpenModal(false)}
      cancelButton={
        <Button variant="outlined" onClick={() => setOpenModal(false)}>
          {strings.No}
        </Button>
      }
      submitButton={
        <Button onClick={onDone}>{strings.Yes}</Button>
      }
    >
      <div className="p-4">
        <p className="font-medium text-center text-lg">{strings.copy_procedure_question}</p>
      </div>
    </Modal>
  );
}

export default ClientProcedureCopyQuestionModal;