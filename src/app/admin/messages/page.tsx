"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  Mail,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

type MessageStatus =
  | "new"
  | "read"
  | "replied"
  | "closed";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: MessageStatus;
  adminReply?: {
    message: string;
    repliedAt?: string;
  };
  createdAt: string;
}

interface Stats {
  totalMessages: number;
  newMessages: number;
  readMessages: number;
  repliedMessages: number;
  closedMessages: number;
}

const statusConfig: Record<
  MessageStatus,
  {
    label: string;
    icon: typeof Mail;
  }
> = {
  new: {
    label: "New",
    icon: Sparkles,
  },
  read: {
    label: "Read",
    icon: Eye,
  },
  replied: {
    label: "Replied",
    icon: CheckCircle2,
  },
  closed: {
    label: "Closed",
    icon: Archive,
  },
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(
    []
  );

  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    newMessages: 0,
    readMessages: 0,
    repliedMessages: 0,
    closedMessages: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  const [deleteTarget, setDeleteTarget] =
    useState<ContactMessage | null>(null);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status !== "all") {
        params.set("status", status);
      }

      params.set("page", String(page));
      params.set("limit", "10");

      const response = await fetch(
        `/api/admin/contact-messages?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load messages"
        );
      }

      setMessages(data.data || []);

      setStats(
        data.stats || {
          totalMessages: 0,
          newMessages: 0,
          readMessages: 0,
          repliedMessages: 0,
          closedMessages: 0,
        }
      );

      setTotalPages(
        data.pagination?.totalPages || 1
      );
    } catch (error) {
      console.error(error);

      setFeedback({
        type: "error",
        message: "Unable to load contact messages.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        fetchMessages();
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => {
      setFeedback(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [feedback]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget._id;

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/admin/contact-messages/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete message"
        );
      }

      setDeleteTarget(null);

      setFeedback({
        type: "success",
        message: "Message permanently deleted.",
      });

      await fetchMessages();
    } catch (error: any) {
      setFeedback({
        type: "error",
        message:
          error?.message ||
          "Failed to delete message.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0]?.charAt(0).toUpperCase() || "?";
    }

    return (
      (parts[0]?.charAt(0) || "") +
      (parts[parts.length - 1]?.charAt(0) || "")
    ).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white px-4 py-5 text-[#10291d] sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* ---------------------------------------------------------------- */}
        {/* BREADCRUMB                                                       */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-5 flex items-center gap-2 text-xs font-medium text-[#87958d] sm:text-sm">
          <Link
            href="/admin/dashboard"
            className="transition hover:text-[#10291d]"
          >
            Admin
          </Link>

          <ChevronRight size={14} />

          <span className="font-semibold text-[#315c42]">
            Messages
          </span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* LUXURY HERO                                                       */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative mb-6 overflow-hidden rounded-[30px] bg-[#10291d] px-5 py-7 text-white shadow-[0_24px_70px_rgba(16,41,29,0.16)] sm:px-8 sm:py-8 lg:px-10 lg:py-9">

          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#315c42]/45 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 left-[34%] h-72 w-72 rounded-full bg-[#c5dda8]/10 blur-3xl" />

          <div className="pointer-events-none absolute right-[22%] top-1/2 h-44 w-44 -translate-y-1/2 rounded-full border border-white/5" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            <div className="max-w-3xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c5dda8]">
                <MessageCircle size={13} />
                Customer Inbox
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[43px]">
                Contact messages
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
                Stay on top of customer conversations, inquiries,
                and support requests from one refined workspace.
              </p>

            </div>

            <div className="flex shrink-0 items-center gap-3">

              <div className="hidden h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] sm:flex">
                <Mail
                  size={28}
                  strokeWidth={1.7}
                  className="text-[#c5dda8]"
                />
              </div>

              <button
                onClick={fetchMessages}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.12] hover:text-white"
              >
                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>

            </div>

          </div>

          <div className="relative mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 sm:flex sm:items-center sm:gap-9">

            <HeroMetric
              icon={<Mail size={15} />}
              label="Total"
              value={stats.totalMessages}
            />

            <HeroMetric
              icon={<Sparkles size={15} />}
              label="New"
              value={stats.newMessages}
              accent
            />

            <HeroMetric
              icon={<CheckCircle2 size={15} />}
              label="Replied"
              value={stats.repliedMessages}
            />

            <HeroMetric
              icon={<Archive size={15} />}
              label="Closed"
              value={stats.closedMessages}
            />

          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FEEDBACK                                                          */}
        {/* ---------------------------------------------------------------- */}

        {feedback && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-sm ${
              feedback.type === "success"
                ? "border-[#cfe1d3] bg-[#f1f7f2] text-[#28563a]"
                : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {feedback.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <XCircle size={18} />
              )}
            </div>

            <p className="flex-1 text-sm font-medium">
              {feedback.message}
            </p>

            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="opacity-50 transition hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* STATS                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            label="Total Messages"
            value={stats.totalMessages}
            icon={Mail}
            description="All conversations"
          />

          <StatCard
            label="New"
            value={stats.newMessages}
            icon={Sparkles}
            description="Needs attention"
            emphasis="new"
          />

          <StatCard
            label="Read"
            value={stats.readMessages}
            icon={Eye}
            description="Opened messages"
          />

          <StatCard
            label="Replied"
            value={stats.repliedMessages}
            icon={CheckCircle2}
            description="Responses sent"
            emphasis="success"
          />

          <StatCard
            label="Closed"
            value={stats.closedMessages}
            icon={Archive}
            description="Completed conversations"
          />

        </div>

        {/* ---------------------------------------------------------------- */}
        {/* FILTER / SEARCH                                                   */}
        {/* ---------------------------------------------------------------- */}

        <section className="mb-5 overflow-hidden rounded-[26px] border border-[#dfe8e1] bg-white shadow-[0_12px_40px_rgba(16,41,29,0.045)]">

          <div className="border-b border-[#e8eee9] px-5 py-4 sm:px-6">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#89978f]">
                  Inbox controls
                </p>

                <h2 className="mt-1 text-base font-bold text-[#193226]">
                  Search & filter conversations
                </h2>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf3e9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#315c42]">
                <ShieldCheck size={13} />
                {status === "all"
                  ? "All messages"
                  : `${status} messages`}
              </div>

            </div>

          </div>

          <div className="p-4 sm:p-5">

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#87958d]"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search name, email, subject or message..."
                  className="h-12 w-full rounded-xl border border-[#dce6de] bg-[#fbfdfb] pl-11 pr-4 text-sm text-[#20352a] outline-none transition placeholder:text-[#a0aca4] hover:border-[#cbd9cf] focus:border-[#6f927b] focus:bg-white focus:ring-4 focus:ring-[#eaf2ec]"
                />

              </div>

              <div className="relative lg:w-52">

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="h-12 w-full appearance-none rounded-xl border border-[#dce6de] bg-[#fbfdfb] px-4 pr-10 text-sm font-semibold text-[#30473a] outline-none transition hover:border-[#cbd9cf] focus:border-[#6f927b] focus:bg-white focus:ring-4 focus:ring-[#eaf2ec]"
                >
                  <option value="all">
                    All Statuses
                  </option>

                  <option value="new">
                    New
                  </option>

                  <option value="read">
                    Read
                  </option>

                  <option value="replied">
                    Replied
                  </option>

                  <option value="closed">
                    Closed
                  </option>
                </select>

                <ChevronRight
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#87958d]"
                />

              </div>

            </div>

          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* MESSAGE DIRECTORY                                                 */}
        {/* ---------------------------------------------------------------- */}

        <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_14px_50px_rgba(16,41,29,0.055)]">

          <div className="flex flex-col justify-between gap-3 border-b border-[#e7ece8] px-5 py-5 sm:flex-row sm:items-center sm:px-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                <MessageCircle size={18} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a9890]">
                  Communication
                </p>

                <h2 className="mt-0.5 text-base font-bold text-[#193226]">
                  Message directory
                </h2>
              </div>

            </div>

            <div className="text-xs font-medium text-[#849189]">
              {messages.length}{" "}
              {messages.length === 1
                ? "conversation"
                : "conversations"}{" "}
              shown
            </div>

          </div>

          {/* Desktop */}
          <div className="hidden lg:block">

            {loading ? (
              <DesktopLoading />
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-[#edf1ec]">

                {messages.map((item) => (
                  <MessageRow
                    key={item._id}
                    item={item}
                    deletingId={deletingId}
                    formatDate={formatDate}
                    getInitials={getInitials}
                    onDelete={() =>
                      setDeleteTarget(item)
                    }
                  />
                ))}

              </div>
            )}

          </div>

          {/* Mobile */}
          <div className="lg:hidden">

            {loading ? (
              <MobileLoading />
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-[#edf1ec]">

                {messages.map((item) => (
                  <MobileMessageCard
                    key={item._id}
                    item={item}
                    deletingId={deletingId}
                    formatDate={formatDate}
                    getInitials={getInitials}
                    onDelete={() =>
                      setDeleteTarget(item)
                    }
                  />
                ))}

              </div>
            )}

          </div>

          {!loading && messages.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          )}

        </section>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DELETE MODAL                                                       */}
      {/* ------------------------------------------------------------------ */}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08140d]/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#dfe7e1] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.2)]">

            <div className="p-6 sm:p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Trash2 size={21} />
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#10291d]">
                Delete this message?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#78877f]">
                This conversation will be permanently removed.
                This action cannot be undone.
              </p>

              <div className="mt-5 rounded-2xl border border-[#e4eae5] bg-[#f8faf8] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6efe7] text-sm font-bold text-[#315c42]">
                    {getInitials(
                      deleteTarget.name
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#263d30]">
                      {deleteTarget.name}
                    </p>

                    <p className="truncate text-xs text-[#89968e]">
                      {deleteTarget.subject ||
                        "No subject"}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#e7ece8] bg-[#fbfcfb] p-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={Boolean(deletingId)}
                className="h-11 rounded-xl border border-[#dce5de] bg-white px-5 text-sm font-semibold text-[#53675b] transition hover:bg-[#f5f8f5]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#b42318] px-5 text-sm font-bold text-white transition hover:bg-[#981b12] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete permanently
                  </>
                )}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}

/* ======================================================================== */
/* HERO METRIC                                                              */
/* ======================================================================== */

function HeroMetric({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="min-w-0">

      <div
        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] ${
          accent
            ? "text-[#c5dda8]"
            : "text-white/35"
        }`}
      >
        {icon}
        {label}
      </div>

      <p className="mt-1 text-lg font-bold text-white/85">
        {value}
      </p>

    </div>
  );
}

