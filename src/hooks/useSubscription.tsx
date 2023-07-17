import { useContext } from "react";
import { SubscriptionContext } from "../provider/SubscriptionProvider";

export default function useSubscription() {
    const context = useContext(SubscriptionContext);

    return context;
}