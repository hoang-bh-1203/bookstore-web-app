export const UserRole = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
} as const;

export const OrderStatus = {
  PENDING: 'PENDING', // Chờ xác nhận
  CONFIRMED: 'CONFIRMED', // Đã xác nhận
  PROCESSING: 'PROCESSING', // Đang chuẩn bị hàng (Thêm mới)
  SHIPPING: 'SHIPPING', // Đang giao hàng (Thêm mới)
  DELIVERED: 'DELIVERED', // Giao thành công (Thay thế cho COMPLETED cũ)
  CANCELLED: 'CANCELLED', // Đã hủy
} as const;

export const OrderStatusLabel = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang chuẩn bị hàng',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Giao hàng thành công',
  CANCELLED: 'Đã hủy',
} as const;
