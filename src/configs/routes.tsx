import SubscriptionHoc from '@pages/auth/signup/subscription';

import Clients from '@pages/clients/Clients';
import React, { lazy } from 'react';
import { useParams } from "react-router-dom";
import useSWR from 'swr';
import { BreadcrumbComponentType } from 'use-react-router-breadcrumbs';
import ClientAftercares from '../components/Clients/Client/Aftercare/ClientAftercares';
import ClientBeforeAfterImageMain from '../components/Clients/Client/BeforeAfterImage/ClientBeforeAfterImageMain';
import Client from '../components/Clients/Client/Client';
import ClientDynamicQuestionaries from '../components/Clients/Client/Questionaries/DynamicQuestionary/ClientDynamicQuestionaries';
import ClientGeneralNotes from '../components/Clients/Client/GeneralNotes/ClientGeneralNotes';
import ClientLetterOfConsents from '../components/Clients/Client/LetterOfConsents/ClientLetterOfConsents';
import ClientLogs from '../components/Clients/Client/Logs/ClientLogs';
import ClientMedias from '../components/Clients/Client/Media/ClientMedias';
import ClientProcedures from '../components/Clients/Client/Procedures/ClientProcedures';
import ClientProcedureCreate from '../components/Clients/Client/Procedures/create/ClientProcedureCreate';
import ClientQuestionaries from '../components/Clients/Client/Questionaries/ClientQuestionaries';

import Questionnaires from '../components/Questionnaires/Questionnaires';
import QuestionnaireQuestions from '../components/Questionnaires/Questions/QuestionnaireQuestions';
import RegistrationPortalInfo from '../components/RegistrationPortal/RegistrationPortalInfo';

import Support from '../components/Support';
import { generateClientFullName, questionaryTypeToName } from '../helper';
import useQuery from '../hooks/useQuery';
import useTranslation from '../hooks/useTranslation';
import { ClientResponse } from '../interfaces/common';
import strings from '../lang/Lang';
import api from './api';
import Services from '@pages/services/Services';
import Categories from '@pages/categories/Categories';

const LazyTeam = lazy(() => import("@pages/team/Team"))
const LazySettings = lazy(() => import('../components/Settings/Settings'))
const LazyDashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const LazyCompanySettings = lazy(() => import('../components/CompanySettings/CompanySettings'))
const LazyInviteAFriend = lazy(() => import('../components/InviteAFriend'))
const LazyLetterOfConsents = lazy(() => import('../components/LetterOfConsents/LetterOfConsents'))
const LazyMyProfile = lazy(() => import('../components/MyProfile/MyProfile'))
const AllTemplates = React.lazy(() => import('@components/Templates/AllTemplates'))

const DynamicClientBreadCrumb: React.FC = () => {
    const { clientId }: { clientId?: string } = useParams();
    useTranslation();

    const { data, error } = useSWR<ClientResponse, Error>(api.clientSingle(clientId));
    const loading = !data && !error;

    if (error || loading) {
        return <>Client</>;
    }

    return <>{generateClientFullName(data?.data)}</>;
}

const DynamicQuestionaryBreadCrumb: React.FC = () => {
    const query = useQuery();
    useTranslation();

    return <>{`${questionaryTypeToName(query.get('questionnaireType') || '')}`}</>;
}

export interface BreadCrumb {
    path: string,
    breadcrumb: BreadcrumbComponentType | string,
    Component: React.ReactNode,
    exact?: boolean
}

