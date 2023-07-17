import Button from '@components/form/Button';
import Input from "@components/form/Input";
import LoadingIcon from "@icons/Loading";
import { Formik } from "formik";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSWR from "swr";
import api from "../../../../configs/api";
import { ClientKindResponse } from "../../../../interfaces/common";
import strings from "../../../../lang/Lang";
import ServerError from "../../../../partials/Error/ServerError";
import FormikErrorFocus from "../../../../partials/FormikErrorFocus/FormikErrorFocus";
import CancelButton from "../../../../partials/MaterialButton/CancelButton";
import Modal from "../../../../partials/MaterialModal/Modal";
import { validateClientNextKind } from "../../../../validations";

export interface ClientNextOfKindModalProps {
  openModal: boolean,
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
  mutate?: () => Promise<any>,
}

export interface IClientNextOfKindValues {
  name: string,
  email: string,
  phone: string,
  relation: string,
  server?: string,
}

const ClientNextOfKindModal: React.FC<ClientNextOfKindModalProps> = ({
  openModal,
  setOpenModal,
  mutate = async () => {},
}) => {

  const { clientId }: { clientId?: string } = useParams();
  const { data, error, mutate: kindMutate } = useSWR<ClientKindResponse, Error>(api.clientKind(clientId));

  const isLoading = !data && !error;

  return (
    <Formik<IClientNextOfKindValues>
      initialValues={{
        name: data?.data?.name ?? '',
        email: data?.data?.email ?? '',
        phone: data?.data?.phone ?? '',
        relation: data?.data?.relation ?? '',
      }}
      enableReinitialize
      validate={validateClientNextKind}
      onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {

        const response = await fetch(api.clientKindStore(clientId), {
          method: 'POST',
          headers: {
            "Accept": 'application/json',
            'X-CSRF-TOKEN': 'test',
            'X-App-Locale': strings.getLanguage(),
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.status === '1') {
          await kindMutate();
          await mutate();
          await resetForm();
          toast.success(data.message);
          setOpenModal(false);
        } else {
          setFieldError('server', data.message || 'server error, please contact admin.');
        }
        setSubmitting(false);
      }}
    >
      {({ errors, resetForm, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError }) => {

        const handleClose = async () => {
          if (isSubmitting) return;
          setOpenModal(false);
          await resetForm();
        }

        return (
          <Modal
            open={openModal}
            title={strings.client_next_of_kind}
            handleClose={handleClose}
            cancelButton={
              <CancelButton disabled={isSubmitting} onClick={handleClose}>
                {strings.Cancel}
              </CancelButton>
            }
            submitButton={
              <Button
                className=""
                loading={!!isSubmitting}
                disabled={!!isSubmitting}
                onClick={() => {
                  if (!dirty) {
                    toast.success(strings.no_data_changed)
                    handleClose();
                    return;
                  }
                  if (handleSubmit) return handleSubmit();
                }}
              >{strings.Submit}
              </Button>
            }
          >
            <div className="p-4">
              <div className="grid grid-flow-row gap-4">
                <FormikErrorFocus />
                {
                  isLoading ? <div className="w-full flex justify-center">
                    <LoadingIcon />
                  </div>
                    : error
                      ? <ServerError className="mt-4" error={error.message} />
                      : <>
                        <Input
                          name="name"
                          type="text"
                          value={values.name}
                          onChange={(e) => {
                            setFieldTouched('name');
                            setFieldValue('name', e.target.value)
                          }}
                          error={touched?.name && errors.name}
                          label={strings.Name}
                          required
                        />
                        <Input
                          name="email"
                          type="text"
                          value={values.email}
                          onChange={(e) => {
                            setFieldTouched('email');
                            setFieldValue('email', e.target.value)
                          }}
                          error={touched?.email && errors.email}
                          label={strings.Email}
                        />

                        <Input
                          name="phone"
                          type="text"
                          value={values.phone}
                          onChange={(e) => {
                            setFieldTouched('phone');
                            setFieldValue('phone', e.target.value)
                          }}
                          error={touched?.phone && errors.phone}
                          label={strings.PhoneNumber}
                        />

                        <Input
                          name="relation"
                          type="text"
                          value={values.relation}
                          onChange={(e) => {
                            setFieldTouched('relation');
                            setFieldValue('relation', e.target.value)
                          }}
                          error={touched?.relation && errors.relation}
                          label={strings.relation}
                        />

                        <ServerError className="mt-4" error={errors?.server} />
                      </>
                }

              </div>
            </div>
          </Modal>
        );
      }}
    </Formik>

  );
}

export default ClientNextOfKindModal;