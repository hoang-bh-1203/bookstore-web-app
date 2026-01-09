export const API_ENDPOINTS = {
  // Authentication API endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ME: '/auth/me',

  // User API endpoints
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,

  // Book API endpoints
  BOOKS: '/products',
  BOOK_BY_ID: (id: number) => `/products/${id}`,
  BOOKS_BY_PRICE_RANGE: '/products/by-price-range',
  SIMILAR_BOOKS: (id: number) => `/products/product/${id}/similar`,

  // Product API endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  SEARCH_PRODUCTS: '/products/search',
  GET_PRODUCTS_BY_CATEGORY: (categoryId: number) =>
    `/products/by-category/${categoryId}`,

  // Category API endpoints
  CATEGORIES: '/categories',
  SEARCH_CATEGORIES: '/categories/search',
  CATEGORY_BY_ID: (id: number) => `/categories/${id}`,
  GET_CATEGORY_WITH_THUMBNAIL: 'categories/root-with-thumbnail',
  GET_CATEGORIES_WITH_SUBCATEGORIES: 'categories/with-subcategories',
  CATEGORIES_WITH_SUB: '/categories/children/1',
  // Order API endpoints
  ORDERS: '/orders',
  ORDERS_STAT: '/orders/stats',
  ORDERS_CREATE: '/orders/create',
  ORDER_BY_ID: (id: number) => `/orders/${id}`,
  MY_ORDERS: '/orders/my-orders',
  ORDER_STATS: 'orders/stats',

  GET_BOOK_FEATURED_COLLECTIONS: '/featured-collections',

  // Image upload endpoint
  UPLOAD_IMAGE: '/uploads',
  DELETE_IMAGE: (fileId: string) => `/uploads/${fileId}`,

  // Dashboard API endpoints
  ADMIN_DASHBOARD: 'admin/dashboard',

  // Cart
  VALIDATE_CART: 'carts/validate',
  CART: '/cart',
  CART_ITEMS: '/cart/items',
  CART_ITEM_BY_ID: (id: number) => `/cart/items/${id}`,
};
