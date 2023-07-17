
import Button from "@components/form/Button";
import * as React from "react";
import strings from "../lang/Lang";
import CancelButton from "../partials/MaterialButton/CancelButton";
import Modal, { MaterialModalProps } from "../partials/MaterialModal/Modal";

interface NewMaterialModalProps extends Omit<MaterialModalProps, 'cancelButton' | 'submitButton'> {
    showCancel?: boolean,
    showSubmit?: boolean,
    submitText?: string,
    cancelText?: string,
}

const ConfirmationServiceContext = React.createContext<
    (options: NewMaterialModalProps) => Promise<void>
>(Promise.reject);

export const useConfirmation = () =>
    React.useContext(ConfirmationServiceContext);

export const ConfirmationProvider = ({ children }: { children: React.ReactNode }) => {
    const [
        confirmationState,
        setConfirmationState
    ] = React.useState<NewMaterialModalProps | null>(null);

    const awaitingPromiseRef = React.useRef<{
        resolve: () => void;
        reject: () => void;
    }>();

    const openConfirmation = (options: NewMaterialModalProps) => {
        setConfirmationState(options);
        return new Promise<void>((resolve, reject) => {
            awaitingPromiseRef.current = { resolve, reject };
        });
    };

    const handleClose = () => {
        if (awaitingPromiseRef.current) {
            awaitingPromiseRef.current.reject();
        }

        setConfirmationState(null);
    };

    const handleSubmit = () => {
        if (awaitingPromiseRef.current) {
            awaitingPromiseRef.current.resolve();
        }

        setConfirmationState(null);
    };

    return (
        <>
            <ConfirmationServiceContext.Provider
                value={openConfirmation}
                children={children}
            />
            {
                Boolean(confirmationState?.open) &&
                <Modal
                    open={true}
                    handleClose={handleClose}
                    cancelButton={
                        confirmationState?.showCancel ?
                            <CancelButton fullWidth onClick={handleClose}>
                                {confirmationState?.cancelText || strings.No}
                            </CancelButton> : undefined
                    }
                    submitButton={
                        confirmationState?.showSubmit ?
                            <Button fullWidth onClick={handleSubmit}>
                                {confirmationState?.submitText || strings.Yes}
                            </Button> : undefined
                    }
                    {...confirmationState}
                />
            }
        </>
    );
};
