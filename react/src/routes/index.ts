import { lazy } from 'react';

const Clients = lazy(() => import('../pages/Clients'));
const Developers = lazy(() => import('../pages/Developers'));
const ProjectManagers = lazy(() => import('../pages/ProjectManagers'));
const WelcomePage = lazy(() => import('../pages/Welcome'));
const ServerStaff = lazy(() => import('../pages/ServerStaff'));
const Alarms = lazy(() => import('../pages/Alarms'));

const coreRoutes = [
  {
    path: '/Welcome',
    title: 'Welcome',
    component: WelcomePage,
  },
  {
    path: '/Clients',
    title: 'Clients',
    component: Clients,
  },
  {
    path: '/Developers',
    title: 'Developers',
    component: Developers
    ,
  },
  {
    path: '/ProjectManagers',
    title: 'ProjectManagers',
    component: ProjectManagers,
  },
  {
    path: '/ServerStaff',
    title: 'ServerStaff',
    component: ServerStaff,
  },
  {
    path: '/Alarms',
    title: 'Alarms',
    component: Alarms,
  },
];

const routes = [...coreRoutes];
export default routes;
