/**
 * Mock data for featured book collections
 */

/**
 * Individual book item in a collection
 */
export interface BookItem {
  id: number;
  image: string;
  discount?: string;
  title: string;
}

/**
 * Card data for a featured collection
 */
export interface CardData {
  logo: string;
  title: string;
  sponsor: string;
  brand: string;
  ratingText: string;
  books: BookItem[];
  rating: number; // Numeric star rating value
}

/**
 * Mock featured collections data for testing and development
 */
export const mockFeaturedCollections: CardData[] = [
  {
    logo: 'src/assets/refund.svg',
    title: 'Top Sách Bán Chạy',
    sponsor: 'Tài trợ bởi',
    brand: '1980 Books Tại BS Trading',
    ratingText: '5/5',
    books: [
      { id: 1, image: 'src/assets/refund.svg', title: 'Sách 1' },
      { id: 2, image: 'src/assets/refund.svg', title: 'Sách 2' },
      { id: 3, image: 'src/assets/refund.svg', title: 'Sách 3' },
    ],
    rating: 5,
  },
  {
    logo: 'src/assets/refund.svg',
    title: 'Bộ Sưu Tập Sách Mới Giảm Đến',
    sponsor: 'Tài trợ bởi',
    brand: '1980 Books Tại BS Trading',
    ratingText: '4.5/5',
    books: [
      {
        id: 4,
        image: 'src/assets/refund.svg',
        discount: '-50%',
        title: 'Sách 4',
      },
      {
        id: 5,
        image: 'src/assets/refund.svg',
        discount: '-25%',
        title: 'Sách 5',
      },
      {
        id: 6,
        image: 'src/assets/refund.svg',
        discount: '-32%',
        title: 'Sách 6',
      },
    ],
    rating: 4.5,
  },
  {
    logo: 'src/assets/refund.svg',
    title: 'Sách Kinh Doanh Hot',
    sponsor: 'Tài trợ bởi',
    brand: '1980 Books Tại BS Trading',
    ratingText: '4/5',
    books: [
      { id: 7, image: 'src/assets/refund.svg', title: 'Sách 7' },
      { id: 8, image: 'src/assets/refund.svg', title: 'Sách 8' },
      { id: 9, image: 'src/assets/refund.svg', title: 'Sách 9' },
    ],
    rating: 4,
  },
  {
    logo: 'src/assets/refund.svg',
    title: 'Combo Sách Thiếu Nhi',
    sponsor: 'Tài trợ bởi',
    brand: '1980 Books Tại BS Trading',
    ratingText: '4.8/5',
    books: [
      {
        id: 10,
        image: 'src/assets/refund.svg',
        discount: '-40%',
        title: 'Sách 10',
      },
      {
        id: 11,
        image: 'src/assets/refund.svg',
        discount: '-30%',
        title: 'Sách 11',
      },
      { id: 12, image: 'src/assets/refund.svg', title: 'Sách 12' },
    ],
    rating: 4.8,
  },
];
