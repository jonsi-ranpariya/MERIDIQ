import Autocomplete from '@components/form/Autocomplete';
import * as React from 'react';
import { Treatment } from '../../../../../interfaces/model/treatment';
import strings from '../../../../../lang/Lang';
import Button from '@components/form/Button';
import CancelButton from '../../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../../partials/MaterialModal/Modal';


export interface ClientProcedureTreatmentTextModelProps {
  openModal: boolean,
  onClose: (treatment?: Treatment) => void,
  treatments: Treatment[],
}

const ClientProcedureTreatmentTextModel: React.FC<ClientProcedureTreatmentTextModelProps> = ({
  openModal,
  onClose,
  treatments,
}) => {
  const [selectedTreatment, setSelectedTreatment] = React.useState<Treatment>();

  const handleClose = (bool: boolean = false) => {
    onClose(bool ? selectedTreatment : undefined);
    setSelectedTreatment(undefined)
  }

  return (
    <Modal
      open={openModal}
      title={strings.add_text_template}
      handleClose={handleClose}
      cancelButton={
        <CancelButton
          fullWidth
          onClick={() => handleClose(false)}
        >{strings.Cancel}
        </CancelButton>
      }
      submitButton={
        <Button
          fullWidth
          className=""
          onClick={() => {
            handleClose(true);
          }}
        >{strings.Submit}
        </Button>
      }
    >
      <div className="p-4">
        <Autocomplete<Treatment>
          value={treatments?.find(treatment => treatment.id === selectedTreatment?.id)}
          inputProps={{ label: strings.Text, placeholder: strings.Search }}
          renderOption={(treatment) => treatment.name}
          displayValue={(treatment) => treatment?.name ?? ""}
          filteredValues={(query) => treatments.filter((data) => data.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))) ?? []}
          options={treatments}
          onChange={(treatment) => setSelectedTreatment(treatment)}
        />
      </div>

    </Modal>
  );

}

export default ClientProcedureTreatmentTextModel;