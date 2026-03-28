const API_BASE = "/api/admin";

async function adminRequest<T>(path: string, telegramId: number, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-Id": String(telegramId),
    },
    ...options,
  });
  if (!res.ok) throw new Error(`Admin API error: ${res.status}`);
  return res.json();
}

export interface AdminStats {
  totalUsers: number;
  totalReports: number;
  totalPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  recentUsers: Array<{
    id: number;
    telegramId: number;
    username: string | null;
    firstName: string | null;
    balance: number;
    totalReports: number;
    createdAt: string;
  }>;
}

export interface AdminUser {
  id: number;
  telegramId: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  freeReportsUsed: boolean;
  totalReports: number;
  referralCode: string | null;
  referralCount: number;
  createdAt: string;
}

export interface AdminPayment {
  id: number;
  telegramId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  reportsAdded: number;
  status: string;
  createdAt: string;
}

export function getStats(telegramId: number) {
  return adminRequest<AdminStats>("/stats", telegramId);
}

export function getUsers(telegramId: number, page = 1, search = "") {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  return adminRequest<{ users: AdminUser[]; total: number; page: number; totalPages: number }>(
    `/users?${params}`, telegramId
  );
}

export function addUserBalance(telegramId: number, targetTelegramId: number, amount: number) {
  return adminRequest<{ success: boolean }>(
    `/users/${targetTelegramId}/balance`, telegramId,
    { method: "POST", body: JSON.stringify({ amount }) }
  );
}

export function getPayments(telegramId: number, status = "all", page = 1) {
  const params = new URLSearchParams({ status, page: String(page) });
  return adminRequest<{ payments: AdminPayment[]; total: number; page: number; totalPages: number }>(
    `/payments?${params}`, telegramId
  );
}

export function approvePayment(telegramId: number, paymentId: number) {
  return adminRequest<{ success: boolean }>(`/payments/${paymentId}/approve`, telegramId, { method: "POST" });
}

export function rejectPayment(telegramId: number, paymentId: number) {
  return adminRequest<{ success: boolean }>(`/payments/${paymentId}/reject`, telegramId, { method: "POST" });
}

export function broadcast(telegramId: number, message: string, imageUrl?: string) {
  return adminRequest<{ success: boolean; sent: number; failed: number; total: number }>(
    "/broadcast", telegramId,
    { method: "POST", body: JSON.stringify({ message, imageUrl }) }
  );
}
