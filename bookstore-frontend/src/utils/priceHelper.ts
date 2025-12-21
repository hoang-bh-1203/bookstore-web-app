export const formattedPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    currency: "VND",
  }).format(price);
