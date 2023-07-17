import React from 'react';
import { useParams } from "react-router-dom";
import useSWR from 'swr';
import { CompanyResponse } from '../interfaces/common';
import strings from '../lang/Lang';
import api from './api';
import { BreadCrumb } from './routes';

const CompanyClients = React.lazy(() => import('../components/Admin/Companies/Clients/CompanyClients'))
const CompanyClientLogs = React.lazy(() => import('../components/Admin/Companies/Clients/Logs/CompanyClientLogs'))
const Companies = React.lazy(() => import('../components/Admin/Companies/Companies'))
const Company = React.lazy(() => import('../components/Admin/Companies/Company/Company'))
const Reports = React.lazy(() => import('../components/Admin/Reports/Reports'))
const MyProfile = React.lazy(() => import('../components/MyProfile/MyProfile'))
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'))

const DynamicCompanyBreadCrumb: React.FC = () => {
    const { companyId }: { companyId?: string } = useParams();

    const { data, error } = useSWR<CompanyResponse, Error>(api.companySingle.replace(":id", companyId || ""));

    const loading = !data && !error;

    if (error || loading) {
        return <>Company</>;
    }

    return <>{data?.data.company_name}</>;
}

const adminRoutes = (): BreadCrumb[] => [
    {
        path: '/admin',
        breadcrumb: strings.dashboard,
        Component: <Dashboard />,
    },
    {
        path: '/admin/reports',
        breadcrumb: strings.reports,
        Component: <Reports />,
    },
    {
        path: '/admin/companies',
        breadcrumb: strings.Companies,
        Component: <Companies />,
    },
    {
        path: '/admin/companies/:companyId',
        breadcrumb: DynamicCompanyBreadCrumb,
        Component: <Company />,
    },
    {
        path: '/admin/companies/:companyId/clients',
        breadcrumb: strings.Clients,
        Component: <CompanyClients />,
    },
    {
        path: '/admin/companies/:companyId/clients/:clientId/logs',
        breadcrumb: strings.Client_Logs,
        Component: <CompanyClientLogs />,
    },
    {
        path: '/admin/profile',
        breadcrumb: strings.my_profile,
        Component: <MyProfile />,
    },
];

export default adminRoutes;