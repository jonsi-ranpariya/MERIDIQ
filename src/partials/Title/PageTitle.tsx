import Heading from '@components/heading/Heading';
import * as React from 'react';
const MaterialBreadcrumbs = React.lazy(() => import('@partials/Breadcrumbs/MaterialBreadcrumbs'))


export interface PageTitleProps {
    children?: React.ReactNode,
    size?: 'big' | 'normal',
    breadcumb?: boolean
}

const PageTitle: React.FC<PageTitleProps> = ({ children, breadcumb = false, size = 'normal' }) => {
    return (
        <div className="relative break-all">
            {breadcumb && <MaterialBreadcrumbs />}
            <Heading text={children} variant="bigTitle" className='mt-2 mb-4' />
        </div>
    );
}

export default PageTitle;