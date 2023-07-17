import { Switch as HeadLessSwitch } from "@headlessui/react";
import LoadingIcon from "@icons/Loading";

interface Props extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "onChange"> {
    checked: boolean
    onChange: (checked: boolean) => void
    loading?: boolean
}

const Switch = (({
    checked,
    onChange,
    loading,
    ...props
}: Props) => {
    return (
        <HeadLessSwitch
            checked={checked}
            onChange={onChange}
            disabled={loading || props.disabled}
            className={`${checked ? 'bg-[#82D38F] dark:bg-success' : 'bg-lightPurple dark:bg-gray-600'} disabled:bg-slate-300 dark:disabled:bg-slate-500 relative block h-[30px] w-[50px] cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 focus-visible:ring-opacity-75`}
        >
            <span
                aria-hidden="true"
                className={`${checked ? 'left-[22px] bg-white' : 'left-[2px] bg-white dark:bg-gray-300'} z-10 absolute top-1/2 -translate-y-1/2 pointer-events-none block h-[26px] w-[26px] rounded-full  shadow-lg ring-0 transition-all duration-200 ease-in-out`}
            >
                {loading && <span aria-hidden="true" className="h-full w-full flex justify-center items-center text-sm text-primary"><LoadingIcon /></span>}
            </span>
            <span aria-hidden="true" className="h-2 w-2 absolute top-1/2 -translate-y-1/2 right-2 rounded-full border border-mediumGray" />
            <span aria-hidden="true" className="h-2.5 w-0.5 absolute top-1/2 -translate-y-1/2 left-3 rounded-full bg-white" />
        </HeadLessSwitch>
    );
});

export default Switch;