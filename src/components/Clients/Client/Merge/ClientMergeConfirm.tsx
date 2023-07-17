
import strings from "@lang/Lang";
import Modal from "@partials/MaterialModal/Modal";
import Button from '@components/form/Button';
import Checkbox from "@partials/MaterialCheckbox/MaterialCheckbox";
import useAuth from "@hooks/useAuth";
import { generateUserFullName } from "../../../../../src/helper";
import { Formik } from "formik";
import { validateClientMergeConfirm } from "../../../../../src/validations";

export interface IClientMergeConfirmValue {
    is_check: boolean,
}
export interface ClientMergeConfirmProps {
    openModal: boolean
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    open?: boolean,
    handleClose?: () => void,
    handleMergeSubmit: () => void
}

const ClientMergeConfirmModal: React.FC<ClientMergeConfirmProps> = ({
    openModal,
    setOpenModal, handleMergeSubmit
}) => {
    const { user } = useAuth()
    const handleModalClose = async () => {
        setOpenModal(false)
    }

    return (
        <Formik<IClientMergeConfirmValue>
            initialValues={{ is_check: false }}
            enableReinitialize
            validate={validateClientMergeConfirm}
            onSubmit={handleMergeSubmit}
        >
            {({ errors, resetForm, values, touched, dirty, isSubmitting, isValidating, handleSubmit, setFieldTouched, setFieldValue, handleBlur, handleChange }) => {
                return (
                    <Modal
                        open={openModal}
                        handleClose={handleModalClose}
                        title={strings.merge_client_accounts}
                        cancelButton={
                            <Button
                                variant="outlined"
                                onClick={handleModalClose}
                            >{strings.previous}
                            </Button>
                        }
                        submitButton={
                            <Button
                                type="button"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                {strings.merge}
                            </Button>
                        }
                    >
                        <div className="space-y-2 p-6">
                            <Checkbox
                                name='is_check'
                                checked={values.is_check === true}
                                onChange={handleChange}
                                label={strings.formatString(strings.merge_confirm_note, generateUserFullName(user)) as string}
                                error={touched?.is_check}
                                helperText={errors.is_check}
                            />
                        </div>
                    </Modal>
                )
            }}
        </Formik>
    );
}

export default ClientMergeConfirmModal;