
import BefAftDownload from "@components/Clients/Client/BeforeAfterImage/download/Download";
import useTranslation from "@hooks/useTranslation";
import strings from "@lang/Lang";
import { lazy, memo, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import adminRoutes from './configs/adminRoutes';
import routes from './configs/routes';
import useAuth from './hooks/useAuth';
import FullPageError from './partials/Error/FullPageError';
import FullPageLoading from './partials/Loadings/FullPageLoading';

const LazyLogin = lazy(() => import('./pages/auth/Login'))
const LazyMaster = lazy(() => import('./components/Master'))
const LazySignup = lazy(() => import('./pages/auth/signup'))
const LazySignupSetup = lazy(() => import('./pages/auth/signup/set-up'))
const LazySignupSubscription = lazy(() => import('./pages/auth/signup/subscription'))
const LazyForgotPassword = lazy(() => import('./pages/auth/forgot'))
const LazyRegPortal = lazy(() => import('./components/RegistrationPortal/RegistrationPortal'))
const LazyBeforeAfterMain = lazy(() => import('@components/Clients/Client/BeforeAfterImage/ClientBeforeAfterImageMain'))
const BefAftAfterEditor = lazy(() => import('@components/Clients/Client/BeforeAfterImage/after/Editor'))
const BefAftAfterSelect = lazy(() => import('@components/Clients/Client/BeforeAfterImage/after/Select'))
const BefAftBeforeEditor = lazy(() => import('@components/Clients/Client/BeforeAfterImage/before/Editor'))
const BefAftBeforeSelect = lazy(() => import('@components/Clients/Client/BeforeAfterImage/before/Select'))
const BefAftClientBeforeAfterImageInfo = lazy(() => import('@components/Clients/Client/BeforeAfterImage/ClientBeforeAfterImageInfo'))
const SubscriptionPublic = lazy(() => import('./components/Subscription/SubscriptionPublic'))


function App() {
	const { user } = useAuth();
	const [lang] = useTranslation()

	return (
		<>
			{strings.setLanguage(lang)}
			<Suspense fallback={<FullPageLoading />}>
				<Routes>
					{!user && <Route path="/" element={<LazyLogin />} />}
					<Route path="/login" element={<LazyLogin />} />
					<Route path="/register" element={<Navigate replace to="/sign-up" />} />
					<Route path="/sign-up" element={<LazySignup />} />
					<Route path="/sign-up/set-up" element={<LazySignupSetup />} />
					<Route path="/sign-up/subscription" element={<LazySignupSubscription />} />
					<Route path="/forgot-password" element={<LazyForgotPassword />} />
					<Route path="/registration/:companyId" element={<LazyRegPortal />} />
					{user?.user_role !== 'master_admin' && <Route path="/subscription" element={<LazySignupSubscription />} />}
					<Route path="/public/subscription" element={<SubscriptionPublic />} />
					{
						<Route path='/' element={<LazyMaster />}>
							{user?.user_role !== 'master_admin' ? routes().map(({ path, Component }, key) => (
								<Route path={path} key={key} element={Component} />
							)) : <></>}
							{user?.user_role === 'master_admin' ? adminRoutes().map(({ path, Component }, key) => (
								<Route path={path} key={key} element={Component} />
							)) : <></>}
						</Route>
					}
					{
						<Route path='/clients/:clientId/before-after/' element={<LazyBeforeAfterMain />}>
							<Route index element={<BefAftClientBeforeAfterImageInfo />} />
							<Route path="/clients/:clientId/before-after/before/select" element={<BefAftBeforeSelect />} />
							<Route path="/clients/:clientId/before-after/download" element={<BefAftDownload />} />
							<Route path="/clients/:clientId/before-after/before/editor" element={<BefAftBeforeEditor />} />
							<Route path="/clients/:clientId/before-after/after/select" element={<BefAftAfterSelect />} />
							<Route path="/clients/:clientId/before-after/after/editor" element={<BefAftAfterEditor />} />
						</Route>
					}
					<Route path="*" element={<FullPageError code={404} message="Page Not Found." />} />
				</Routes>
			</Suspense>
		</>
	);
}

export default memo(App);
