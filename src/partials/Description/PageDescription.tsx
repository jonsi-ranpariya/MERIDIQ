import * as React from 'react';

export interface PageDescriptionProps {
    children?: React.ReactNode,
}

const PageDescription: React.FC<PageDescriptionProps> = ({ children }) => {
    return (
        <p className="max-w-2xl mt-3 text-gray-600 dark:text-gray-200">{children}</p>
    );
}

export default PageDescription;