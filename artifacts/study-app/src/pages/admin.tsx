import { useState, useEffect, useCallback } from "react";
import { useUser, useLang } from "@/lib/store";
import { useLocation } from "wouter";
import { hapticFeedback, hapticSuccess, hapticError } from "@/lib/telegram";
import { motion } from "framer-motion";
import {
  getStats, getUsers, getPayments,
  addUserBalance, approvePayment, rejectPayment, broadcast,
  type AdminStats, type AdminUser, type AdminPayment,
} from "@/lib/admin-api";

type Tab = "dashboard" | "users" | "payments" | "broadcast";

function useAdminCheck(telegramId?: number) {
  const [isAdm, setIsAdm] = useState<boolean | null>(null);
  useEffect(() => {
    if (!telegramId) { setIsAdm(false); return; }
    getStats(telegramId).then(() => setIsAdm(true)).catch(() => setIsAdm(false));
  }, [telegramId]);
  return isAdm;
}

export default function Admin() {
  const user = useUser();
  useLang();
  const [, nav] = useLocation();
  const [tab, setTab] = useState<Tab>("dashboard");
  const adminOk = useAdminCheck(user?.telegramId);

  if (adminOk === null) {
    return <div className="flex justify-center py-20"><div className="spinner w-8 h-8" /></div>;
  }

  if (!adminOk) {
    return (
      <div className="px-5 pt-20 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(239,68,68,0.06)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 className="text-lg font-bold text-[#1a1b23] mb-1">Access Denied</h2>
        <p className="text-[13px] text-[#888] mb-6">You don't have admin access</p>
        <button onClick={() => nav("/")} className="btn-main px-8 py-3 text-[13px]">Go Home</button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "payments", label: "Payments", icon: "💳" },
    { id: "broadcast", label: "Broadcast", icon: "📢" },
  ];

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#1a1b23] tracking-tight">Admin Panel</h1>
          <p className="text-[11px] text-[#888]">Manage SmartStudy</p>
        </div>
        <button onClick={() => nav("/")} className="text-[12px] font-semibold text-[#7c3aed]">Back to app</button>
      </div>

      <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "#e8e9ed" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { hapticFeedback("light"); setTab(t.id); }}
            className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: tab === t.id ? "#fff" : "transparent",
              color: tab === t.id ? "#1a1b23" : "#999",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <DashboardTab telegramId={user!.telegramId} />}
      {tab === "users" && <UsersTab telegramId={user!.telegramId} />}
      {tab === "payments" && <PaymentsTab telegramId={user!.telegramId} />}
      {tab === "broadcast" && <BroadcastTab telegramId={user!.telegramId} />}
    </div>
  );
}

