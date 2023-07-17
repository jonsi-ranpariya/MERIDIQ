import TextArea from "@components/form/TextArea";
import strings from "@lang/Lang";
import Modal from "@partials/MaterialModal/Modal";
import { Formik } from "formik";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../configs/api";
import { Verification } from "../../../../interfaces/model/client";
import Button from '@components/form/Button';
import CancelButton from "../../../../partials/MaterialButton/CancelButton";
import MaterialCheckbox from "../../../../partials/MaterialCheckbox/MaterialCheckbox";

import { validateClientVerification } from "../../../../validations";

export interface ClientVerificationModalProps {
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  mutate?: () => Promise<any>,
  verification?: Verification
}

export interface IClientVerificationValues {
  has_id?: boolean
  has_driving_license?: boolean
  has_passport?: boolean
  other?: boolean
  note?: string
  server?: string,
}

const ClientVerificationModal: FC<ClientVerificationModalProps> = ({
  openModal,
  setOpenModal,
  mutate = async () => {},
  verification,
}) => {

  const { clientId }: { clientId?: string } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModelClose = () => {
    if (isSubmitting) return;
    setOpenModal(false);
  }

  return (
    <Formik<IClientVerificationValues>
      initialValues={{
        has_id: !!verification?.has_id,
        has_driving_license: !!verification?.has_driving_license,
        has_passport: !!verification?.has_passport,
        other: !!verification?.other,
        note: verification?.note ?? "",
      }}
      enableReinitialize
      validate={validateClientVerification}
      onSubmit={async (values, { resetForm, setErrors, setSubmitting }) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.set('has_id', values?.has_id?.toString() ?? '');
        formData.set('has_driving_license', values?.has_driving_license?.toString() ?? '');
        formData.set('has_passport', values?.has_passport?.toString() ?? '');
        formData.set('other', values?.other?.toString() ?? '');
        formData.set('note', values?.note?.toString() ?? '');

        const response = await fetch(api.clientVerificationStore(clientId ?? 0), {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
            'X-App-Locale': strings.getLanguage(),
          },
          credentials: 'include',
          body: JSON.stringify({ ...values }),
        });
        const data = await response.json();

        if (data.status === '1') {
          resetForm();
          toast.success(data.message);
          setOpenModal(false);
          await mutate();
        }

        setIsSubmitting(false);
        setSubmitting(false);
      }}
    >{({ errors, values, touched, dirty, handleSubmit, isSubmitting, handleBlur, handleChange }) => {
      const handleClose = async () => {
        if (isSubmitting) return;
        setOpenModal(false);
      }
      return <Modal
        open={openModal}
        title={strings.verified}
        loading={isSubmitting}
        handleClose={handleModelClose}
        cancelButton={
          <CancelButton
            fullWidth
            disabled={isSubmitting}
            onClick={handleClose}
          >{strings.Cancel}
          </CancelButton>
        }
        submitButton={
          <Button
            loading={isSubmitting}
            onClick={() => {
              if (!dirty) {
                toast.success(strings.no_data_changed)
                handleClose();
                return;
              }
              handleSubmit();
            }}
          >{strings.Submit}
          </Button>
        }
      >
        <div className="p-4 space-y-2">
          <p className="font-medium mb-2">{strings.this_client_is_verified_by}:</p>
          <div className="pl-1 space-y-2 pb-2">
            <MaterialCheckbox
              checked={!!values.has_id}
              onBlur={handleBlur}
              onChange={handleChange}
              name="has_id"
              error={touched?.has_id && Boolean(errors.has_id)}
              helperText={touched?.has_id && errors.has_id}
              label={strings.id}
            />
            <MaterialCheckbox
              checked={!!values.has_driving_license}
              onBlur={handleBlur}
              onChange={handleChange}
              name="has_driving_license"
              error={touched?.has_driving_license && Boolean(errors.has_driving_license)}
              helperText={touched?.has_driving_license && errors.has_driving_license}
              label={strings.driving_license}
            />
            <MaterialCheckbox
              checked={!!values.has_passport}
              onBlur={handleBlur}
              onChange={handleChange}
              name="has_passport"
              error={touched?.has_passport && Boolean(errors.has_passport)}
              helperText={touched?.has_passport && errors.has_passport}
              label={strings.passport}
            />
            <MaterialCheckbox
              checked={!!values.other}
              onBlur={handleBlur}
              onChange={handleChange}
              name="other"
              error={touched?.other && Boolean(errors.other)}
              helperText={touched?.other && errors.other}
              label={strings.other}
            />
          </div>
          <TextArea
            name="note"
            rows={6}
            label={strings.NOTES}
            value={values.note}
            onBlur={handleBlur}
            onChange={handleChange}
            error={touched?.note && errors.note && errors.note}
          />
        </div>
      </Modal>
    }}
    </Formik>

  );
}

export default ClientVerificationModal;