export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type RentalOrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "CANCELLED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type PaymentProvider = "STRIPE" | "SSLCOMMERZ";

/** Shape of every successful response from the backend (`sendResponse`). */
export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  profileImage: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  phone: string | null;
  address: string | null;
  avatar: string | null;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string | null;
  description: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: PublicUser;
}

export interface AuthUser extends PublicUser {
  profile?: Profile | null;
  providerProfile?: ProviderProfile | null;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  gearItemId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: PublicUser;
  gearItem?: GearItem;
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  brand: string | null;
  images: string[];
  pricePerDay: number;
  quantity: number;
  availableQuantity: number;
  isAvailable: boolean;
  location: string | null;
  providerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  provider?: ProviderProfile;
  reviews?: Review[];
}

export interface RentalOrderItem {
  id: string;
  orderId: string;
  gearItemId: string;
  quantity: number;
  pricePerDay: number;
  days: number;
  subtotal: number;
  gearItem?: GearItem;
}

export interface Payment {
  id: string;
  rentalOrderId: string;
  customerId: string;
  amount: number;
  method: string | null;
  provider: PaymentProvider;
  status: PaymentStatus;
  transactionId: string | null;
  sessionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  rentalOrder?: RentalOrder;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
}

export interface RentalOrder {
  id: string;
  customerId: string;
  providerId: string;
  startDate: string;
  endDate: string;
  status: RentalOrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customer?: OrderCustomer;
  provider?: ProviderProfile;
  items?: RentalOrderItem[];
  payment?: Payment | null;
}

/* ---------- request payloads ---------- */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  role?: Exclude<UserRole, "ADMIN">;
}

export interface GearQuery {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface GearInput {
  name: string;
  description: string;
  brand?: string;
  images?: string[];
  pricePerDay: number;
  quantity?: number;
  location?: string;
  categoryId: string;
}

export interface GearUpdateInput extends Partial<GearInput> {
  isAvailable?: boolean;
}

export interface ProviderProfileInput {
  name?: string;
  phoneNumber?: string;
  businessName?: string;
  description?: string;
}

export interface RentalOrderInput {
  items: { gearItemId: string; quantity: number }[];
  startDate: string;
  endDate: string;
}
