import LoadingOverlay from '@/components/wrapper/loading-overlay';
import RequireRoleWrapper from '@/components/wrapper/require-role-wrapper';
import AdminLayout from '@/layouts/admin/AdminLayout';
import UserLayout from '@/layouts/user/UserLayout';
import Error403 from '@/pages/403';
import Error404 from '@/pages/404';
import { lazy, Suspense, type JSX } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// --- Loaders ---
import OAuth2Callback from '@/pages/OAuth2Callback';
import { bookLoader } from '@/routes/loaders/bookLoader.tsx';
import { adminDashboardLoader } from './loaders/adminDashboardLoader';
import { categoryLoader } from './loaders/categoryLoader';
import {
  myOrderLoader,
  orderDetailLoader,
  orderLoader,
} from './loaders/orderLoader';
import { userLoader } from './loaders/userLoader';

// --- Lazy Imports (User) ---
const HomePage = lazy(() => import('@/pages/user/HomePage'));
const Products = lazy(() => import('@/pages/user/Products'));
const CategoryProducts = lazy(() => import('@/pages/user/CategoryProducts'));
const ProductDetail = lazy(() => import('@/pages/user/BookDetail'));
const ResetPasswordPage = lazy(() => import('@/pages/user/ResetPasswordPage'));

const AccountLayout = lazy(() => import('@/pages/user/Profile'));
const AccountInfo = lazy(() => import('@/pages/user/AccountInfo'));
const MyOrders = lazy(() => import('@/pages/user/MyOrders'));
const OrderDetail = lazy(() => import('@/pages/user/OrderDetail'));

// Cart & Checkout & Order Success
const Cart = lazy(() => import('@/pages/user/CartPage'));
// const Checkout = lazy(() => import('@/pages/user/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/user/OrderSuccess'));
const PaymentConfirm = lazy(() => import('@/pages/user/PaymentConfirm'));

// --- Lazy Imports (Admin) ---
const AdminLogin = lazy(() => import('@/pages/admin/LoginAdmin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const BookManagement = lazy(() => import('@/pages/admin/BookManagement'));
const CategoryManagement = lazy(
  () => import('@/pages/admin/CategoryManagement'),
);
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const OrderManagement = lazy(() => import('@/pages/admin/OrderManagement'));
const OrderStatistics = lazy(() => import('@/pages/admin/OrderStatistics'));
const AdminProfile = lazy(() => import('@/pages/admin/AdminProfile'));

// --- Helper Component ---
const withSuspense = (
  Component: React.LazyExoticComponent<() => JSX.Element | null>,
) => (
  <Suspense fallback={<LoadingOverlay isVisible />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // --- USER ROUTES ---
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'products',
        element: withSuspense(Products),
      },
      {
        path: 'category-products',
        element: withSuspense(CategoryProducts),
      },
      {
        path: 'products/:id',
        element: withSuspense(ProductDetail),
      },
      {
        path: 'books/:id',
        element: withSuspense(ProductDetail),
      },
      {
        path: 'cart',
        element: withSuspense(Cart),
      },
      // {
      //   path: 'checkout',
      //   element: (
      //     <RequireRoleWrapper role="ROLE_USER">
      //       {withSuspense(Checkout)}
      //     </RequireRoleWrapper>
      //   ),
      // },
      {
        path: 'order-success',
        element: withSuspense(OrderSuccess),
      },
      {
        path: 'account',
        element: withSuspense(AccountLayout),
        children: [
          {
            index: true,
            element: withSuspense(AccountInfo),
          },
          {
            path: 'info',
            element: withSuspense(AccountInfo),
          },
          {
            path: 'orders',
            element: withSuspense(MyOrders),
            loader: myOrderLoader,
          },
          {
            path: 'orders/:id',
            element: withSuspense(OrderDetail),
            loader: ({ params }) => orderDetailLoader(Number(params.id)),
          },
        ],
      },
    ],
  },

  {
    path: '/confirm',
    element: withSuspense(PaymentConfirm),
  },

  {
    path: '/reset-password',
    element: withSuspense(ResetPasswordPage),
  },

  // --- ADMIN ROUTES ---
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
        element: withSuspense(AdminDashboard),
      },
      {
        path: '/admin/products',
        element: withSuspense(BookManagement),
        loader: bookLoader,
      },
      {
        path: '/admin/categories',
        element: withSuspense(CategoryManagement),
        loader: categoryLoader,
      },
      {
        path: '/admin/users',
        element: withSuspense(UserManagement),
        loader: userLoader,
      },
      {
        path: '/admin/orders',
        element: withSuspense(OrderManagement),
        loader: orderLoader,
      },
      {
        path: '/admin/orders/statistics',
        element: withSuspense(OrderStatistics),
        loader: orderLoader,
      },
      {
        path: '/admin/profile',
        element: withSuspense(AdminProfile),
      },
    ],
  },

  {
    path: '/admin/login',
    element: withSuspense(AdminLogin),
  },

  {
    path: '/403',
    element: <Error403 />,
  },
  {
    path: '/auth/callback',
    element: <OAuth2Callback />,
  },
]);

export default router;
