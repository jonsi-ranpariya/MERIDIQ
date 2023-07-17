import Avatar from "@components/avatar/Avatar";
import LanguageSelect from "@components/form/LanguageSelect";

import { useFormikContext } from "formik";
import { useParams } from "react-router";
import useSWR from "swr";
import api from "../../../configs/api";
import { commonFetch } from "../../../helper";
import useRegistrationPortal from "../../../hooks/useRegistrationPortal";
import { UsersResponse } from "../../../interfaces/common";
import strings from "../../../lang/Lang";
import ServerError from "../../../partials/Error/ServerError";
import Button from '@components/form/Button';
import ScrollToTopOnMount from "../../../partials/Scroll/ScrollToTopOnMount";
import RegistrationCard from "../card/RegistrationCard";
import { RegistrationPortal2Values } from "./RegistrationPortal2";


export interface RegistrationPortal1Props {

}

const RegistrationPortal1: React.FC<RegistrationPortal1Props> = () => {
    const { nextPageTitle } = useRegistrationPortal();
    const { companyId }: { companyId?: string } = useParams();
    const { data: companyData } = useSWR<UsersResponse, Error>(api.companyPublicUsers.replace(":id", companyId!), commonFetch);
    const { handleSubmit, isSubmitting } = useFormikContext<RegistrationPortal2Values>();

    return (
        <RegistrationCard>
            <ScrollToTopOnMount />
            <div className="py-6">
                <div className="text-center">
                    {
                        companyData?.data.length && companyData.data[0].company?.profile_photo ?
                            <Avatar className="mb-4 h-28 w-28 bg-primary/10  mx-auto" src={companyData.data[0].company?.profile_photo ? api.storageUrl(companyData.data[0].company?.profile_photo) : undefined} />
                            : <></>
                    }
                    <h1 className="font-bold text-3xl">{companyData?.data.length && companyData.data[0].company?.company_name}</h1>
                </div>
                <p className="mt-6 text-center">{strings.RegistrationPortal}</p>
                <div className="space-y-8 mt-8 max-w-sm mx-auto">

                    <LanguageSelect />

                    <Button
                        fullWidth
                        size="big"
                        loading={isSubmitting}
                        onClick={async () => {
                            if (isSubmitting) return;
                            await handleSubmit();
                        }}
                    >
                        {nextPageTitle}
                    </Button>

                    <ServerError className="mt-4" error={false} />
                </div>
            </div>
        </RegistrationCard>
    );
}

export default RegistrationPortal1;