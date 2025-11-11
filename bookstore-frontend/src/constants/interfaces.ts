export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  address: string;
  role: 'ADMIN' | 'USER';
}

export interface Author {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  parent: Category | null;
}

export interface SidebarCategory {
  id: number;
  name: string;
  thumbnailUrl?: string | null;
  parentId?: number | null;
  parentName?: string | null;
  subcategories?: SidebarCategory[] | null;
}

export interface QuantitySold {
  text: string;
  value: number;
}

export interface ImageBook {
  baseUrl: string;
  isGallery: boolean;
  label: string;
  largeUrl: string;
  mediumUrl: string;
  smallUrl: string;
  thumbnailUrl: string;
}

export interface Attribute {
  code: string;
  name: string;
  values: string;
}

export interface Specification {
  name: string;
  attributes: Attribute[];
}

export interface Book {
  id: number;
  name: string;
  authors: Author[];
  description: string;
  images: ImageBook[];
  originalPrice: number;
  listPrice: number;
  ratingAverage: number;
  shortDescription: string;
  publisherVn: string;
  publicationDate: string;
  dimensions: string;
  dichGia: string;
  manufacturer: string;
  bookCover: string;
  numberOfPage: number;
  stockQuantity: number;
  isActive: boolean;
  categoriesId: number;
  quantitySold: number;
  thumbnailUrl: string;
}

export interface Item {
  id: number;
  quantity: number;
  name: string;
  price: number;
  thumbnail?: string;
}

export interface Order {
  id: number;
  customerName: string;
  products: Item[];
  totalPrice: number;
  status: string;
  createdAt?: string;
  address?: string;
  phone?: string;
}

export interface OrderCreate {
  productId: number;
  quantity: number;
}

export interface CreateOrderResponse {
  orderId: number;
  totalAmount: number;
  products: {
    productId: number;
    productName: string;
    thumbnailUrl: string;
  }[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  sold: number;
  thumbnailUrl: string;
  hasAd: boolean;
  hasTikiNow: boolean;
  isTopDeal: boolean;
  isFreeshipXtra: boolean;
  isAuthentic: boolean;
}

export interface ProductSearchResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
  sortBy: string;
  orderBy: string;
  content: Product[];
}

export interface CategoryWithThumbnail {
  id: number;
  name: string;
  thumbnailUrl?: string;
}

export interface ImageUploadResponse {
  url: string;
  id: string;
  error?: string;
}

export interface ProductItem {
  id: number;
  url: string;
  discountPercent: number;
}

export interface FeaturedCollectionData {
  logo: string;
  title: string;
  sponsor: string;
  ratingText: string;
  listProduct: ProductItem[];
  rating: number;
}

export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
}

export interface CartItem {
  productId: number;
  name: string;
  thumbnailUrl: string;
  price: number;
  originalPrice?: number;
  quantity: number;
}

/**
 * Overall statistics data interface
 */
export interface StatsData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number; // Percentage growth
  todayOrders: number;
}

/**
 * Monthly statistics data interface
 */
export interface MonthlyData {
  name: string; // Month label, e.g., "Jan", "Feb"
  users: number;
  orders: number;
  revenue: number;
  books: number;
}

/**
 * Category distribution data interface
 */
export interface CategoryData {
  name: string;
  value: number;
}

/**
 * Recent orders data interface
 */
export interface RecentOrdersData {
  name: string; // Time period label, e.g., "Today", "Yesterday"
  orders: number;
  revenue: number;
}

/**
 * Dashboard data aggregate interface
 * Combines all dashboard-related data from API
 */
export interface DashboardData {
  statsData: StatsData;
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
  recentOrdersData: RecentOrdersData[];
}

export interface CartValidateSuccessResponse {
  device: string;
  code: number;
  data: {
    message: string;
  };
}

export interface CartValidateErrorResponse {
  device: string;
  code: number;
  data: {
    timestamp: string;
    path: string;
    error: string;
    message: string;
  };
}

export type CartValidateResponse =
  | CartValidateSuccessResponse
  | CartValidateErrorResponse;

export interface PagedResponse<T> {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  data: T[];
}

export interface CustomErrorResponse {
  device: string;
  code: number;
  data: {
    timestamp: string;
    error: string;
    message: string;
  };
}
