export interface Produto {
  id: number;
  name: string;
  price: number;
  image: string;
  images: string[];
  badge?: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  category?: string;
  discount?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}