/// Do not convert to variable
/// it caches routes and breadcrumb won't work
const routes = (): BreadCrumb[] => [
    {
        path: '/',
        breadcrumb: strings.Home,
        Component: <LazyDashboard />
    },
    {
        path: '/templates/treatments',
        breadcrumb: strings.Templates,
        Component: <AllTemplates />
    },
    {
        path: '/templates/text',
        breadcrumb: strings.Templates,
        Component: <AllTemplates />
    },
    {
        path: '/templates/image',
        breadcrumb: strings.Templates,
        Component: <AllTemplates />
    },
    {
        path: '/letters-of-consents',
        breadcrumb: strings.LettersofConsents,
        Component: <LazyLetterOfConsents />
    },
    {
        path: '/upgrade-plan',
        breadcrumb: strings.Subscription,
        Component: <SubscriptionHoc upgrade />
    },
    { path: '/settings', breadcrumb: strings.Settings, Component: <LazySettings />, },
    { path: '/settings/system-settings', breadcrumb: strings.Settings, Component: <LazySettings />, },
    { path: '/settings/company-information', breadcrumb: strings.Settings, Component: <LazySettings />, },
    { path: '/settings/billing', breadcrumb: strings.Settings, Component: <LazySettings />, },
    {
        path: '/questionnaires',
        breadcrumb: strings.Questionnaires,
        Component: <Questionnaires />
    },
    {
        path: '/questionnaires/:questionnaireId/questions',
        breadcrumb: strings.QuestionnaireQuestions,
        Component: <QuestionnaireQuestions />
    },
    {
        path: '/registration-portal/mandatory-fields',
        breadcrumb: strings.RegistrationPortal,
        Component: <RegistrationPortalInfo />
    },
    {
        path: '/registration-portal/questionnaire',
        breadcrumb: strings.RegistrationPortal,
        Component: <RegistrationPortalInfo />
    },
    {
        path: '/registration-portal',
        breadcrumb: strings.RegistrationPortal,
        Component: <RegistrationPortalInfo />
    },
    {
        path: '/profile',
        breadcrumb: strings.my_profile,
        Component: <LazyMyProfile />
    },
    {
        path: '/company-settings',
        breadcrumb: strings.CompanySettings,
        Component: <LazyCompanySettings />
    },
    {
        path: '/invite-a-friend',
        breadcrumb: strings.InviteAFriend,
        Component: <LazyInviteAFriend />
    },
    {
        path: '/support',
        breadcrumb: strings.Support,
        Component: <Support />
    },
    {
        path: '/team',
        breadcrumb: strings.team,
        Component: <LazyTeam />
    },
    {
        path: '/clients',
        breadcrumb: strings.Clients,
        Component: <Clients />
    },
    {
        path: '/clients/:clientId',
        breadcrumb: DynamicClientBreadCrumb,
        Component: <Client />
    },
    {
        path: '/clients/:clientId/general-notes',
        breadcrumb: strings.GeneralNotes,
        Component: <ClientGeneralNotes />
    },
    {
        path: '/clients/:clientId/client-letters-of-consents',
        breadcrumb: strings.LettersofConsents,
        Component: <ClientLetterOfConsents />
    },
    {
        path: '/clients/:clientId/procedures',
        breadcrumb: strings.ClientProcedures,
        Component: <ClientProcedures />
    },
    {
        path: '/clients/:clientId/client-questionnaires',
        breadcrumb: strings.Questionnaires,
        Component: <ClientDynamicQuestionaries />
    },
    {
        path: '/clients/:clientId/aftercare',
        breadcrumb: strings.AfterCare,
        Component: <ClientAftercares />
    },
    {
        path: '/clients/:clientId/before-after',
        breadcrumb: strings.beforeAfter,
        Component: <ClientBeforeAfterImageMain />, exact: false,
    },
    {
        path: '/clients/:clientId/procedures/create',
        breadcrumb: strings.CreateProcedure,
        Component: <ClientProcedureCreate />
    },
    {
        path: '/clients/:clientId/procedures/:clientProcedureId/edit',
        breadcrumb: strings.EditProcedure,
        Component: <ClientProcedureCreate />
    },
    {
        path: '/clients/:clientId/logs',
        breadcrumb: strings.Client_Logs,
        Component: <ClientLogs />
    },
    {
        path: '/clients/:clientId/media',
        breadcrumb: strings.clientMedia,
        Component: <ClientMedias />
    },
    {
        path: '/clients/:clientId/questionnaire/:questionnaireId',
        breadcrumb: DynamicQuestionaryBreadCrumb,
        Component: <ClientQuestionaries />
    },
    {
        path: '/clients/:clientId/all-questionnaire',
        breadcrumb: DynamicQuestionaryBreadCrumb,
        Component: <ClientQuestionaries />
    },
    {
        path: '/services',
        breadcrumb: strings.services,
        Component: <Services />
    },
    {
        path: '/category',
        breadcrumb: strings.category,
        Component: <Categories />
    },
];



export default routes;