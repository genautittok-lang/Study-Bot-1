const API_BASE = "/api/twa";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface UserData {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  freeReportsUsed: boolean;
  totalReports: number;
  referralCode?: string;
  referralCount?: number;
}

export interface GenerateResponse {
  success: boolean;
  content?: string;
  reportId?: number;
  remainingBalance?: number;
  error?: string;
}

export interface ReportItem {
  id: number;
  reportType: string;
  subject: string;
  topic: string;
  group?: string;
  content?: string;
  createdAt: string;
}

export async function authUser(data: {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
}): Promise<UserData> {
  return request<UserData>("/auth", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function generateReport(data: {
  telegramId: number;
  reportType: string;
  subject: string;
  topic: string;
  group?: string;
  imageData?: string;
}): Promise<GenerateResponse> {
  return request<GenerateResponse>("/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getReports(telegramId: number): Promise<{ reports: ReportItem[] }> {
  return request<{ reports: ReportItem[] }>(`/reports?telegram_id=${telegramId}`);
}

export async function createPayment(data: {
  telegramId: number;
  paymentMethod: string;
  screenshotData?: string;
}): Promise<{ success: boolean; message?: string }> {
  return request<{ success: boolean; message?: string }>("/payment", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createInvoice(telegramId: number): Promise<{ success: boolean; invoiceUrl?: string; error?: string }> {
  return request<{ success: boolean; invoiceUrl?: string; error?: string }>("/create-invoice", {
    method: "POST",
    body: JSON.stringify({ telegramId }),
  });
}

export async function sendSupportMessage(data: {
  telegramId: number;
  category: string;
  message: string;
}): Promise<{ success: boolean }> {
  return request<{ success: boolean }>("/support", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