/* ======================================================================== */
/* STAT CARD                                                                */
/* ======================================================================== */

function StatCard({
  label,
  value,
  icon: Icon,
  description,
  emphasis,
}: {
  label: string;
  value: number;
  icon: typeof Mail;
  description: string;
  emphasis?: "new" | "success";
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-[0_10px_35px_rgba(16,41,29,0.045)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(16,41,29,0.08)] ${
        emphasis === "new"
          ? "border-[#d6e6da]"
          : "border-[#dfe8e1]"
      }`}
    >
      {emphasis === "new" && (
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#edf5ef] blur-2xl" />
      )}

      <div className="relative flex items-start justify-between gap-4">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8b9891]">
            {label}
          </p>

          <p className="mt-2 text-[27px] font-bold tracking-[-0.03em] text-[#10291d]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#89968e]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            emphasis === "new"
              ? "bg-[#e8f2e9] text-[#315c42]"
              : emphasis === "success"
              ? "bg-[#e9f3ec] text-[#315c42]"
              : "bg-[#edf3e9] text-[#315c42]"
          }`}
        >
          <Icon size={19} />
        </div>

      </div>

      <div className="relative mt-4 h-1 overflow-hidden rounded-full bg-[#edf1ed]">
        <div
          className={`h-full rounded-full ${
            emphasis
              ? "w-2/3 bg-[#315c42]"
              : "w-1/3 bg-[#b7cdbb]"
          }`}
        />
      </div>

    </div>
  );
}

