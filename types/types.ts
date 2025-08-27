export interface Apartment {
  id: number;
  rooms: number;
  area: number;
  floor: number;
  price: number;
  planImg: string;
}

export interface Filters {
  rooms: number | null;
  price: [number, number];
  area: [number, number];
}

export type SortField = 'rooms' | 'area' | 'floor' | 'price' | null;
export type SortDirection = 'asc' | 'desc';