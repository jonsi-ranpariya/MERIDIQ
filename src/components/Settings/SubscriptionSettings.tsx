import Button from "@components/form/Button";
import Heading from "@components/heading/Heading";
import CancelButton from "@partials/MaterialButton/CancelButton";
import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useSWR from "swr";
import api from "../../configs/api";
import { cancelSubscription, commonFetch, formatDate, nFormatter } from "../../helper";
import useAuth from "../../hooks/useAuth";
import { ClientsCountResponse } from "../../interfaces/common";
import strings from "../../lang/Lang";

import Modal from "../../partials/MaterialModal/Modal";

export interface SubscriptionSettingsProps {

}

const SubscriptionSettings: React.FC<SubscriptionSettingsProps> = () => {

    const { user, mutate: reload } = useAuth();
    const [openModal, setOpenModal] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { plan: selectedPlan, ends_at } = user?.company?.subscriptions?.find((subscription) => subscription.stripe_status === 'active') || {};
    const navigate = useNavigate();
    const { data } = useSWR<ClientsCountResponse>(api.clientsCount, commonFetch);

    const clientsCount = useMemo(() => data?.data.clients ?? 0, [data]);
    const usersCount = useMemo(() => data?.data.users ?? 0, [data]);

    const handleClose = () => {
        if (isSubmitting) return;
        setOpenModal(false);
    }

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const data = await cancelSubscription();

        if (data.webStatus === 401) {
            navigate('/');
        }

        if (data.status === '1') {
            await reload();
            toast.success(data.message);
        } else {
            toast.error(data.message || 'please try again');
        }
        setOpenModal(false);
        setIsSubmitting(false);
    }

    const onEditClick = () => {
        if (user?.company?.is_subscribed) {
            navigate('/upgrade-plan')
        } else {
            navigate('/subscription')
        }
    }

    return (
        <>
            {subscriptionCancelModal()}
            <div className="border border-lightPurple dark:border-gray-700 rounded-xl p-6 space-y-6">
                <Heading text={strings.MyPlan} variant="headingTitle" />
                {selectedPlan && (
                    <div className="">
                        <p className="font-semibold text-lg mb-2">{`${selectedPlan?.name.toUpperCase()} ${ends_at ? `- Ends At: ${formatDate(ends_at, 'YYYY-MM-DD')}` : ''}`}</p>
                        <p className="text-sm">{`${parseInt(selectedPlan?.users || '1')} ${strings.Users} (${usersCount} ${strings.usedClientCount})`}</p>
                        <p className="text-sm">{`${parseInt(selectedPlan?.client || '1')} ${strings.Clients} (${clientsCount} ${strings.usedClientCount})`}</p>
                        <p className="text-sm">{nFormatter(parseFloat(selectedPlan.cost_value) * parseInt(selectedPlan.users))}{selectedPlan.currency} {strings.per_month}</p>
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    {user?.email === user?.company?.email &&
                        <Button variant="ghost" size="small" onClick={onEditClick} children={strings.editMyPlan} />
                    }
                    {(selectedPlan && user?.email === user?.company?.email && ends_at === null) &&
                        <Button
                            variant="ghost"
                            size="small"
                            color="ghost"
                            onClick={() => setOpenModal(true)}
                            children={strings.cancelSubscription}
                        />
                    }
                </div>
            </div>
        </>
    );

    function subscriptionCancelModal() {
        return (
            <Modal
                open={openModal}
                title={strings.cancelSubscription}
                handleClose={handleClose}
                cancelButton={<CancelButton disabled={isSubmitting} onClick={handleClose} />}
                submitButton={
                    <Button
                        loading={isSubmitting}
                        onClick={() => handleSubmit()}
                        children={strings.Submit}
                    />
                }
            >
                <div className="p-4 py-6 text-center">
                    {strings.cancel_subscription_question}
                </div>
            </Modal>
        )
    }
}

export default SubscriptionSettings;