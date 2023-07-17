import Button from '@components/form/Button';
import { useFormikContext } from "formik";
import React from "react";
import useRegistrationPortal from "../../../hooks/useRegistrationPortal";
import { Covid19QuestionaryValues } from "../../../interfaces/questionary";
import strings from "../../../lang/Lang";
import FormikErrorFocus from "../../../partials/FormikErrorFocus/FormikErrorFocus";
import Covid19QuestionaryComponent from "../../../partials/Qestionary/Covid19QuestionaryComponent";
import ScrollToTopOnMount from "../../../partials/Scroll/ScrollToTopOnMount";
import RegistrationCard from "../card/RegistrationCard";
import RegistrationPortalConsent from "./RegistrationPortalConsent";


export interface RegistrationPortal5Props {

}

const RegistrationPortal5: React.FC<RegistrationPortal5Props> = () => {

    const { isSubmitting, isValidating, handleSubmit } = useFormikContext<Covid19QuestionaryValues>();
    const { previous, nextPageTitle } = useRegistrationPortal();

    return (
        <RegistrationCard fullWidth title={strings.Covid19Questionnaire}>
            <ScrollToTopOnMount />
            <div className="">
                <FormikErrorFocus />

                <Covid19QuestionaryComponent />

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
                            loading={isSubmitting || isValidating}
                            fullWidth
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

export default RegistrationPortal5;