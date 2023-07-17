import { useFormikContext } from "formik";
import React from "react";
import useRegistrationPortal from "../../../hooks/useRegistrationPortal";
import { AestheticInterestValues } from "../../../interfaces/questionary";
import strings from "../../../lang/Lang";
import FormikErrorFocus from "../../../partials/FormikErrorFocus/FormikErrorFocus";
import Button from '@components/form/Button';
import AestheticInterestComponent from "../../../partials/Qestionary/AestheticInterestComponent";
import ScrollToTopOnMount from "../../../partials/Scroll/ScrollToTopOnMount";
import RegistrationCard from "../card/RegistrationCard";
import RegistrationPortalConsent from "./RegistrationPortalConsent";

export interface RegistrationPortal4Props {

}

const RegistrationPortal4: React.FC<RegistrationPortal4Props> = () => {

    const { isSubmitting, isValidating, handleSubmit } = useFormikContext<AestheticInterestValues>();
    const { previous, nextPageTitle } = useRegistrationPortal();

    return (
        <RegistrationCard title={strings.Aestethicinterest} fullWidth>
            <ScrollToTopOnMount />


            <div className="">
                <FormikErrorFocus />

                <AestheticInterestComponent />

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

export default RegistrationPortal4;