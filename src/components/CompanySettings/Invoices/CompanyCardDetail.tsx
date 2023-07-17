import Button from '@components/form/Button';
import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import useAuth from '@hooks/useAuth';
import CardIcon from '@partials/Icons/Card';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import { FC, lazy, useState } from "react";
import useSWR from "swr";
import api from "../../../configs/api";
import { commonFetch } from "../../../helper";
import { SubscriptionEditResponse } from "../../../interfaces/common";
import strings from "../../../lang/Lang";
const PaymentEditModal = lazy(() => import("../PaymentEditModal"))

const CompanyCardDetail: FC<{}> = () => {
  const { data, error, mutate } = useSWR<SubscriptionEditResponse, Error>(api.subscriptionEdit, commonFetch);
  const { user } = useAuth()

  const [paymentOption, setPaymentOption] = useState<{ open: boolean, showBillingDetail: boolean, showCard: boolean }>({
    open: false,
    showBillingDetail: false,
    showCard: false,
  });

  const loading = !data && !error

  if (!data?.data && !loading) {
    return <></>
  }

  const isFreePlan = user?.company?.subscriptions.find((p) => p.stripe_status === api.stripeActive)?.plan?.is_free === true

  if (isFreePlan) {
    return <></>
  }

  return (
    <>
      <ModalSuspense>
        {
          paymentOption.open &&
          <PaymentEditModal
            handleClose={() => {
              setPaymentOption((data) => ({ ...data, open: false, }))
              mutate();
            }}
            openModal={paymentOption.open}
            showBillingDetail={paymentOption.showBillingDetail}
            showCard={paymentOption.showCard}
          />
        }
      </ModalSuspense>

      {
        <div className="border dark:border-gray-700 rounded-xl p-6 space-y-6">
          <Heading text={strings.cardDetails} variant="headingTitle" />
          {
            loading
              ? <>
                <Skeleton className="w-full h-12 block" />
                <Skeleton className="w-full h-2" />
              </>
              : (data?.data?.card?.last4 || data?.data?.card?.exp_month) ?
                <>
                  <div className="flex items-center">
                    <div className="bg-gray-200 dark:bg-primaryLight/[12%] px-2 py-1 rounded-md">
                      <CardIcon className="text-3xl text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="pl-3">
                      <p className="flex items-center">
                        <span>{"•••• ".repeat(3)}&nbsp;</span>
                        <span>{`${data?.data?.card?.last4}`}</span>
                      </p>
                      <p className="text-xs inline bg-gray-200 dark:bg-primaryLight/[12%] px-2 py-0.5 rounded">{strings.expires}: {`${data?.data?.card?.exp_month}`}/{`${data?.data?.card?.exp_year}`}</p>
                    </div>
                  </div>
                </>
                : <></>}
          <Button
            size="small"
            variant='ghost'
            className='mt-6'
            onClick={() => {
              setPaymentOption({
                open: true,
                showBillingDetail: false,
                showCard: true,
              })
            }}
            disabled={loading}
          >
            {strings.updateCardInfo}
          </Button>
        </div >
      }
    </>
  );
}

export default CompanyCardDetail