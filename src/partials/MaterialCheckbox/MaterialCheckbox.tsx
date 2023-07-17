import TinyError from '../Error/TinyError';

interface MaterialCheckboxProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label: string,
    error?: boolean,
    helperText?: string | false,
}

function Checkbox({ label, error = false, helperText, ...props }: MaterialCheckboxProps) {
    return (
        <div className=''>
            <label className="flex items-start space-x-2 cursor-pointer">
                <input type="checkbox" className='form-checkbox checked:dark:border-primary disabled:dark:border-gray-600 dark:border-gray-600 mt-0.5 cursor-pointer rounded h-5 w-5 dark:ring-offset-dimGray disabled:text-mediumGray dark:disabled:bg-gray-600 dark:bg-transparent dark:checked:bg-primary checked:text-primary dark:checked:text-primary ring-0 focus:ring-0 focus-visible:ring-2 focus-visible:ring-primary' {...props} />
                <p className='inline'>{label}</p>
            </label>
            <TinyError
                error={error}
                helperText={helperText}
            />
        </div>
    )
}

export default Checkbox;
