export type ProductSize = {
  id: number;
  label: string;
  price: number;
  caloriesLabel: string;
};

export type Product = {
  id: number;
  nameAr: string;
  nameEn: string;
  category: string;
  emoji: string;
  description: string;
  imageUrl: string | null;
  isFeatured: boolean;
  isNew: boolean;
  isActive?: boolean;
  sortOrder?: number;
  sizes: ProductSize[];
};

export type OrderStatus = "new" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";

export type OrderItem = {
  id?: number;
  productId: number | null;
  productName: string;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
};

export type Order = {
  id: number;
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  paymentMethod: "cod";
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
};
