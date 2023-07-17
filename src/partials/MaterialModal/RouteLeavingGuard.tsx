import Button from '@components/form/Button';
import * as H from 'history';
import React, { useEffect, useState } from 'react';
import strings from '../../lang/Lang';
import CancelButton from '../MaterialButton/CancelButton';
import Modal from './Modal';

interface RouteLeavingGuardProps {
    when?: boolean,
    navigate?: (path: H.Location) => void,
    shouldBlockNavigation?: (path: H.Location) => boolean,
    handleSave?: () => void,
    noText?: string,
    yesText?: string,
}

const RouteLeavingGuard: React.FC<RouteLeavingGuardProps> = ({
    when = false,
    navigate = () => {},
    shouldBlockNavigation = () => false,
    handleSave = () => {},
    noText,
    yesText,
}) => {
    // const match = useMatch({ path: '' });

    const [state, setState] = useState<{
        modalVisible: boolean,
        lastLocation: H.Location | null,
        confirmedNavigation: boolean,
    }>({
        modalVisible: false,
        lastLocation: null,
        confirmedNavigation: false,
    });

    // const showModal = (location: H.Location) => setState((localState) => ({
    //     ...localState,
    //     modalVisible: true,
    //     lastLocation: location,
    // }));

    const closeModal = (callback: Function) => {
        setState((localState) => ({
            ...localState,
            modalVisible: false,
        }));
        if (typeof callback === 'function') {
            callback();
        }
    };

    // const handleBlockedNavigation = (nextLocation: H.Location) => {
    //     const { confirmedNavigation } = state;
    //     if ((!confirmedNavigation
    //         && shouldBlockNavigation(nextLocation)
    //         && match?.pathname !== nextLocation.pathname)
    //     ) {
    //         showModal(nextLocation);
    //         return false;
    //     }

    //     return true;
    // };

    useEffect(() => {
        if (state.confirmedNavigation && state.lastLocation !== null) {
            navigate(state.lastLocation);
        }
    }, [state.confirmedNavigation, state.lastLocation, navigate]);

    const handleNo = () => closeModal(() => {
        const { lastLocation } = state;
        if (lastLocation) {
            setState((localState) => ({
                ...localState,
                confirmedNavigation: true,
            }));
        }
    });

    const handleYes = () => closeModal(() => {
        const { lastLocation } = state;
        if (lastLocation) {
            setState((localState) => ({
                ...localState,
                confirmedNavigation: false,
            }));
            handleSave();
        }
    });

    return (
        <>
            {/* <Prompt
                when={when}
                message={handleBlockedNavigation}
            /> */}
            <Modal
                open={state.modalVisible}
                title={strings.Confirmation}
                handleClose={handleNo}
                cancelButton={
                    <CancelButton
                        fullWidth
                        onClick={handleNo}
                    >{noText || strings.No}
                    </CancelButton>
                }
                submitButton={
                    <Button
                        onClick={() => handleYes()}
                    >{yesText || strings.Yes}
                    </Button>
                }
            >
                <div className="p-4">
                    {strings.do_you_want_to_save}
                </div>
            </Modal>
        </>
    );
};

export default RouteLeavingGuard;
