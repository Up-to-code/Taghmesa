export type AdminSubcategory = {
  id: number; categoryId: number; nameAr: string; nameEn: string; slug: string;
  isActive: boolean; sortOrder: number; productCount: number;
};

export type AdminCategory = {
  id: number; nameAr: string; nameEn: string; slug: string; imageUrl: string | null;
  isActive: boolean; sortOrder: number; productCount: number; subcategories: AdminSubcategory[];
};

export type AdminOverview = {
  totals: { revenue: number; orders: number; products: number; customers: number };
  catalog: { active: number; hidden: number; featured: number; new: number };
  sales: Array<{ date: string; label: string; revenue: number; orders: number }>;
  statuses: Array<{ name: string; value: number }>;
  recentOrders: Array<{ id: number; orderNumber: string; customer: string; total: number; status: string; createdAt: string }>;
};

export type AdminCustomerSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  image: string | null;
  isEmailVerified: boolean;
  isBanned: boolean;
  registeredAt: string;
  orderCount: number;
  totalSpend: number;
  lastOrderAt: string | null;
};

export type AdminCustomerOrderItem = {
  id: number;
  productId: number | null;
  productName: string;
  imageUrl: string | null;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
};

export type AdminCustomerOrder = {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string;
  city: string;
  address: string;
  paymentMethod: string;
  subtotal: number;
  couponCode: string | null;
  discountAmount: number;
  total: number;
  items: AdminCustomerOrderItem[];
};

export type AdminCustomerDetails = AdminCustomerSummary & {
  firstName: string;
  lastName: string;
  address: string;
  updatedAt: string;
  providers: string[];
  activeOrders: AdminCustomerOrder[];
  orderHistory: AdminCustomerOrder[];
};