/* ======================================================================== */
/* DESKTOP MESSAGE ROW                                                      */
/* ======================================================================== */

function MessageRow({
  item,
  deletingId,
  formatDate,
  getInitials,
  onDelete,
}: {
  item: ContactMessage;
  deletingId: string | null;
  formatDate: (date: string) => string;
  getInitials: (name: string) => string;
  onDelete: () => void;
}) {
  const isNew = item.status === "new";

  return (
    <div
      className={`group relative px-5 py-5 transition duration-200 sm:px-6 ${
        isNew
          ? "bg-[#fbfefb]"
          : "hover:bg-[#fcfdfc]"
      }`}
    >
      {isNew && (
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#315c42]" />
      )}

      {/* Fixed action column so buttons never squeeze */}
      <div className="grid grid-cols-[minmax(220px,1.1fr)_minmax(160px,.8fr)_minmax(260px,1.4fr)_120px_150px_132px] items-center gap-4 xl:gap-5">

        {/* Customer */}
        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div
              className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                isNew
                  ? "bg-[#315c42] text-[#c5dda8]"
                  : "bg-[#eaf1e8] text-[#315c42]"
              }`}
            >
              {getInitials(item.name)}

              {isNew && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5f9b68]" />
              )}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-[#193226]">
                {item.name}
              </p>

              <p className="mt-0.5 truncate text-xs text-[#849189]">
                {item.email}
              </p>

            </div>

          </div>

        </div>

        {/* Subject */}
        <div className="min-w-0">

          <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#9aa69f]">
            Subject
          </p>

          <p className="truncate text-sm font-semibold text-[#30473a]">
            {item.subject || "No subject"}
          </p>

        </div>

        {/* Message */}
        <div className="min-w-0">

          <p className="line-clamp-2 text-sm leading-6 text-[#78877f]">
            {item.message}
          </p>

          {item.adminReply && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#315c42]">
              <CheckCircle2 size={12} />
              Admin replied
            </div>
          )}

        </div>

        {/* Status */}
        <div className="min-w-0">
          <MessageStatusBadge status={item.status} />
        </div>

        {/* Date */}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#52665a]">
            {formatDate(item.createdAt)}
          </p>

          <p className="mt-1 text-[10px] text-[#9aa59f]">
            Received
          </p>
        </div>

        {/* Actions */}
        <div className="flex min-w-[132px] items-center justify-end gap-2 whitespace-nowrap">

          <Link
            href={`/admin/messages/${item._id}`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#10291d] px-3.5 text-xs font-bold text-white shadow-[0_6px_15px_rgba(16,41,29,0.12)] transition hover:bg-[#193d2b]"
          >
            <Eye size={14} />
            <span>View</span>
          </Link>

          <button
            type="button"
            onClick={onDelete}
            disabled={deletingId === item._id}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f0d8d6] bg-white text-[#b42318] transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete message"
          >
            {deletingId === item._id ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>

        </div>

      </div>
    </div>
  );
}

/* ======================================================================== */
/* MOBILE MESSAGE CARD                                                      */
/* ======================================================================== */

function MobileMessageCard({
  item,
  deletingId,
  formatDate,
  getInitials,
  onDelete,
}: {
  item: ContactMessage;
  deletingId: string | null;
  formatDate: (date: string) => string;
  getInitials: (name: string) => string;
  onDelete: () => void;
}) {
  const isNew = item.status === "new";

  return (
    <div
      className={`relative p-5 ${
        isNew ? "bg-[#fbfefb]" : "bg-white"
      }`}
    >
      {isNew && (
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#315c42]" />
      )}

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
              isNew
                ? "bg-[#315c42] text-[#c5dda8]"
                : "bg-[#eaf1e8] text-[#315c42]"
            }`}
          >
            {getInitials(item.name)}
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-bold text-[#193226]">
              {item.name}
            </p>

            <p className="truncate text-xs text-[#849189]">
              {item.email}
            </p>

          </div>

        </div>

        <MessageStatusBadge status={item.status} />

      </div>

      <div className="mt-5">

        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9aa69f]">
          Subject
        </p>

        <p className="mt-1 text-sm font-bold text-[#30473a]">
          {item.subject || "No subject"}
        </p>

        <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#78877f]">
          {item.message}
        </p>

      </div>

      {item.adminReply && (
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#edf5ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#315c42]">
          <CheckCircle2 size={12} />
          Admin replied
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-[#edf1ec] pt-4">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#a0aaa4]">
            Received
          </p>

          <p className="mt-1 text-xs font-semibold text-[#627168]">
            {formatDate(item.createdAt)}
          </p>
        </div>

        <div className="flex gap-2">

          <Link
            href={`/admin/messages/${item._id}`}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#10291d] px-3.5 text-xs font-bold text-white"
          >
            <Eye size={14} />
            View
          </Link>

          <button
            type="button"
            onClick={onDelete}
            disabled={deletingId === item._id}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#f0d8d6] text-[#b42318] disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete message"
          >
            {deletingId === item._id ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>

        </div>

      </div>
    </div>
  );
}

/* ======================================================================== */
/* STATUS BADGE                                                             */
/* ======================================================================== */

function MessageStatusBadge({
  status,
}: {
  status: MessageStatus;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const styles: Record<MessageStatus, string> = {
    new:
      "border-[#cfe1d3] bg-[#edf5ef] text-[#315c42]",
    read:
      "border-[#dfe5e1] bg-[#f5f7f5] text-[#65746c]",
    replied:
      "border-[#cfe3d5] bg-[#eef7f0] text-[#2e6740]",
    closed:
      "border-[#e3e6e4] bg-[#f4f5f4] text-[#78817c]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] ${styles[status]}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

/* ======================================================================== */
/* PAGINATION                                                               */
/* ======================================================================== */

function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-[#e7ece8] bg-[#fcfdfc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

      <div>
        <p className="text-xs text-[#87938c]">
          Showing page{" "}
          <span className="font-bold text-[#30473a]">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-bold text-[#30473a]">
            {totalPages}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">

        <button
          disabled={page <= 1}
          onClick={() =>
            setPage((p) => Math.max(p - 1, 1))
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce5de] bg-white px-3.5 text-xs font-bold text-[#53675b] transition hover:border-[#cbd8ce] hover:bg-[#f6f9f6] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowLeft size={14} />
          Previous
        </button>

        <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#10291d] px-3 text-xs font-bold text-white">
          {page}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() =>
            setPage((p) =>
              Math.min(p + 1, totalPages)
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce5de] bg-white px-3.5 text-xs font-bold text-[#53675b] transition hover:border-[#cbd8ce] hover:bg-[#f6f9f6] disabled:cursor-not-allowed disabled:opacity-35"
        >
          Next
          <ArrowRight size={14} />
        </button>

      </div>

    </div>
  );
}

/* ======================================================================== */
/* EMPTY STATE                                                              */
/* ======================================================================== */

function EmptyState() {
  return (
    <div className="px-6 py-20 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#edf3e9] text-[#315c42]">
        <Mail size={27} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#193226]">
        No conversations found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#89968e]">
        There are no contact messages matching your current
        search or status filter.
      </p>

    </div>
  );
}

/* ======================================================================== */
/* DESKTOP LOADING                                                          */
/* ======================================================================== */

function DesktopLoading() {
  return (
    <div className="divide-y divide-[#edf1ec]">

      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[minmax(220px,1.1fr)_minmax(160px,.8fr)_minmax(260px,1.4fr)_120px_150px_132px] items-center gap-4 px-5 py-6 sm:px-6 xl:gap-5"
        >
          <Skeleton width="75%" />
          <Skeleton width="65%" />
          <Skeleton width="90%" />
          <Skeleton width="70%" />
          <Skeleton width="85%" />
          <Skeleton width="80%" />
        </div>
      ))}

    </div>
  );
}

/* ======================================================================== */
/* MOBILE LOADING                                                           */
/* ======================================================================== */

function MobileLoading() {
  return (
    <div className="divide-y divide-[#edf1ec]">

      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="space-y-4 p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-[#edf1ed]" />

            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 animate-pulse rounded bg-[#edf1ed]" />
              <div className="h-3 w-48 animate-pulse rounded bg-[#f0f3f0]" />
            </div>
          </div>

          <div className="h-4 w-2/3 animate-pulse rounded bg-[#edf1ed]" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-[#f4f6f4]" />
        </div>
      ))}

    </div>
  );
}

/* ======================================================================== */
/* SKELETON                                                                 */
/* ======================================================================== */

function Skeleton({
  width,
}: {
  width: string;
}) {
  return (
    <div
      className="h-4 animate-pulse rounded bg-[#edf1ed]"
      style={{ width }}
    />
  );
}