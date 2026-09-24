import { createHashRouter, redirect } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { tokenStorage } from '../api/client';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import DashboardPage from '../pages/DashboardPage';
import LeadsListPage from '../pages/leads/LeadsListPage';
import LeadDetailPage from '../pages/leads/LeadDetailPage';
import ContactsListPage from '../pages/contacts/ContactsListPage';
import ContactDetailPage from '../pages/contacts/ContactDetailPage';
import AccountsListPage from '../pages/accounts/AccountsListPage';
import AccountDetailPage from '../pages/accounts/AccountDetailPage';
import DealsListPage from '../pages/deals/DealsListPage';
import DealDetailPage from '../pages/deals/DealDetailPage';
import ActivitiesListPage from '../pages/activities/ActivitiesListPage';
import PipelinesPage from '../pages/pipelines/PipelinesPage';
import SettingsPage from '../pages/settings/SettingsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFound from '../pages/NotFound';

const requireAuth = () => {
  if (!tokenStorage.getAccessToken()) return redirect('/auth/login');
  return null;
};

const redirectIfAuthed = () => {
  if (tokenStorage.getAccessToken()) return redirect('/app');
  return null;
};

export const routes: RouteObject[] = [
  {
    index: true,
    loader: () => redirect(tokenStorage.getAccessToken() ? '/app' : '/auth/login'),
  },
  {
    path: 'app',
    Component: MainLayout,
    loader: requireAuth,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'leads', Component: LeadsListPage },
      { path: 'leads/:id', Component: LeadDetailPage },
      { path: 'contacts', Component: ContactsListPage },
      { path: 'contacts/:id', Component: ContactDetailPage },
      { path: 'accounts', Component: AccountsListPage },
      { path: 'accounts/:id', Component: AccountDetailPage },
      { path: 'deals', Component: DealsListPage },
      { path: 'deals/:id', Component: DealDetailPage },
      { path: 'activities', Component: ActivitiesListPage },
      { path: 'pipelines', Component: PipelinesPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
  {
    path: 'auth',
    Component: AuthLayout,
    loader: redirectIfAuthed,
    children: [
      { path: 'login', Component: LoginPage },
      { path: 'register', Component: RegisterPage },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
];

const router = createHashRouter(routes);

export default router;
