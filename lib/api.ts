import { request } from "@/lib/http";
import type {
  AuthUser,
  Category,
  GearInput,
  GearItem,
  GearQuery,
  GearUpdateInput,
  LoginPayload,
  Payment,
  ProviderProfileInput,
  PublicUser,
  RegisterPayload,
  RentalOrder,
  RentalOrderInput,
  RentalOrderStatus,
  Review,
  UserStatus,
} from "@/types";

/* One typed function per backend endpoint (see the backend's *.route.ts files). */

export const authApi = {
  login: (payload: LoginPayload) =>
    request<{ accessToken: string; refreshToken: string }>("/auth/login", {
      method: "POST",
      body: payload,
    }),
};

export const usersApi = {
  register: (payload: RegisterPayload) =>
    request<{ user: PublicUser }>("/users/register", { method: "POST", body: payload }),
  // The backend wraps the profile as `{ result }`.
  me: () => request<{ result: AuthUser }>("/users/me"),
};

export const categoriesApi = {
  list: () => request<Category[]>("/categories"),
  create: (payload: { name: string; description?: string }) =>
    request<Category>("/categories", { method: "POST", body: payload }),
};

export const gearApi = {
  list: (query: GearQuery = {}) => request<GearItem[]>("/gear", { query: { ...query } }),
  get: (id: string) => request<GearItem>(`/gear/${id}`),
};

export const providerApi = {
  updateProfile: (payload: ProviderProfileInput) =>
    request<AuthUser>("/provider/profile", { method: "PUT", body: payload }),
  myGear: () => request<GearItem[]>("/provider/gear"),
  addGear: (payload: GearInput) =>
    request<GearItem>("/provider/gear", { method: "POST", body: payload }),
  updateGear: (id: string, payload: GearUpdateInput) =>
    request<GearItem>(`/provider/gear/${id}`, { method: "PUT", body: payload }),
  removeGear: (id: string) => request<GearItem>(`/provider/gear/${id}`, { method: "DELETE" }),
  myOrders: () => request<RentalOrder[]>("/provider/orders"),
  updateOrderStatus: (id: string, status: RentalOrderStatus) =>
    request<RentalOrder>(`/provider/orders/${id}`, { method: "PATCH", body: { status } }),
};

export const rentalsApi = {
  create: (payload: RentalOrderInput) =>
    request<RentalOrder>("/rentals", { method: "POST", body: payload }),
  list: () => request<RentalOrder[]>("/rentals"),
  get: (id: string) => request<RentalOrder>(`/rentals/${id}`),
  cancel: (id: string) => request<RentalOrder>(`/rentals/${id}/cancel`, { method: "PATCH" }),
};

export const paymentsApi = {
  createCheckout: (rentalOrderId: string) =>
    request<{ checkoutUrl: string | null }>("/payments/create", {
      method: "POST",
      body: { rentalOrderId },
    }),
  confirm: (payload: { sessionId?: string; transactionId?: string }) =>
    request<Payment>("/payments/confirm", { method: "POST", body: payload }),
  list: () => request<Payment[]>("/payments"),
  get: (id: string) => request<Payment>(`/payments/${id}`),
};

export const reviewsApi = {
  create: (payload: { gearItemId: string; rating: number; comment?: string }) =>
    request<Review>("/reviews", { method: "POST", body: payload }),
};

export const adminApi = {
  users: () => request<PublicUser[]>("/admin/users"),
  setUserStatus: (id: string, status: UserStatus) =>
    request<PublicUser>(`/admin/users/${id}`, { method: "PATCH", body: { status } }),
  gear: () => request<GearItem[]>("/admin/gear"),
  rentals: () => request<RentalOrder[]>("/admin/rentals"),
};
