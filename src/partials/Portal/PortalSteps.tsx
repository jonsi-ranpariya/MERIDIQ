export interface PortalStepsProps {
    step: number
    totalSteps: number
}

const PortalSteps: React.FC<PortalStepsProps> = ({
    step,
    totalSteps,
}) => {
    return (
        <div className="text-center text-sm text-primary-600 my-2">
            {`${step}/${totalSteps}`}
        </div>
    );
}

export default PortalSteps;