import Button from "@components/form/Button";
import api from "@configs/api";
import useAuth from "@hooks/useAuth";
import { SubscriptionEditResponse } from "@interface/common";
import strings from "@lang/Lang";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import Modal from "./Modal";

export interface CardDetailsNotFoundProps {

}

const CardDetailsNotFoundModal: React.FC<CardDetailsNotFoundProps> = () => {

  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const isFreePlan = user?.company?.subscriptions.find((p) => p.stripe_status === api.stripeActive)?.plan?.is_free === true
  const { data } = useSWR<SubscriptionEditResponse, Error>(isFreePlan ? null : api.subscriptionEdit);

  useEffect(() => {
    if(isFreePlan || user?.user_role === "master_admin") return
    if (data?.data) {
      if (!data?.data?.card?.last4 || !data?.data?.card?.exp_month) {
        setOpen(true)
      }
    }
  }, [data?.data, data?.data?.card?.exp_month, data?.data?.card?.last4, isFreePlan, user?.user_role])

  if (isFreePlan) {
    return <></>
  }

  return (
    <Modal
      open={open}
      handleClose={() => setOpen(false)}
      title={strings.important}
      submitButton={
        <Button onClick={() => { setOpen(false); navigate('/settings/billing') }}>
          {strings.updateCardInfo}
        </Button>
      }
    >
      <div className="p-6 pt-2">
        <p>{strings.card_not_found}</p>
      </div>
    </Modal>
  );
}

export default CardDetailsNotFoundModal;