import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import useRegistrationPortal from "../../../hooks/useRegistrationPortal";
import { HealthQuestionaryValues } from "../../../interfaces/questionary";
import strings from "../../../lang/Lang";
import FormikErrorFocus from "../../../partials/FormikErrorFocus/FormikErrorFocus";
import Button from '@components/form/Button';
import HealthQuestionaryComponent from "../../../partials/Qestionary/HealthQuestionaryComponent";
import ScrollToTopOnMount from "../../../partials/Scroll/ScrollToTopOnMount";
import RegistrationCard from "../card/RegistrationCard";
import RegistrationPortalConsent from "./RegistrationPortalConsent";


export interface RegistrationPortal3Props {

}

const RegistrationPortal3: React.FC<RegistrationPortal3Props> = () => {

    const { isSubmitting, isValidating, handleSubmit } = useFormikContext<HealthQuestionaryValues>();
    const { previous, nextPageTitle } = useRegistrationPortal();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <RegistrationCard fullWidth title={strings.HealthQuestionnaire}>
            <ScrollToTopOnMount />

            <div className="">
                <FormikErrorFocus />

                <HealthQuestionaryComponent />
                <p className="mt-2">{strings.health_bottom_info}</p>
                <RegistrationPortalConsent />

                <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-6 my-10">
                    <div className="">
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={() => {
                                previous()
                            }}
                            disabled={isSubmitting || isValidating}
                        >{strings.PREVIOUS}</Button>
                    </div>
                    <div className="">
                        <Button
                            fullWidth
                            loading={isSubmitting || isValidating}
                            onClick={async () => {
                                await handleSubmit();
                            }}
                        >{nextPageTitle}</Button>
                    </div>
                </div>

            </div>
        </RegistrationCard>
    );
}

export default RegistrationPortal3;