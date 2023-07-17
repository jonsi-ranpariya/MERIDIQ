import * as React from 'react';

export interface TinyErrorProps {
    error?: boolean,
    helperText?: string | boolean,
}

const TinyError: React.FC<TinyErrorProps> = ({
    error = false,
    helperText = '',
}) => {

    if (!error || !helperText) {
        return <></>;
    }

    return (
        <span className="text-error w-full block text-xs ml-4 mt-1 break-words">{helperText}</span>
    );
}

export default TinyError;