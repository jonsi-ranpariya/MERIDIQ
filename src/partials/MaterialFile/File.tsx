import Error from '@components/form/Error';
import * as React from 'react';
import strings from '../../lang/Lang';

interface FileProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    helperText?: string | false,
    error?: boolean,
}

const File: React.FC<FileProps> = ({ error = false, helperText = '', name, ...props }) => {
    return (
        <div className="grid grid-flow-row grid-cols-1">
            <label
                htmlFor={name || 'file-id'}
                className={`border relative text-left p-4 text-gray-500 dark:text-gray-300 focus-within:ring-2 focus-within:ring-primary rounded border-dashed ${error ? 'border-error' : 'border-gray-400 dark:border-gray-600'}`}
            >
                <p className="text-sm mb-2">{props.multiple ? strings.choose_files_here : strings.choose_file_here}</p>
                <input
                    type="file"
                    id={name || 'file-id'}
                    name={name}
                    className="focus:outline-none"
                    {...props}
                />
            </label>
            <Error error={helperText} />
        </div>
    );
};

export default File;
