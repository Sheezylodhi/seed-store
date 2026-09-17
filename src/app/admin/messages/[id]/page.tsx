"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Eye,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  X,
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
    repliedBy?: {
      name?: string;
      email?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  customer?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
}

const statusOptions: {
  value: MessageStatus;
  label: string;
}[] = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "read",
    label: "Read",
  },
  {
    value: "replied",
    label: "Replied",
  },
  {
    value: "closed",
    label: "Closed",
  },
];

export default function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [message, setMessage] =
    useState<ContactMessage | null>(null);

  const [status, setStatus] =
    useState<MessageStatus>("read");

  const [reply, setReply] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const fetchMessage = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/contact-messages/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load message"
        );
      }

      setMessage(data.data);

      setStatus(
        data.data.status || "read"
      );

      setReply(
        data.data.adminReply?.message ||
          ""
      );
    } catch (error: any) {
      console.error(error);

      alert(
        error.message ||
          "Failed to load message."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const updateMessage = async (
    withReply = false
  ) => {
    try {
      if (
        withReply &&
        !reply.trim()
      ) {
        alert(
          "Please write a reply first."
        );
        return;
      }

      setSaving(true);

      const body: Record<
        string,
        any
      > = {
        status,
      };

      if (withReply) {
        body.reply = reply.trim();
      }

      const response = await fetch(
        `/api/admin/contact-messages/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update message"
        );
      }

      setMessage(data.data);

      if (withReply) {
        setStatus("replied");

        alert(
          "Reply saved successfully."
        );
      } else {
        alert(
          "Message status updated."
        );
      }
    } catch (error: any) {
      alert(
        error.message ||
          "Failed to update message."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteMessage = async () => {
    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/contact-messages/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete message"
        );
      }

      window.location.href =
        "/admin/messages";
    } catch (error: any) {
      alert(
        error.message ||
          "Failed to delete message."
      );

      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const formatDate = (
    date?: string
  ) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(new Date(date));
  };

  const getInitials = (
    name?: string
  ) => {
    if (!name?.trim()) return "?";

    const parts = name
      .trim()
      .split(/\s+/);

    if (parts.length === 1) {
      return (
        parts[0]
          ?.charAt(0)
          .toUpperCase() || "?"
      );
    }

    return (
      (
        parts[0]?.charAt(0) || ""
      ) +
      (
        parts[
          parts.length - 1
        ]?.charAt(0) || ""
      )
    ).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          <div className="mb-5 h-4 w-64 animate-pulse rounded bg-[#e4ebe5]" />

          <div className="mb-6 h-52 animate-pulse rounded-[30px] bg-[#10291d]" />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

            <div className="space-y-6">
              <div className="h-72 animate-pulse rounded-[26px] bg-white shadow-sm" />
              <div className="h-96 animate-pulse rounded-[26px] bg-white shadow-sm" />
            </div>

            <div className="space-y-6">
              <div className="h-64 animate-pulse rounded-[26px] bg-white shadow-sm" />
              <div className="h-56 animate-pulse rounded-[26px] bg-white shadow-sm" />
              <div className="h-48 animate-pulse rounded-[26px] bg-white shadow-sm" />
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-[#f8faf7] px-4 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-[1200px]">

          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#315c42] transition hover:text-[#10291d]"
          >
            <ArrowLeft size={16} />
            Back to Messages
          </Link>

          <div className="mt-7 overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white p-10 text-center shadow-[0_14px_50px_rgba(16,41,29,0.055)]">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#edf3e9] text-[#315c42]">
              <Mail size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#10291d]">
              Message not found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#89968e]">
              The message you're looking for
              could not be found or may have
              already been removed.
            </p>

            <Link
              href="/admin/messages"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-[#10291d] px-5 text-sm font-bold text-white transition hover:bg-[#193d2b]"
            >
              <ArrowLeft size={15} />
              Return to Inbox
            </Link>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf7] px-4 py-5 text-[#10291d] sm:px-6 sm:py-7 lg:px-8">

      <div className="mx-auto max-w-[1400px]">

        {/* ================================================================ */}
        {/* BREADCRUMB                                                       */}
        {/* ================================================================ */}

        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-[#87958d] sm:text-sm">

          <Link
            href="/admin/dashboard"
            className="transition hover:text-[#10291d]"
          >
            Admin
          </Link>

          <ChevronRight size={14} />

          <Link
            href="/admin/messages"
            className="transition hover:text-[#10291d]"
          >
            Messages
          </Link>

          <ChevronRight size={14} />

          <span className="font-semibold text-[#315c42]">
            Message Details
          </span>

        </div>

        {/* ================================================================ */}
        {/* PREMIUM HERO                                                      */}
        {/* ================================================================ */}

        <section className="relative mb-6 overflow-hidden rounded-[30px] bg-[#10291d] px-5 py-7 text-white shadow-[0_24px_70px_rgba(16,41,29,0.16)] sm:px-8 sm:py-8 lg:px-10 lg:py-9">

          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#315c42]/45 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-[38%] h-80 w-80 rounded-full bg-[#c5dda8]/10 blur-3xl" />

          <div className="pointer-events-none absolute right-[24%] top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-full border border-white/5 lg:block" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            <div className="min-w-0">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c5dda8]">
                <MessageCircle size={13} />
                Customer Conversation
              </div>

              <div className="flex items-start gap-4">

                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-base font-bold text-[#c5dda8] sm:flex">
                  {getInitials(
                    message.name
                  )}
                </div>

                <div className="min-w-0">

                  <h1 className="truncate text-2xl font-semibold tracking-[-0.04em] sm:text-3xl lg:text-[38px]">
                    {message.subject ||
                      "No subject"}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/55">

                    <span className="flex items-center gap-1.5">
                      <User size={14} />
                      {message.name}
                    </span>

                    <span className="hidden text-white/15 sm:inline">
                      •
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Mail size={14} />
                      {message.email}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            <div className="flex shrink-0 items-center gap-3">

              <StatusBadge
                status={message.status}
                dark
              />

              <Link
                href="/admin/messages"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.12] hover:text-white"
              >
                <ArrowLeft size={15} />
                <span className="hidden sm:inline">
                  Back
                </span>
              </Link>

            </div>

          </div>

          <div className="relative mt-7 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 sm:grid-cols-3 sm:gap-8">

            <HeroInfo
              icon={<Clock3 size={15} />}
              label="Received"
              value={formatDate(
                message.createdAt
              )}
            />

            <HeroInfo
              icon={<ShieldCheck size={15} />}
              label="Current status"
              value={
                statusOptions.find(
                  (item) =>
                    item.value ===
                    message.status
                )?.label || "—"
              }
            />

            <HeroInfo
              icon={<MessageCircle size={15} />}
              label="Conversation"
              value={
                message.adminReply
                  ? "Reply saved"
                  : "Awaiting response"
              }
            />

          </div>

        </section>

        {/* ================================================================ */}
        {/* CONTENT                                                           */}
        {/* ================================================================ */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* ============================================================ */}
          {/* MAIN                                                           */}
          {/* ============================================================ */}

          <main className="min-w-0 space-y-6">

            {/* CUSTOMER MESSAGE */}

            <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_14px_50px_rgba(16,41,29,0.055)]">

              <div className="flex flex-col justify-between gap-4 border-b border-[#e7ece8] px-5 py-5 sm:flex-row sm:items-center sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#315c42]">
                    <Mail size={18} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a9890]">
                      Incoming
                    </p>

                    <h2 className="mt-0.5 text-base font-bold text-[#193226]">
                      Customer message
                    </h2>
                  </div>

                </div>

                <div className="flex items-center gap-2 text-xs text-[#89968e]">
                  <Clock3 size={14} />
                  {formatDate(
                    message.createdAt
                  )}
                </div>

              </div>

              <div className="p-5 sm:p-6">

                <div className="rounded-[22px] border border-[#e3ebe4] bg-[#f8faf7] p-5 sm:p-6">

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#315c42] text-sm font-bold text-[#c5dda8]">
                      {getInitials(
                        message.name
                      )}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-bold text-[#193226]">
                        {message.name}
                      </p>

                      <p className="truncate text-xs text-[#849189]">
                        {message.email}
                      </p>

                    </div>

                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-[#53665b]">
                    {message.message}
                  </p>

                </div>

              </div>

            </section>

            {/* REPLY */}

            <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_14px_50px_rgba(16,41,29,0.055)]">

              <div className="border-b border-[#e7ece8] px-5 py-5 sm:px-6">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10291d] text-[#c5dda8]">
                      <Send size={17} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a9890]">
                        Communication
                      </p>

                      <h2 className="mt-0.5 text-base font-bold text-[#193226]">
                        Reply to customer
                      </h2>
                    </div>

                  </div>

                  {message.adminReply?.message && (
                    <div className="hidden items-center gap-1.5 rounded-full border border-[#cfe1d3] bg-[#edf5ef] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#315c42] sm:inline-flex">
                      <CheckCircle2 size={12} />
                      Reply saved
                    </div>
                  )}

                </div>

              </div>

              <div className="p-5 sm:p-6">

                {message.adminReply?.message && (
                  <div className="mb-5 rounded-[22px] border border-[#d6e5d8] bg-[#f1f7f2] p-5">

                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#315c42]">
                        <CheckCircle2 size={13} />
                        Previous reply
                      </div>

                      {message.adminReply.repliedAt && (
                        <span className="text-xs text-[#8b9891]">
                          {formatDate(
                            message.adminReply
                              .repliedAt
                          )}
                        </span>
                      )}

                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#52665a]">
                      {
                        message.adminReply
                          .message
                      }
                    </p>

                    {message.adminReply
                      .repliedBy?.name && (
                      <div className="mt-4 border-t border-[#dce9de] pt-3 text-xs text-[#7c8b82]">
                        Replied by{" "}
                        <span className="font-semibold text-[#315c42]">
                          {
                            message
                              .adminReply
                              .repliedBy
                              .name
                          }
                        </span>
                      </div>
                    )}

                  </div>
                )}

                <div className="relative">

                  <textarea
                    value={reply}
                    onChange={(e) =>
                      setReply(
                        e.target.value
                      )
                    }
                    maxLength={5000}
                    rows={8}
                    placeholder="Write a thoughtful reply to the customer..."
                    className="w-full resize-none rounded-[22px] border border-[#dce6de] bg-[#fbfdfb] px-5 py-4 text-sm leading-7 text-[#20352a] outline-none transition placeholder:text-[#a0aca4] hover:border-[#cbd9cf] focus:border-[#6f927b] focus:bg-white focus:ring-4 focus:ring-[#eaf2ec]"
                  />

                  <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-[#9aa69f] shadow-sm">
                    {reply.length}/5000
                  </div>

                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-xs leading-5 text-[#89968e]">
                    Saving a reply will mark this
                    conversation as replied.
                  </p>

                  <button
                    onClick={() =>
                      updateMessage(true)
                    }
                    disabled={
                      saving ||
                      !reply.trim()
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#10291d] px-5 text-sm font-bold text-white shadow-[0_7px_18px_rgba(16,41,29,0.13)] transition hover:bg-[#193d2b] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Save Reply
                      </>
                    )}
                  </button>

                </div>

              </div>

            </section>

          </main>

          {/* ============================================================ */}
          {/* SIDEBAR                                                        */}
          {/* ============================================================ */}

          <aside className="min-w-0 space-y-6">

            {/* CUSTOMER */}

            <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_14px_50px_rgba(16,41,29,0.055)]">

              <div className="border-b border-[#e7ece8] px-5 py-5">

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a9890]">
                  Contact
                </p>

                <h3 className="mt-1 text-base font-bold text-[#193226]">
                  Customer profile
                </h3>

              </div>

              <div className="p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#315c42] text-base font-bold text-[#c5dda8]">
                    {getInitials(
                      message.name
                    )}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-[#193226]">
                      {message.name}
                    </p>

                    <p className="mt-0.5 text-xs text-[#89968e]">
                      Customer
                    </p>

                  </div>

                </div>

                <div className="mt-5 space-y-2.5">

                  <a
                    href={`mailto:${message.email}`}
                    className="group flex items-start gap-3 rounded-2xl border border-[#e5ece6] bg-[#f8faf7] p-3.5 transition hover:border-[#d1dfd3] hover:bg-[#f1f6f1]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#315c42] shadow-sm">
                      <Mail size={15} />
                    </div>

                    <div className="min-w-0 pt-0.5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa69f]">
                        Email
                      </p>

                      <p className="mt-0.5 break-all text-xs font-semibold text-[#53665a] group-hover:text-[#315c42]">
                        {message.email}
                      </p>
                    </div>
                  </a>

                  {message.phone && (
                    <a
                      href={`tel:${message.phone}`}
                      className="group flex items-center gap-3 rounded-2xl border border-[#e5ece6] bg-[#f8faf7] p-3.5 transition hover:border-[#d1dfd3] hover:bg-[#f1f6f1]"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#315c42] shadow-sm">
                        <Phone size={15} />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9aa69f]">
                          Phone
                        </p>

                        <p className="mt-0.5 text-xs font-semibold text-[#53665a] group-hover:text-[#315c42]">
                          {message.phone}
                        </p>
                      </div>
                    </a>
                  )}

                </div>

              </div>

            </section>

            {/* STATUS */}

            <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_14px_50px_rgba(16,41,29,0.055)]">

              <div className="border-b border-[#e7ece8] px-5 py-5">

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a9890]">
                  Workflow
                </p>

                <h3 className="mt-1 text-base font-bold text-[#193226]">
                  Message status
                </h3>

              </div>

              <div className="p-5">

                <div className="mb-4 flex items-center justify-between gap-3">

                  <span className="text-xs font-medium text-[#89968e]">
                    Current status
                  </span>

                  <StatusBadge
                    status={status}
                  />

                </div>

                <div className="relative">

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target
                          .value as MessageStatus
                      )
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-[#dce6de] bg-[#fbfdfb] px-4 pr-10 text-sm font-semibold text-[#30473a] outline-none transition hover:border-[#cbd9cf] focus:border-[#6f927b] focus:bg-white focus:ring-4 focus:ring-[#eaf2ec]"
                  >
                    {statusOptions.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronRight
                    size={15}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[#87958d]"
                  />

                </div>

                <button
                  onClick={() =>
                    updateMessage(false)
                  }
                  disabled={saving}
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d5e1d7] bg-[#f8faf7] px-4 text-sm font-bold text-[#315c42] transition hover:border-[#c4d4c7] hover:bg-[#eef4ee] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#315c42]/20 border-t-[#315c42]" />
                  ) : (
                    <CheckCircle2
                      size={16}
                    />
                  )}

                  {saving
                    ? "Updating..."
                    : "Update Status"}
                </button>

              </div>

            </section>

            {/* INFORMATION */}

            <section className="overflow-hidden rounded-[28px] border border-[#dfe8e1] bg-white shadow-[0_14px_50px_rgba(16,41,29,0.055)]">

              <div className="border-b border-[#e7ece8] px-5 py-5">

                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8a9890]">
                  Details
                </p>

                <h3 className="mt-1 text-base font-bold text-[#193226]">
                  Message information
                </h3>

              </div>

              <div className="p-5">

                <div className="space-y-4">

                  <InfoRow
                    label="Received"
                    value={formatDate(
                      message.createdAt
                    )}
                  />

                  <InfoRow
                    label="Last updated"
                    value={formatDate(
                      message.updatedAt
                    )}
                  />

                  <InfoRow
                    label="Status"
                    value={
                      statusOptions.find(
                        (item) =>
                          item.value ===
                          message.status
                      )?.label ||
                      "—"
                    }
                  />

                  <InfoRow
                    label="Reply"
                    value={
                      message.adminReply
                        ?.message
                        ? "Saved"
                        : "Pending"
                    }
                  />

                </div>

              </div>

            </section>

            {/* DANGER ZONE */}

            <section className="overflow-hidden rounded-[28px] border border-[#f0d8d6] bg-white shadow-[0_14px_50px_rgba(16,41,29,0.04)]">

              <div className="border-b border-red-100 bg-[#fffafa] px-5 py-5">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#b42318]">
                    <Trash2 size={15} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b42318]">
                      Danger zone
                    </p>

                    <h3 className="mt-0.5 text-sm font-bold text-[#4a2927]">
                      Delete conversation
                    </h3>
                  </div>

                </div>

              </div>

              <div className="p-5">

                <p className="text-xs leading-5 text-[#89968e]">
                  Permanently remove this
                  customer conversation from
                  your inbox. This action cannot
                  be undone.
                </p>

                <button
                  onClick={() =>
                    setDeleteOpen(true)
                  }
                  disabled={deleting}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#f0d8d6] bg-white px-4 text-sm font-bold text-[#b42318] transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete Message
                </button>

              </div>

            </section>

          </aside>

        </div>

      </div>

      {/* ================================================================== */}
      {/* DELETE MODAL                                                       */}
      {/* ================================================================== */}

      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08140d]/55 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#e2e8e3] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.22)]">

            <div className="p-6 sm:p-7">

              <div className="flex items-center justify-between gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#b42318]">
                  <Trash2 size={21} />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteOpen(false)
                  }
                  disabled={deleting}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-[#89968e] transition hover:bg-[#f5f7f5] hover:text-[#315c42]"
                >
                  <X size={18} />
                </button>

              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#10291d]">
                Delete this conversation?
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#78877f]">
                This message will be permanently
                removed from your inbox. You
                won't be able to recover it later.
              </p>

              <div className="mt-5 rounded-2xl border border-[#e4eae5] bg-[#f8faf8] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#315c42] text-sm font-bold text-[#c5dda8]">
                    {getInitials(
                      message.name
                    )}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-[#263d30]">
                      {message.name}
                    </p>

                    <p className="truncate text-xs text-[#89968e]">
                      {message.subject ||
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
                  setDeleteOpen(false)
                }
                disabled={deleting}
                className="h-11 rounded-xl border border-[#dce5de] bg-white px-5 text-sm font-semibold text-[#53675b] transition hover:bg-[#f5f8f5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteMessage}
                disabled={deleting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#b42318] px-5 text-sm font-bold text-white transition hover:bg-[#981b12] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete Permanently
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
/* HERO INFO                                                                */
/* ======================================================================== */

function HeroInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">

      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        {icon}
        {label}
      </div>

      <p className="mt-1 truncate text-sm font-semibold text-white/75">
        {value}
      </p>

    </div>
  );
}

/* ======================================================================== */
/* STATUS BADGE                                                             */
/* ======================================================================== */

function StatusBadge({
  status,
  dark = false,
}: {
  status: MessageStatus;
  dark?: boolean;
}) {
  const config: Record<
    MessageStatus,
    {
      label: string;
      light: string;
      dark: string;
    }
  > = {
    new: {
      label: "New",
      light:
        "border-[#cfe1d3] bg-[#edf5ef] text-[#315c42]",
      dark:
        "border-[#c5dda8]/20 bg-[#c5dda8]/10 text-[#c5dda8]",
    },
    read: {
      label: "Read",
      light:
        "border-[#dfe5e1] bg-[#f5f7f5] text-[#65746c]",
      dark:
        "border-white/10 bg-white/[0.07] text-white/65",
    },
    replied: {
      label: "Replied",
      light:
        "border-[#cfe3d5] bg-[#eef7f0] text-[#2e6740]",
      dark:
        "border-[#c5dda8]/20 bg-[#c5dda8]/10 text-[#c5dda8]",
    },
    closed: {
      label: "Closed",
      light:
        "border-[#e3e6e4] bg-[#f4f5f4] text-[#78817c]",
      dark:
        "border-white/10 bg-white/[0.07] text-white/55",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] ${
        dark
          ? current.dark
          : current.light
      }`}
    >
      {status === "new" && (
        <Sparkles size={12} />
      )}

      {status === "read" && (
        <Eye size={12} />
      )}

      {status === "replied" && (
        <CheckCircle2 size={12} />
      )}

      {status === "closed" && (
        <Archive size={12} />
      )}

      {current.label}
    </span>
  );
}

/* ======================================================================== */
/* INFO ROW                                                                 */
/* ======================================================================== */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#edf1ed] pb-3.5 last:border-0 last:pb-0">

      <span className="text-xs font-medium text-[#89968e]">
        {label}
      </span>

      <span className="max-w-[210px] text-right text-xs font-bold leading-5 text-[#30473a]">
        {value}
      </span>

    </div>
  );
}