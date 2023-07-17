import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import strings from "../../lang/Lang";
import Button from '@components/form/Button';
import CancelButton from "../MaterialButton/CancelButton";
import Checkbox from "../MaterialCheckbox/MaterialCheckbox";
import Modal from "./Modal";

function QuickGuideModal() {
    const { storedValue: isQuickGuide, setStorageValue: setIsQuickGuide } = useLocalStorage('isQuickGuide', true);
    const { storedValue: showQuickGuide, setStorageValue: setShowQuickGuide } = useLocalStorage('showQuickGuide', true);
    const { user } = useAuth();
    const [neverShow, setNeverShow] = useState(false);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const location = useLocation();

    const neverShowQuickGuide = () => {
        setShowQuickGuide(false);
        setIsQuickGuide(false);
    };

    useEffect(() => {
        setShowQuickGuide(isQuickGuide);
    }, [isQuickGuide, setShowQuickGuide]);

    if (user?.user_role === 'master_admin') {
        return null;
    }

    return (
        <Modal
            open={!!(showQuickGuide && !location.pathname.includes('subscription')
                && !location.pathname.includes('upgrade-plan') && !location.pathname.includes('registration'))}
            title={strings.QuickGuide}
            handleClose={() => {
                setShowQuickGuide(false);
            }}
            cancelButton={
                <CancelButton
                    fullWidth
                    onClick={() => {
                        if (neverShow) {
                            neverShowQuickGuide();
                        }
                        setShowQuickGuide(false);
                    }}
                >{strings.skip}
                </CancelButton>
            }
            submitButton={
                <Button
                    fullWidth
                    className=""
                    onClick={() => {
                        if (neverShow) {
                            neverShowQuickGuide();
                        }
                        setShowQuickGuide(false);
                        if (!linkRef.current) return;
                        linkRef.current.click();
                    }}
                >{strings.View}
                </Button>
            }
        >
            <div className="p-4">
                <p>{strings.QuickGuide_start}</p>
                <Checkbox
                    label={strings.QuickGuideDontShowStartUp}
                    checked={neverShow}
                    onChange={(event) => {
                        setNeverShow(event.target.checked);
                    }}
                />
            </div>
            <a className="hidden" href="https://meridiq.com/quick-guide/" ref={linkRef} target="_blank" rel="noopener noreferrer">{strings.QuickGuide_start}</a>
        </Modal>
    )
}

export default QuickGuideModal
