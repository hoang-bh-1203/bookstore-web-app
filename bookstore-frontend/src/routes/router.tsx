import { lazy, Suspense, type JSX } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LoadingOverlay from '@/components/wrapper/loading-overlay';
import UserLayout from '@/layouts/user/UserLayout';
import AdminLayout from '@/layouts/admin/AdminLayout';
import { userLoader } from './loaders/userLoader';
import { bookLoader } from '@/routes/loaders/bookLoader.tsx';
import {
  myOrderLoader,
  orderDetailLoader,
  orderLoader,
} from './loaders/orderLoader';
import RequireRoleWrapper from '@/components/wrapper/require-role-wrapper';
import Error403 from '@/pages/403';
import Error404 from '@/pages/404';
import { categoryLoader } from './loaders/categoryLoader';
import { adminDashboardLoader } from './loaders/adminDashboardLoader';
import Payment from '@/pages/user/Payment';

const HomePage = lazy(() => import('@/pages/user/HomePage'));
const ProfilePage = lazy(() => import('@/pages/user/Profile'));
const AccountInfo = lazy(() => import('@/pages/user/AccountInfo'));
const Notifications = lazy(() => import('@/pages/user/Notifications'));
const Orders = lazy(() => import('@/pages/user/MyOrders'));
const Cart = lazy(() => import('@/pages/user/CartPage'));
const withSuspense = (
  Component: React.LazyExoticComponent<() => JSX.Element | null>,
) => (
  <Suspense fallback={<LoadingOverlay isVisible />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '/',
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'books/:id',
        element: withSuspense(lazy(() => import('@/pages/user/BookDetail'))),
      },
      {
        path: 'profile',
        element: withSuspense(ProfilePage), // <- Trang chứa layout sidebar + Outlet
        children: [
          {
            index: true,
            element: withSuspense(AccountInfo), // Mặc định là thông tin tài khoản
          },
          {
            path: 'account-info',
            element: withSuspense(AccountInfo),
          },
          {
            path: 'notifications',
            element: withSuspense(Notifications),
          },
          {
            path: 'orders',
            element: withSuspense(Orders),
            loader: myOrderLoader,
          },
          {
            path: 'orders/:orderId',
            element: withSuspense(
              lazy(() => import('@/pages/user/OrderDetail')),
            ),
            loader: ({ params }) => orderDetailLoader(Number(params.orderId)),
          },
        ],
      },
      {
        path: 'cart',
        element: withSuspense(Cart),
      },
      {
        path: 'search',
        element: withSuspense(lazy(() => import('@/pages/user/SearchByName'))),
      },
    ],
  },
  {
    path: '/payment',
    element: (
      <RequireRoleWrapper role="ROLE_USER">
        <Payment />
      </RequireRoleWrapper>
    ),
  },
  {
    path: '/admin',
    element: (
      <RequireRoleWrapper role="ROLE_ADMIN">
        <AdminLayout />
      </RequireRoleWrapper>
    ),
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        loader: adminDashboardLoader,
        element: withSuspense(
          lazy(() => import('@/pages/admin/AdminDashboard')),
        ),
      },
      {
        path: '/admin/products',
        element: withSuspense(
          lazy(() => import('@/pages/admin/BookManagement')),
        ),
        loader: bookLoader,
      },
      {
        path: '/admin/categories',
        element: withSuspense(
          lazy(() => import('@/pages/admin/CategoryManagement')),
        ),
        loader: categoryLoader,
      },
      {
        path: '/admin/users',
        element: withSuspense(
          lazy(() => import('@/pages/admin/UserManagement')),
        ),
        loader: userLoader,
      },
      {
        path: '/admin/orders',
        element: withSuspense(
          lazy(() => import('@/pages/admin/OrderManagement')),
        ),
        loader: orderLoader,
      },
      {
        path: '/admin/orders/statistics',
        element: withSuspense(
          lazy(() => import('@/pages/admin/OrderStatistics')),
        ),
        loader: orderLoader,
      },
      {
        path: '/admin/profile',
        element: withSuspense(lazy(() => import('@/pages/admin/AdminProfile'))),
      },
    ],
  },
  {
    path: '/login',
    element: withSuspense(lazy(() => import('@/pages/admin/LoginAdmin'))),
  },
  {
    path: '/admin/login',
    element: withSuspense(lazy(() => import('@/pages/admin/LoginAdmin'))),
  },
  {
    path: '/403',
    element: <Error403 />,
  },
  {
    path: '/confirm',
    element: withSuspense(lazy(() => import('@/pages/user/PaymentConfirm'))),
  },
]);

export default router;
