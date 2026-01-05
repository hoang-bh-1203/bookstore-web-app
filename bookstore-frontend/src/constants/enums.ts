export const UserRole = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
} as const;

export const OrderStatus = {
  CONFIRMED: 'confirmed',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const OrderStatusLabel = {
  CONFIRMED: 'Đã xác nhận',
  DELIVERED: 'Đang giao hàng',
  COMPLETED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy',
} as const;
