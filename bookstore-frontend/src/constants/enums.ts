export const UserRole = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
} as const;

export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const OrderStatusLabel = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  DELIVERED: 'Đang giao hàng',
  COMPLETED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy',
} as const;
