import Button from "@components/form/Button";
import strings from "@lang/Lang";
import Modal from "@partials/MaterialModal/Modal";

export interface ClientDownloadPopupProps {
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
}

const ClientDownloadPopup: React.FC<ClientDownloadPopupProps> = ({
  openModal,
  setOpenModal,
}) => {
  return (
    <Modal
      open={openModal}
      title={strings.important}
      handleClose={() => setOpenModal(false)}
      submitButton={
        <Button onClick={() => setOpenModal(false)}>
          {strings.Okay}
        </Button>
      }
    >
      <p className="px-4 pb-3 pt-2">{strings.client_download_message}</p>
    </Modal>
  );
}

export default ClientDownloadPopup;