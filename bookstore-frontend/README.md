# 📚 Bookstore Web Application - Frontend

A modern, full-featured e-commerce bookstore application built with React, TypeScript, and Vite. This frontend application provides a seamless shopping experience for customers and a comprehensive admin dashboard for managing products, orders, categories, and users.

## ✨ Features

### Customer Features

- 🏠 **Home Page** - Browse featured collections and top deals
- 🔍 **Search & Filter** - Search books by name and filter by categories
- 📖 **Book Details** - View detailed information about books
- 🛒 **Shopping Cart** - Add, update, and remove items from cart
- 💳 **Checkout & Payment** - Secure payment processing
- 👤 **User Profile** - Manage account information, view order history
- 📦 **Order Tracking** - Track order status and view order details

### Admin Features

- 📊 **Dashboard** - Overview of sales, orders, and key metrics
- 📚 **Product Management** - Create, update, and delete books
- 🏷️ **Category Management** - Organize books into categories
- 👥 **User Management** - Manage customer accounts
- 📦 **Order Management** - Process and track orders
- 📈 **Order Statistics** - Analyze sales data and trends

## 🚀 Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: Day.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- A running backend API server (default: `http://localhost:8080/api`)

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/hoang-bh-1203/bookstore-web-app.git
cd bookstore-web-app/bookstore-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Adjust the API base URL to match your backend server configuration.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` folder.

### 6. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
bookstore-frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # React components
│   │   ├── common/          # Shared components
│   │   ├── forms/           # Form components
│   │   ├── modals/          # Modal dialogs
│   │   ├── tables/          # Data tables
│   │   ├── ui/              # UI primitives (buttons, inputs, etc.)
│   │   └── wrapper/         # Wrapper components
│   ├── configs/             # API and app configuration
│   ├── constants/           # Constants and enums
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components
│   │   ├── admin/          # Admin layout
│   │   └── user/           # User layout
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Page components
│   │   ├── admin/          # Admin pages
│   │   └── user/           # User pages
│   ├── routes/              # Route definitions and loaders
│   ├── schemas/             # Zod validation schemas
│   ├── stores/              # Zustand state stores
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global CSS
├── components.json          # shadcn/ui configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts

```

## 🛣️ Frontend Routing

The application uses React Router for client-side routing with role-based access control.

### User Routes

| Path                       | Component        | Description                             |
| -------------------------- | ---------------- | --------------------------------------- |
| `/`                        | `HomePage`       | Landing page with featured collections  |
| `/books/:id`               | `BookDetail`     | Book details page                       |
| `/cart`                    | `CartPage`       | Shopping cart                           |
| `/search`                  | `SearchByName`   | Search results page                     |
| `/payment`                 | `Payment`        | Checkout page (requires authentication) |
| `/confirm`                 | `PaymentConfirm` | Payment confirmation page               |
| `/profile`                 | `Profile`        | User profile layout                     |
| `/profile/account-info`    | `AccountInfo`    | Account information                     |
| `/profile/notifications`   | `Notifications`  | User notifications                      |
| `/profile/orders`          | `MyOrders`       | Order history                           |
| `/profile/orders/:orderId` | `OrderDetail`    | Order details                           |

### Admin Routes (Requires ADMIN role)

| Path                       | Component            | Description       |
| -------------------------- | -------------------- | ----------------- |
| `/admin`                   | `AdminDashboard`     | Admin dashboard   |
| `/admin/products`          | `BookManagement`     | Manage books      |
| `/admin/categories`        | `CategoryManagement` | Manage categories |
| `/admin/users`             | `UserManagement`     | Manage users      |
| `/admin/orders`            | `OrderManagement`    | Manage orders     |
| `/admin/orders/statistics` | `OrderStatistics`    | Order statistics  |
| `/admin/profile`           | `AdminProfile`       | Admin profile     |

### Authentication Routes

| Path           | Component    | Description               |
| -------------- | ------------ | ------------------------- |
| `/login`       | `LoginAdmin` | Admin login               |
| `/admin/login` | `LoginAdmin` | Admin login (alternative) |

### Error Pages

| Path   | Component  | Description      |
| ------ | ---------- | ---------------- |
| `/403` | `Error403` | Forbidden access |
| `/404` | `Error404` | Page not found   |

## 🌐 API Endpoints

The frontend communicates with the backend through RESTful API endpoints.

### Base Configuration

