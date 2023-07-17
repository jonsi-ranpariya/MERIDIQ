import { Formik, FormikErrors, FormikHelpers } from 'formik';
import * as React from 'react';
import strings from '../../lang/Lang';

interface IRegistrationPortalWizardProps {
    onSubmit?: (values: any, bag: FormikHelpers<any>) => void,
    children: React.ReactNode
}



interface IRegistrationPortalWizardStepProps<T> {
    name: string,
    title: string,
    onSubmit?: (values: T, bag: FormikHelpers<T>) => Promise<void | boolean> | boolean | void,
    initialValues: T,
    validate: (values: T) => void | object | Promise<FormikErrors<T>>
}

export const RegistrationPortalContext = React.createContext<{
    nextPageTitle: string,
    currentStep: number,
    totalSteps: number,
    isLastStep: boolean,
    hasConsent: boolean,
    setHasConsent: React.Dispatch<React.SetStateAction<boolean>>,
    previous: () => void,
}>({
    nextPageTitle: '',
    currentStep: 0,
    totalSteps: 0,
    isLastStep: false,
    hasConsent: false,
    setHasConsent: () => {},
    previous: () => {},
});

const RegistrationPortalWizard: React.FC<IRegistrationPortalWizardProps> = ({ children, onSubmit = () => {} }) => {
    const [stepNumber, setStepNumber] = React.useState(0);
    const steps = React.Children.toArray(children) as unknown as React.Component<IRegistrationPortalWizardStepProps<any>>[];
    const step = steps[stepNumber];

    const [hasConsent, setHasConsent] = React.useState(false);

    const [snapshot, setSnapshot] = React.useState(steps.reduce((result: { [value: string]: any }, data) => {
        result[data.props.name] = data.props.initialValues;
        return result;
    }, {}));

    React.useEffect(() => {
        setSnapshot(steps.reduce((result: { [value: string]: any }, data) => {
            result[data.props.name] = data.props.initialValues;
            return result;
        }, {}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps.length])

    const totalSteps = steps.length;
    const isLastStep = stepNumber === totalSteps - 1;

    const next = (values: any) => {
        setSnapshot((data: any) => ({ ...data, [step.props.name]: values }));
        setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
    };

    const previous = (values: any) => {
        setSnapshot((data: any) => ({ ...data, [step.props.name]: values }));
        setStepNumber(Math.max(stepNumber - 1, 0));
    };

    const handleSubmit = async (values: any, bag: FormikHelpers<any>) => {
        if (step.props.onSubmit) {
            const value = await step.props.onSubmit({ ...values, hasConsent: hasConsent }, bag);
            if (value === false) {
                return;
            }
        }

        if (isLastStep) {
            if (!hasConsent) {
                bag.setFieldError('consent', strings.please_provide_consent);
                return;
            };
            const data = await onSubmit({ ...snapshot, [step.props.name]: values, hasConsent: hasConsent, }, bag);
            setSnapshot((data: any) => ({ ...data, [step.props.name]: values }));
            return data;
        } else {
            // bag.setTouched({});
            next(values);
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={snapshot[step.props.name]}
            onSubmit={handleSubmit}
            validate={step.props.validate}
        >
            {(formik) => {
                return (
                    <RegistrationPortalContext.Provider
                        value={{
                            nextPageTitle: isLastStep ? strings.SAVEANDFINISH : steps[stepNumber + 1].props.title,
                            currentStep: stepNumber + 1,
                            totalSteps: totalSteps,
                            isLastStep: isLastStep,
                            hasConsent: hasConsent,
                            setHasConsent: setHasConsent,
                            previous: () => previous(formik.values),
                        }}
                    >
                        {/* @ts-ignore */}
                        {step}
                    </RegistrationPortalContext.Provider>
                );
            }}
        </Formik>
    );
};

type RegistrationPortalWizardStepProps<T> = React.PropsWithChildren<IRegistrationPortalWizardStepProps<T>>;

export const RegistrationPortalWizardStep = <T,>({ children }: RegistrationPortalWizardStepProps<T>): React.ReactElement => (<>{children}</>);

export default RegistrationPortalWizard;
