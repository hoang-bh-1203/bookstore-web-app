import dayjs from "dayjs";

export function formatDate(dateInput: string | Date): string {
  const formatted = dayjs(dateInput).format("DD/MM/YYYY");
  return formatted === "Invalid Date" ? "Invalid date" : formatted;
}

export function formatDateTime(dateInput: string | Date): string {
  const formatted = dayjs(dateInput).format("DD/MM/YYYY HH:mm:ss");
  return formatted === "Invalid Date" ? "Invalid date" : formatted;
}

export function parseDate(dateString: string): dayjs.Dayjs | null {
  const parsed = dayjs(dateString, "DD/MM/YYYY");
  return parsed.isValid() ? parsed : null;
}

export function randomDeliveryDate(): string {
  const today = dayjs();
  const randomDays = Math.floor(Math.random() * 5) + 1;
  const deliveryDate = today.add(randomDays, "day");
  const randomHour = Math.floor(Math.random() * 11) + 8; // Random hour between 8 and 18
  const dateStr = deliveryDate.format("DD/MM");
  return `Giao thứ ${deliveryDate.format("d")}, trước ${randomHour}h, ${dateStr}`;
}
