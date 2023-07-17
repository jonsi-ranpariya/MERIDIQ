import { useFormikContext } from "formik";
import React from "react";
import useRegistrationPortal from "../../../hooks/useRegistrationPortal";
import strings from "../../../lang/Lang";
import FormikErrorFocus from "../../../partials/FormikErrorFocus/FormikErrorFocus";
import Button from '@components/form/Button';
import PortalHeader from "../../../partials/Portal/PortalHeader";
import PortalSteps from "../../../partials/Portal/PortalSteps";
import PortalTitle from "../../../partials/Portal/PortalTitle";
import DynamicQuestionaryComponent from "../../../partials/Qestionary/DynamicQuestionaryComponent";
import ScrollToTopOnMount from "../../../partials/Scroll/ScrollToTopOnMount";
import { DynamicQuestionaryValues } from "../../Clients/Client/Questionaries/DynamicQuestionary/ClientDynamicQuestionariesModal";
import RegistrationPortalConsent from "./RegistrationPortalConsent";
import RegistrationCard from "../card/RegistrationCard";

export interface RegistrationPortalDynamicQuestionaryProps {
    title?: string,
}

const RegistrationPortalDynamicQuestionary: React.FC<RegistrationPortalDynamicQuestionaryProps> = ({ title = '' }) => {

    const { isSubmitting, isValidating, handleSubmit } = useFormikContext<DynamicQuestionaryValues>();
    const { currentStep, totalSteps, previous, nextPageTitle } = useRegistrationPortal();

    return (
        <RegistrationCard fullWidth>
            <ScrollToTopOnMount />
            <PortalHeader
                title={strings.Questionnaire}
                onBackClick={() => {
                    if (isSubmitting) return;

                    previous();
                }}
            />
            <div className="pt-4">
                <PortalSteps
                    step={currentStep}
                    totalSteps={totalSteps}
                />
                <PortalTitle title={title} />
            </div>

            <div className="">
                <FormikErrorFocus />

                <DynamicQuestionaryComponent />

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
                            disabled={isSubmitting || isValidating}
                            loading={isSubmitting}
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

export default RegistrationPortalDynamicQuestionary;