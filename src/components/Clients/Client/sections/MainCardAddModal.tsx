import Button from "@components/form/Button";
import Heading from "@components/heading/Heading";
import strings from "@lang/Lang";
import Modal from "@partials/MaterialModal/Modal";
import { Link, useParams } from "react-router-dom";

export interface MainCardAddModalProps {
  openModal: boolean,
  handleClose: () => void,
  onGeneralNotesClick?: () => void
  onLoCClick?: () => void
}

const ClientMainCardAddModal: React.FC<MainCardAddModalProps> = ({
  openModal, handleClose, onGeneralNotesClick, onLoCClick
}) => {

  const { clientId } = useParams()
  return (
    <Modal
      open={openModal}
      handleClose={handleClose}
      size="medium"
    >
      <div className="p-8 text-center">
        <Heading text={strings.addARecord} variant="bigTitle" />
        <p className="text-mediumGray mt-2">{strings.selectToAddARecord}</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 grid-flow-row gap-4 mt-8">
          <Link to={`/clients/${clientId}/procedures/create`} onClick={handleClose}><Button fullWidth>{strings.Procedures}</Button></Link>
          <Button fullWidth onClick={onGeneralNotesClick}>{strings.GeneralNotes}</Button>
          <Button fullWidth onClick={onLoCClick}>{strings.LettersofConsents}</Button>
        </div>
      </div>
    </Modal>
  );
}

export default ClientMainCardAddModal;