import { lazy } from 'react';

// Importación de las páginas con carga diferida
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx'));
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'));
const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'));
const BuildingsPage = lazy(() => import('../pages/BuildingsPage.jsx'));
const InmueblesPages = lazy(() => import('../pages/InmueblesPages.jsx'));


// Definición de las rutas
const ROUTES = [
  {
    key: 'login',
    path: '/',
    component: LoginPage,
    isProtected: false
  },
  {
    key: 'register',
    path: '/register',
    component: RegisterPage,
    isProtected: false
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    component: DashboardPage,
    isProtected: true
  },
  {
    key: 'buildings',
    path: '/edificios',
    component: BuildingsPage,
    isProtected: true
  },
  {
    key: 'inmuebles',
    path: '/inmuebles',
    component: InmueblesPages,
    isProtected: true
  },
];

export default ROUTES;