import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import { FC, lazy, useState } from "react";
import useSWR from "swr";
import api from "../../../configs/api";
import { commonFetch, printDetails } from "../../../helper";
import { SubscriptionEditResponse } from "../../../interfaces/common";
import strings from "../../../lang/Lang";
import Button from '@components/form/Button';
import ModalSuspense from '@partials/Loadings/ModalLoading';
const PaymentEditModal = lazy(() => import("../PaymentEditModal"))

const CompanyBillingDetail: FC<{}> = () => {
  const { data, error, mutate } = useSWR<SubscriptionEditResponse, Error>(api.subscriptionEdit, commonFetch);

  const [paymentOption, setPaymentOption] = useState<{ open: boolean, showBillingDetail: boolean, showCard: boolean }>({
    open: false,
    showBillingDetail: false,
    showCard: false,
  });

  const loading = !data && !error

  if (!data?.data && !loading) {
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

      <div className="border dark:border-gray-700 rounded-xl p-6 space-y-6">
        <Heading text={strings.billingDetails} variant="headingTitle" />
        {
          loading
            ? <>
              <Skeleton className="w-48 h-6" />
              <Skeleton className="w-36 h-6" />
              <Skeleton className="w-40 h-6" />
            </>
            : <div className="">
              <p className='font-semibold text-lg mb-2'>{data?.data?.name}</p>
              <p className="whitespace-pre-wrap">
                {
                  printDetails([
                    data?.data?.address?.line1,
                    data?.data?.address?.city,
                    (data?.data?.address?.postal_code ?? '') + " " + (data?.data?.address?.country ?? ''),
                    ...[data?.data?.vat_number ? `VAT: ${data?.data?.vat_number}` : '']
                  ])
                }
              </p>
              <Button
                size="small"
                variant='ghost'
                className='mt-6'
                onClick={() => {
                  setPaymentOption({
                    open: true,
                    showBillingDetail: true,
                    showCard: false,
                  })
                }}
                disabled={loading}
              >
                {strings.updateBillingInfo}
              </Button>
            </div>
        }
      </div>
    </>
  );
}

export default CompanyBillingDetail