function DashboardTab({ telegramId }: { telegramId: number }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats(telegramId).then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, [telegramId]);

  if (loading) return <div className="flex justify-center py-12"><div className="spinner w-8 h-8" /></div>;
  if (!stats) return <p className="text-[#888] text-center py-8">Failed to load stats</p>;

  const cards = [
    { label: "Total Users", val: stats.totalUsers, color: "#7c3aed", icon: "👥" },
    { label: "Total Reports", val: stats.totalReports, color: "#06b6d4", icon: "📄" },
    { label: "Payments", val: stats.totalPayments, color: "#10b981", icon: "💳" },
    { label: "Pending", val: stats.pendingPayments, color: "#f59e0b", icon: "⏳" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="g-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{c.icon}</span>
              <span className="text-[10px] text-[#999] font-semibold uppercase tracking-wider">{c.label}</span>
            </div>
            <div className="text-[28px] font-extrabold tabular" style={{ color: c.color }}>{c.val}</div>
          </motion.div>
        ))}
      </div>

      <div className="section-label mb-2">Recent Users</div>
      <div className="space-y-1.5">
        {stats.recentUsers.map(u => (
          <div key={u.id} className="g-card rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white premium-gradient">
              {(u.firstName || "U").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[#1a1b23] truncate">{u.firstName || "User"} {u.username ? `@${u.username}` : ""}</div>
              <div className="text-[10px] text-[#999]">Balance: {u.balance} · Reports: {u.totalReports}</div>
            </div>
            <div className="text-[9px] text-[#bbb]">{new Date(u.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersTab({ telegramId }: { telegramId: number }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [balanceModal, setBalanceModal] = useState<AdminUser | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getUsers(telegramId, page, search).then(r => {
      setUsers(r.users);
      setTotalPages(r.totalPages);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [telegramId, page, search]);

  useEffect(() => { load(); }, [load]);

  async function handleAddBalance() {
    if (!balanceModal || !balanceAmount) return;
    setAdding(true);
    try {
      await addUserBalance(telegramId, balanceModal.telegramId, parseInt(balanceAmount, 10));
      hapticSuccess();
      setBalanceModal(null);
      setBalanceAmount("");
      load();
    } catch { hapticError(); }
    setAdding(false);
  }

  return (
    <div>
      <div className="relative mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ccc]">
          <circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search users..." className="input-field pl-10 text-[13px]" />
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="spinner w-6 h-6" /></div>
      ) : (
        <div className="space-y-1.5">
          {users.map(u => (
            <div key={u.id} className="g-card rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white premium-gradient shrink-0">
                  {(u.firstName || "U").charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1a1b23] truncate">{u.firstName || "User"} {u.lastName || ""}</div>
                  <div className="text-[10px] text-[#999]">
                    ID: {u.telegramId} {u.username ? `· @${u.username}` : ""} · Bal: {u.balance} · Rep: {u.totalReports} · Ref: {u.referralCount}
                  </div>
                </div>
                <button onClick={() => { setBalanceModal(u); setBalanceAmount(""); }}
                  className="text-[10px] font-bold text-[#7c3aed] px-2 py-1 rounded-lg" style={{ background: "rgba(124,58,237,0.06)" }}>
                  +Bal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="btn-ghost px-3 py-1.5 text-[12px] disabled:opacity-30">← Prev</button>
          <span className="text-[12px] text-[#888]">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="btn-ghost px-3 py-1.5 text-[12px] disabled:opacity-30">Next →</button>
        </div>
      )}

      {balanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setBalanceModal(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="g-card rounded-2xl p-5 mx-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-[#1a1b23] mb-1">Add Balance</h3>
            <p className="text-[12px] text-[#888] mb-4">{balanceModal.firstName} (ID: {balanceModal.telegramId})</p>
            <input type="number" value={balanceAmount} onChange={e => setBalanceAmount(e.target.value)}
              placeholder="Number of reports" className="input-field mb-4 text-[14px]" min="1" max="1000" />
            <div className="flex gap-2">
              <button onClick={() => setBalanceModal(null)} className="flex-1 btn-ghost py-2.5 text-[13px]">Cancel</button>
              <button onClick={handleAddBalance} disabled={adding || !balanceAmount}
                className="flex-1 btn-main py-2.5 text-[13px] disabled:opacity-30">
                {adding ? "Adding..." : "Add"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function PaymentsTab({ telegramId }: { telegramId: number }) {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processing, setProcessing] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getPayments(telegramId, statusFilter, page).then(r => {
      setPayments(r.payments);
      setTotalPages(r.totalPages);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [telegramId, statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(id: number) {
    setProcessing(id);
    try { await approvePayment(telegramId, id); hapticSuccess(); load(); }
    catch { hapticError(); }
    setProcessing(null);
  }

  async function handleReject(id: number) {
    setProcessing(id);
    try { await rejectPayment(telegramId, id); hapticSuccess(); load(); }
    catch { hapticError(); }
    setProcessing(null);
  }

  const statuses = ["all", "pending", "completed", "rejected"];
  const statusColors: Record<string, string> = { pending: "#f59e0b", completed: "#10b981", rejected: "#ef4444" };

  return (
    <div>
      <div className="flex gap-1 mb-3 p-1 rounded-xl" style={{ background: "#e8e9ed" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold capitalize transition-all"
            style={{
              background: statusFilter === s ? "#fff" : "transparent",
              color: statusFilter === s ? "#1a1b23" : "#999",
              boxShadow: statusFilter === s ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
            }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="spinner w-6 h-6" /></div>
      ) : payments.length === 0 ? (
        <p className="text-center text-[#999] text-[13px] py-8">No payments found</p>
      ) : (
        <div className="space-y-1.5">
          {payments.map(p => (
            <div key={p.id} className="g-card rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-[#1a1b23]">#{p.id}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${statusColors[p.status] || "#999"}15`, color: statusColors[p.status] || "#999" }}>
                    {p.status}
                  </span>
                </div>
                <span className="text-[10px] text-[#999]">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-[11px] text-[#666] mb-2">
                TG: {p.telegramId} · {p.amount} {p.currency} · {p.paymentMethod} · +{p.reportsAdded} reports
              </div>
              {p.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(p.id)} disabled={processing === p.id}
                    className="flex-1 btn-accent py-2 text-[11px] rounded-lg">
                    {processing === p.id ? "..." : "✓ Approve"}
                  </button>
                  <button onClick={() => handleReject(p.id)} disabled={processing === p.id}
                    className="flex-1 py-2 text-[11px] rounded-lg font-bold"
                    style={{ background: "rgba(239,68,68,0.06)", color: "#ef4444" }}>
                    {processing === p.id ? "..." : "✕ Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="btn-ghost px-3 py-1.5 text-[12px] disabled:opacity-30">← Prev</button>
          <span className="text-[12px] text-[#888]">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="btn-ghost px-3 py-1.5 text-[12px] disabled:opacity-30">Next →</button>
        </div>
      )}
    </div>
  );
}

function BroadcastTab({ telegramId }: { telegramId: number }) {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await broadcast(telegramId, message, imageUrl || undefined);
      hapticSuccess();
      setResult(res);
    } catch { hapticError(); }
    setSending(false);
  }

  if (result) {
    return (
      <div className="flex flex-col items-center py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(16,185,129,0.08)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </motion.div>
        <h3 className="text-[16px] font-bold text-[#1a1b23] mb-1">Broadcast Sent!</h3>
        <div className="grid grid-cols-3 gap-3 mt-4 mb-6 w-full">
          <div className="g-card rounded-xl p-3 text-center">
            <div className="text-[20px] font-extrabold text-[#10b981]">{result.sent}</div>
            <div className="text-[9px] text-[#999] font-semibold uppercase">Delivered</div>
          </div>
          <div className="g-card rounded-xl p-3 text-center">
            <div className="text-[20px] font-extrabold text-[#ef4444]">{result.failed}</div>
            <div className="text-[9px] text-[#999] font-semibold uppercase">Failed</div>
          </div>
          <div className="g-card rounded-xl p-3 text-center">
            <div className="text-[20px] font-extrabold text-[#7c3aed]">{result.total}</div>
            <div className="text-[9px] text-[#999] font-semibold uppercase">Total</div>
          </div>
        </div>
        <button onClick={() => { setResult(null); setMessage(""); setImageUrl(""); }}
          className="btn-ghost px-6 py-2.5 text-[13px]">New Broadcast</button>
      </div>
    );
  }

  return (
    <div>
      <div className="g-card rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📢</span>
          <span className="text-[13px] font-bold text-[#1a1b23]">Send to all users</span>
        </div>
        <p className="text-[11px] text-[#888] mb-4">HTML formatting supported: &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;a href=""&gt;link&lt;/a&gt;</p>

        <label className="text-[12px] font-semibold text-[#666] mb-1.5 block">Message *</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Type your broadcast message..."
          className="input-field resize-none leading-relaxed mb-3" rows={5} />

        <label className="text-[12px] font-semibold text-[#666] mb-1.5 block">Image URL (optional)</label>
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg" className="input-field mb-4 text-[13px]" />

        {message.trim() && (
          <div className="mb-4">
            <div className="section-label mb-2">Preview</div>
            <div className="g-card rounded-xl p-3.5">
              <div className="text-[13px] text-[#1a1b23] leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message }} />
            </div>
          </div>
        )}

        <button onClick={handleSend} disabled={sending || !message.trim()}
          className="w-full btn-main py-3.5 text-[14px] flex items-center justify-center gap-2 disabled:opacity-30">
          {sending ? (
            <><div className="spinner w-5 h-5" /> Sending...</>
          ) : (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Broadcast</>
          )}
        </button>
      </div>

      <div className="g-card rounded-xl p-3.5 flex items-start gap-2.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        <p className="text-[10px] text-[#888] leading-relaxed">
          Messages are sent one by one with a 50ms delay to avoid Telegram rate limits. For large user bases, this may take a while.
        </p>
      </div>
    </div>
  );
}
