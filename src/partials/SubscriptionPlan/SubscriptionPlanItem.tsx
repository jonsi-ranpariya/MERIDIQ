import React from "react";
import useSubscription from "../../hooks/useSubscription";
import { Plan } from "../../interfaces/model/plan";
import strings from "../../lang/Lang";
import CheckCircleIcon from "../Icons/CheckCircle";
import Button from '@components/form/Button';

export interface SubscriptionPlanItemProps {
    plan: Plan,
    selected?: boolean,
    focused?: boolean,
    onClick?: () => void,
}

const SubscriptionPlanItem: React.FC<SubscriptionPlanItemProps> = ({
    plan,
    selected = false,
    focused = false,
    onClick = () => {}
}) => {

    const { upgrade } = useSubscription();

    return (
        <div
            className={`bg-white dark:bg-dark-300 overflow-hidden shadow-xl rounded-lg text-center ${focused && !upgrade ? 'lg:transform lg:scale-110' : ''}`}>
            <h3 className={`font-semibold tracking-tight text-3xl py-6 uppercase ${focused && !upgrade ? 'bg-primary dark:text-dark' : selected ? 'bg-success text-white' : 'text-white dark:text-gray-200 bg-dark-500 dark:bg-gray-600'}`}>{plan.name}</h3>
            <div className="py-6">
                <h3 className={`text-4.5xl leading-none font-semibold ${focused && !upgrade ? 'text-primary' : ''}`}>{plan.cost.split(' /')[0]}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.cost.split(' /')[1]}</p>
            </div>
            <div className="px-4 text-sm text-left">
                <hr className="dark:border-gray-600 mb-2" />
                <p className="py-2 flex items-center"><CheckCircleIcon className={`text-xl mr-2 ${focused && !upgrade ? 'text-primary' : selected ? 'text-success' : 'text-dark dark:text-gray-400'}`} /> {plan.users} {strings.User}</p>
                <p className="py-2 flex items-center"><CheckCircleIcon className={`text-xl mr-2 ${focused && !upgrade ? 'text-primary' : selected ? 'text-success' : 'text-dark dark:text-gray-400'}`} /> {plan.client} {strings.Clients}</p>
                <p className="py-2 flex items-center"><CheckCircleIcon className={`text-xl mr-2 ${focused && !upgrade ? 'text-primary' : selected ? 'text-success' : 'text-dark dark:text-gray-400'}`} /> {plan.storage}{strings.GBStorage}</p>
            </div>
            <div className="p-4">
                <Button
                    fullWidth
                    className={`${selected ? 'bg-success text-white dark:text-white' : ''}`}
                    color={focused && !upgrade ? 'primary' : 'secondary'}
                    disabled={selected}
                    onClick={() => {
                        if (selected) return;
                        onClick();
                    }}
                >
                    {selected ? strings.Current : strings.Select}
                </Button>
            </div>
        </div>
    );
}

export default SubscriptionPlanItem;