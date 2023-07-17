import Button from "@components/form/Button";
import Heading from "@components/heading/Heading";
import api from "@configs/api";
import useAuth from "@hooks/useAuth";
import useSubscription from "@hooks/useSubscription";
import ClientsIcon from "@icons/Clients";
import UserIcon from "@icons/User";
import { ClientsCountResponse } from "@interface/common";
import { NewPlan } from "@interface/model/plan";
import strings from "@lang/Lang";
import CheckCircleIcon from "@partials/Icons/CheckCircle";
import { ReactNode, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

export interface SubscriptionStep1Props {
  upgrade?: boolean
}

const employees = Array.from(Array(15).keys())

const SubscriptionStep1: React.FC<SubscriptionStep1Props> = ({ upgrade }) => {

  const { user } = useAuth()
  const selectedEmployeeCount = useMemo(() => user?.company?.settings?.find(val => val.key === "NUMBER_OF_EMPLOYEES")?.value, [user?.company?.settings])
  const { data } = useSWR<ClientsCountResponse>(api.clientsCount);

  const { plans, formik, setShowModal, loading } = useSubscription();
  const clientsCount = useMemo(() => data?.data.clients ?? 0, [data]);
  const usersCount = useMemo(() => data?.data.users ?? 0, [data]);

  const freePlan = useMemo(() => plans?.find(plan => plan.is_free), [plans]);
  const currentPlan = useMemo(() => plans?.find(plan => plan.is_selected), [plans]);
  const { ends_at } = user?.company?.subscriptions?.find((subscription) => subscription.stripe_status === 'active') || {};

  const [sliderValue, setSliderValue] = useState<NewPlan | undefined>(currentPlan || freePlan);

  const sliderDisplayValue = sliderValue?.is_free ? 0 : sliderValue?.quantity ?? 0;
  const selectedUsers = sliderValue?.users ?? 0;
  const selectedClients = sliderValue?.client ?? 0;
  const currentPlanUsers = currentPlan?.users ?? 0;
  const currentPlanClients = currentPlan?.client ?? 0;

  useEffect(() => {
    if (!currentPlan && selectedEmployeeCount) {
      setSliderValue(plans?.find(plan => plan.users === parseInt(selectedEmployeeCount)))
    }
    else if (!currentPlan && freePlan) {
      setSliderValue(freePlan)
    }
  }, [currentPlan, freePlan, plans, selectedEmployeeCount])

  return (
    <div className="py-4">
      <p className="text-sm">{strings.numberOfEmployees}</p>
      <div className="relative py-5 flex items-center">
        <input
          type="range"
          min="0"
          max={employees.length}
          onChange={(e) => {
            if (plans) setSliderValue(plans[parseInt(e.currentTarget.value)]);
          }}
          value={sliderDisplayValue}
          step="1"
          className="w-full h-2 bg-primary/25 rounded-lg appearance-none cursor-pointer dark:bg-gray-800 peer"
        />
        <span className="peer-hover:opacity-100 z-10 transition-opacity opacity-0 absolute items-center h-2 justify-between pointer-events-none rounded-lg" style={{ width: `calc(${((sliderDisplayValue) / (employees.length)) * 100}% - ${sliderDisplayValue}px)` }}>
          <div className="absolute -right-6 bottom-5 font-medium bg-primary h-8 w-8 rounded-full rounded-br-none rotate-45 flex justify-center items-center text-white">
            <span className="-rotate-45 text-lg">{sliderDisplayValue || "1"}</span>
          </div>
        </span>
        <span className="absolute flex w-full items-center justify-between pointer-events-none px-2.5">
          {[...employees, 16].map(index => <span key={index} className="h-2 w-0.5 bg-primary first-of-type:bg-transparent first-of-type:w-0 last-of-type:bg-transparent last-of-type:w-0" />)}
        </span>
        <span className="absolute flex w-full items-center justify-between pointer-events-none overflow-hidden rounded-lg">
          <span className="bg-primary h-2" style={{ width: `${((sliderDisplayValue) / (employees.length)) * 100}%` }} />
        </span>
        <span className="peer-hover:opacity-0 opacity-100 absolute items-center h-2 justify-between pointer-events-none rounded-lg" style={{ width: `calc(${((sliderDisplayValue) / (employees.length)) * 100}% - ${sliderDisplayValue}px)` }}>
          <div className="absolute -right-6 top-3 font-medium h-8 w-8 rounded-full rounded-tl-none rotate-45 flex justify-center items-center text-primary">
            <span className="-rotate-45 text-xl">{sliderDisplayValue || "1"}</span>
          </div>
        </span>
      </div>
      <div className="pt-6 pb-2">
        <Heading
          variant="bigTitle"
          text={sliderValue?.is_free ? sliderValue.name : `${sliderValue?.cost_value || ''}${sliderValue?.currency || ''}`}
        />
        <p className="text-sm mt-0.5">{strings.monthly_subscription} ({strings.excl_VAT})</p>
      </div>
      <div className="py-6">
        <p className="uppercase mb-1">{strings.youGet} :</p>
        <div className="flex items-center">
          <IconCountText text={strings.users} count={sliderValue?.users || 1} icon={<UserIcon />} />
          <p className="px-4 text-3xl text-center">+</p>
          <IconCountText text={strings.Clients} count={sliderValue?.client || 20} icon={<ClientsIcon />} />
        </div>
      </div>
      <div className="pb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CheckWithText text={`${strings.Up_to} ${sliderValue?.users || 1} ${strings.Users}`} />
        <CheckWithText text={`${strings.Up_to} ${sliderValue?.client || 0} ${strings.Clients}`} />
        <CheckWithText text={`${strings.UnlimitedStorage}`} />
        <CheckWithText text={`${strings.CustomerSupport}`} />
      </div>
      <Button
        fullWidth
        size="big"
        type="submit"
        disabled={buttonDisabled()}
        onClick={onSelect}
        loading={loading || formik?.isSubmitting || formik?.isValidating}
      >
        {getButtonName()}
      </Button>
    </div>
  );

  function getButtonName() {
    if ((!currentPlan || ends_at) && !sliderValue?.is_selected) {
      return strings.Select
    }

    if (sliderValue?.is_selected) {
      return strings.CurrentPlan;
    }

    if (currentPlanUsers < selectedUsers && currentPlanClients < selectedClients) {
      return strings.UpgradePlan;
    }

    if (currentPlan?.is_free && selectedClients >= clientsCount) {
      return strings.UpgradePlan;
    }

    // sliderValue = selected plan
    // usersCount = current used users
    // clientsCount = current used clients
    if (selectedUsers >= usersCount && selectedClients >= clientsCount) {
      return strings.downgradePlan;
    }

    return strings.downgradePlan;
  }

  function buttonDisabled() {
    if (!currentPlan) {
      return false;
    }

    const selectedPlanIsLowerButNotTooLow = selectedUsers >= usersCount && selectedClients >= clientsCount;
    if (sliderValue?.is_selected) {
      return true;
    }
    // const currentPlanIsLower = currentPlanUsers >= selectedUsers && currentPlanClients >= selectedClients;
    if (selectedPlanIsLowerButNotTooLow) {
      return false;
    }

    if (sliderValue?.is_disabled) {
      return true;
    }

    return false;
  }

  async function onSelect() {
    if (!sliderValue || sliderValue.is_selected) {
      return;
    }

    await formik?.setValues({
      ...formik.values,
      plan: sliderValue.plan_id,
      shouldValidate: sliderValue.show_popup,
      count: sliderValue.quantity
    })

    if (!sliderValue.show_popup) {
      await formik?.submitForm();
    } else {
      setShowModal(true);
    }

  }
}

export interface CheckWithTextProps {
  text: string
}

const CheckWithText: React.FC<CheckWithTextProps> = ({
  text
}) => {
  return (
    <div className="flex items-center space-x-2">
      <CheckCircleIcon className='text-primary text-2xl' />
      <p>{text}</p>
    </div>
  );

}

export interface IconCountTextProps {
  text: string
  count: number | string
  icon: ReactNode
}

const IconCountText: React.FC<IconCountTextProps> = ({
  text, count, icon
}) => {
  return (
    <div className="items-center w-full flex space-x-3">
      <span className="bg-primary/[12%] p-3 block rounded-full text-primary text-3xl">
        {icon}
      </span>
      <span>
        <Heading text={count} variant="bigTitle" />
        <p className="-mt-1">{text}</p>
      </span>
    </div>
  );
}

export default SubscriptionStep1;