- **Base URL**: `http://localhost:8080/api` (configurable via `VITE_API_BASE_URL`)
- **Timeout**: 10 seconds
- **Authentication**: Bearer token (stored in `localStorage`)

### Authentication

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| `POST` | `/auth/login`    | User login            |
| `POST` | `/auth/register` | User registration     |
| `GET`  | `/auth/me`       | Get current user info |

### Products/Books

| Method   | Endpoint                         | Description                |
| -------- | -------------------------------- | -------------------------- |
| `GET`    | `/products`                      | Get all products           |
| `GET`    | `/products/:id`                  | Get product by ID          |
| `GET`    | `/products/search`               | Search products            |
| `GET`    | `/products/category/:categoryId` | Get products by category   |
| `POST`   | `/products`                      | Create new product (admin) |
| `PUT`    | `/products/:id`                  | Update product (admin)     |
| `DELETE` | `/products/:id`                  | Delete product (admin)     |

### Categories

| Method   | Endpoint                          | Description                         |
| -------- | --------------------------------- | ----------------------------------- |
| `GET`    | `/categories`                     | Get all categories                  |
| `GET`    | `/categories/:id`                 | Get category by ID                  |
| `GET`    | `/categories/search`              | Search categories                   |
| `GET`    | `/categories/root-with-thumbnail` | Get root categories with thumbnails |
| `GET`    | `/categories/with-subcategories`  | Get categories with subcategories   |
| `POST`   | `/categories`                     | Create new category (admin)         |
| `PUT`    | `/categories/:id`                 | Update category (admin)             |
| `DELETE` | `/categories/:id`                 | Delete category (admin)             |

### Orders

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| `GET`  | `/orders`        | Get all orders (admin)      |
| `GET`  | `/orders/:id`    | Get order by ID             |
| `GET`  | `/orders/me`     | Get current user's orders   |
| `POST` | `/orders/create` | Create new order            |
| `PUT`  | `/orders/:id`    | Update order status (admin) |

### Users

| Method   | Endpoint     | Description             |
| -------- | ------------ | ----------------------- |
| `GET`    | `/users`     | Get all users (admin)   |
| `GET`    | `/users/:id` | Get user by ID (admin)  |
| `POST`   | `/users`     | Create new user (admin) |
| `PUT`    | `/users/:id` | Update user (admin)     |
| `DELETE` | `/users/:id` | Delete user (admin)     |

### Cart

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| `POST` | `/carts/validate` | Validate cart items |

### Images

| Method   | Endpoint                 | Description  |
| -------- | ------------------------ | ------------ |
| `POST`   | `/images/upload`         | Upload image |
| `DELETE` | `/images/delete/:fileId` | Delete image |

### Dashboard

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| `GET`  | `/admin/dashboard` | Get dashboard statistics (admin) |

### Featured Collections

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| `GET`  | `/featured-collections` | Get featured book collections |

## 🔐 Authentication & Authorization

- **Authentication**: JWT token-based authentication
- **Token Storage**: Tokens are stored in `localStorage` as `authToken`
- **Request Interceptor**: Automatically adds `Authorization: Bearer <token>` header to all API requests
- **Response Interceptor**: Handles 401 errors and clears authentication on unauthorized access
- **Role-Based Access**: Routes are protected using `RequireRoleWrapper` component
  - User routes: Accessible to authenticated users
  - Admin routes: Require `ADMIN` role

## 🔧 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI primitives. Components are customizable and located in `src/components/ui/`.

## 📦 State Management

- **Zustand** stores for global state:
  - `useAuthStore` - Authentication state
  - `useCartStore` - Shopping cart state
  - `useLoadingStore` - Loading state
  - `useModalStore` - Modal state

## 🧪 Key Dependencies

- `react` & `react-dom` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `@hookform/resolvers` & `react-hook-form` - Form management
- `zod` - Schema validation
- `zustand` - State management
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `recharts` - Charts
- `dayjs` - Date utilities
- `sonner` - Toast notifications

## 📝 Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Path aliases**: `@/` maps to `./src/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of an academic assignment at PTIT (Posts and Telecommunications Institute of Technology).

## 👥 Authors

- **Hoang BH** - [hoang-bh-1203](https://github.com/hoang-bh-1203)

## 🔗 Related Repositories

- Backend API: Link to backend repository (if separate)

---

**Note**: Make sure the backend API server is running before starting the frontend application.
