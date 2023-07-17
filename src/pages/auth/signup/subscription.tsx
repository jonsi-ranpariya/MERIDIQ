import Card from "@components/card";
import Heading from "@components/heading/Heading";
import useSubscription from "@hooks/useSubscription";
import strings from "@lang/Lang";
import LogoWithName from "@partials/Icons/LogoWithName";
import SectionSuspense from "@partials/Loadings/SectionLoading";
import { SubscriptionProvider } from "@provider/SubscriptionProvider";
import { lazy } from "react";
import { useLocation } from "react-router-dom";

const SubscriptionStep1 = lazy(() => import("@components/Subscription/SubscriptionStep1"));
const SubscriptionStep2 = lazy(() => import("@components/Subscription/SubscriptionStep2"));

export interface SubscriptionProps {

}

const SignupSubscription: React.FC<SubscriptionProps> = () => {

  const { showModal } = useSubscription();
  const { pathname } = useLocation()
  const upgrade = pathname === "/upgrade-plan"

  return (
    <div className="">
      {
        !upgrade && <div className="container px-6 mt-8">
          <div className="mx-auto">
            <LogoWithName />
          </div>
        </div>
      }
      <div className={`${!upgrade && 'max-w-3xl container mt-6 px-6'} `}>
        <Card className="text-dimGray dark:text-white px-6">
          <div className={`${upgrade ? 'max-w-lg' : 'max-w-md'} mx-auto lg:py-8`}>
            <div className="pb-3 space-y-3">
              {
                !upgrade && <Heading text={strings.Subscription} variant="bigTitle" />
              }
              {
                !showModal &&
                <>
                  <p className="text-sm">{strings.Subscription_text_detail}</p>
                  <p className="text-sm">{strings.Subscription_support_detail_1}</p>
                </>
              }
            </div>
            <SectionSuspense>
              {
                showModal
                  ? <SubscriptionStep2 />
                  : <SubscriptionStep1 />
              }
            </SectionSuspense>
          </div>
        </Card>
      </div>
    </div>
  );
}

export interface SubscriptionHocProps {
  upgrade?: boolean,
}

const SubscriptionHoc: React.FC<SubscriptionHocProps> = ({ upgrade = false }) => {
  return (
    <SubscriptionProvider upgrade={upgrade}>
      <SignupSubscription />
    </SubscriptionProvider>
  );
}

export default SubscriptionHoc;