import Heading from '@components/heading/Heading';
import MaterialBreadcrumbs from '@partials/Breadcrumbs/MaterialBreadcrumbs';
import { SectionLoading } from '@partials/Loadings/SectionLoading';
import * as React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import api from '../../../../configs/api';
import { commonFetch } from '../../../../helper';
import { CompanyResponse } from '../../../../interfaces/common';
import FullPageError from '../../../../partials/Error/FullPageError';
import CompanyDetails from './CompanyDetails';
import CompanyUsers from './Users/CompanyUsers';


export interface CompanyProps {

}

const Company: React.FC<CompanyProps> = () => {

    const { companyId }: { companyId?: string } = useParams();

    const { data, error } = useSWR<CompanyResponse, Error>(
        api.companySingle.replace(":id", companyId || ""),
        commonFetch
    );

    const loading = !data && !error;

    if (error) {
        return <FullPageError code={error?.status || 500} message={error.message || 'server error'} />
    }

    if (loading) {
        return <SectionLoading />
    }

    return (
        <div className="space-y-6">
            <MaterialBreadcrumbs />
            <Heading text={data?.data?.company_name ?? ''} variant="bigTitle" />
            <CompanyDetails />
            <CompanyUsers />
        </div>
    );
}

export default Company;