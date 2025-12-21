export const API_ENDPOINTS = {
  // Authentication API endpoints
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",

  // User API endpoints
  USERS: "/users",
  USER_BY_ID: (id: number) => `/users/${id}`,

  // Book API endpoints
  BOOKS: "/products",
  BOOK_BY_ID: (id: number) => `/products/${id}`,

  // Product API endpoints
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  SEARCH_PRODUCTS: "/products/search",
  GET_PRODUCTS_BY_CATEGORY: (categoryId: number) =>
    `/products/category/${categoryId}`,

  // Category API endpoints
  CATEGORIES: "/categories",
  SEARCH_CATEGORIES: "/categories/search",
  CATEGORY_BY_ID: (id: number) => `/categories/${id}`,
  GET_CATEGORY_WITH_THUMBNAIL: "categories/root-with-thumbnail",
  GET_CATEGORIES_WITH_SUBCATEGORIES: "categories/with-subcategories",
  CATEGORIES_WITH_SUB: "/categories/with-subcategories",
  // Order API endpoints
  ORDERS: "/orders",
  ORDERS_CREATE: "/orders/create",
  ORDER_BY_ID: (id: number) => `/orders/${id}`,
  MY_ORDERS:"/orders/me",

  GET_BOOK_FEATURED_COLLECTIONS: "/featured-collections",

  // Image upload endpoint
  UPLOAD_IMAGE: "images/upload",
  DELETE_IMAGE: (fileId: string) => `images/delete/${fileId}`,

  // Dashboard API endpoints
  ADMIN_DASHBOARD: "admin/dashboard",

  // Cart
  VALIDATE_CART: "carts/validate"
};