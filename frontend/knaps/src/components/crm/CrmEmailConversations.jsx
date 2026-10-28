import { useState, useEffect, useCallback, useRef } from "react";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPaperPlane,
  faInbox,
  faClock,
  faPaperclip,
  faChevronDown,
  faChevronUp,
  faSpinner,
  faTriangleExclamation,
  faArrowsRotate,
  faFileLines,
  faPlus,
  faXmark,
  faReply,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { crmService } from "../../services/crmService";
import { formatContactDate } from "../../utils/crmContactUtils";

function sanitizeHtml(dirtyHtml) {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";
  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
  });
}

function EmailCard({ email, onReply }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState("auto"); // "auto" (html if present, else plain) or "plain"

  const isSent = (email.sent_or_received || "").toLowerCase() === "sent";
  const subject = (email.subject || "").trim() || "(No Subject)";
  const sender = (email.sender || "").trim() || "Unknown Sender";
  const recipients = (email.recipients || "").trim() || "Unknown Recipient";
  const dateFormatted = formatContactDate(email.communication_date);

  const rawHtml = (email.content || "").trim();
  const rawText = (email.text_content || "").trim();
  const hasHtml = Boolean(rawHtml);
  const hasText = Boolean(rawText);

  // Content length estimate to decide if expandable
  const previewText = rawText || rawHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const isLong = previewText.length > 280 || (rawHtml && rawHtml.length > 400);

  const sanitized = hasHtml ? sanitizeHtml(rawHtml) : "";
  const attachments = Array.isArray(email.attachments) ? email.attachments : [];
  const hasAttachment = Boolean(email.has_attachment || attachments.length > 0);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white ${
        isSent
          ? "border-blue-100/90 hover:border-blue-200 shadow-2xs hover:shadow-xs"
          : "border-emerald-100/90 hover:border-emerald-200 shadow-2xs hover:shadow-xs"
      }`}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
              isSent
                ? "bg-blue-50 text-[#032e92] border border-blue-200/70"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
            }`}
            title={isSent ? "Outgoing Email" : "Incoming Email"}
          >
            <FontAwesomeIcon icon={isSent ? faPaperPlane : faInbox} />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isSent
                    ? "bg-blue-50 text-[#032e92] border border-blue-200/60"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                }`}
              >
                {isSent ? "Outgoing" : "Incoming"}
              </span>

              {email.origin_label && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                  <span>{email.origin_label}</span>
                </span>
              )}

              {hasAttachment && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                  <FontAwesomeIcon icon={faPaperclip} className="text-gray-400 text-[9px]" />
                  <span>
                    {attachments.length > 0
                      ? `${attachments.length} attachment${attachments.length > 1 ? "s" : ""}`
                      : "Attachment"}
                  </span>
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-gray-900 mt-1 truncate" title={subject}>
              {subject}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-400 self-start sm:self-center shrink-0">
          <FontAwesomeIcon icon={faClock} className="text-gray-300 text-[10px]" />
          <span>{dateFormatted}</span>
        </div>
      </div>

      {/* Sender & Recipient Details */}
      <div className="px-4 sm:px-5 py-2.5 bg-gray-50/60 text-[11px] text-gray-600 border-b border-gray-100/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="truncate max-w-full">
            <span className="font-semibold text-gray-500">From: </span>
            <span className="text-gray-800 font-mono text-[10px] sm:text-[11px]">{sender}</span>
          </div>
          <div className="truncate max-w-full">
            <span className="font-semibold text-gray-500">To: </span>
            <span className="text-gray-800 font-mono text-[10px] sm:text-[11px]">{recipients}</span>
          </div>
        </div>

        {onReply && (
          <button
            type="button"
            onClick={() => onReply(email)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#032e92] hover:text-[#022167] py-0.5 px-2 rounded hover:bg-blue-50 transition-colors cursor-pointer"
            title="Reply to this email"
          >
            <FontAwesomeIcon icon={faReply} className="text-[10px]" />
            <span>Reply</span>
          </button>
        )}
      </div>

      {/* Message Body */}
      <div className="p-4 sm:p-5">
        <div
          className={`relative transition-all duration-300 ${
            isLong && !isExpanded ? "max-h-36 overflow-hidden" : ""
          }`}
        >
          {viewMode === "plain" || (!hasHtml && hasText) ? (
            <p className="text-xs text-gray-700 font-sans whitespace-pre-wrap break-words leading-relaxed select-text">
              {rawText || previewText || <span className="italic text-gray-400">(Empty message body)</span>}
            </p>
          ) : hasHtml ? (
            <div
              className="text-xs text-gray-700 leading-relaxed overflow-x-auto select-text [&_a]:text-[#032e92] [&_a]:underline [&_table]:border-collapse [&_table]:w-full [&_td]:border [&_td]:border-gray-200 [&_td]:p-1.5 [&_th]:border [&_th]:border-gray-200 [&_th]:p-1.5 [&_th]:bg-gray-50 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-500"
              dangerouslySetInnerHTML={{ __html: sanitized }}
            />
          ) : (
            <p className="text-xs italic text-gray-400 select-none">(No message content provided)</p>
          )}

          {isLong && !isExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Card Footer: Expand/Collapse & View Toggles & Attachments */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {isLong && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#032e92] hover:text-[#022167] py-1 px-2 rounded-lg hover:bg-blue-50/80 transition-colors cursor-pointer"
              >
                <span>{isExpanded ? "Show Less" : "Show Full Message"}</span>
                <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="text-[10px]" />
              </button>
            )}

            {hasHtml && hasText && (
              <button
                type="button"
                onClick={() => setViewMode((m) => (m === "plain" ? "auto" : "plain"))}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-800 py-1 px-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                title="Toggle Plain Text / HTML View"
              >
                <FontAwesomeIcon icon={faFileLines} className="text-[10px]" />
                <span>{viewMode === "plain" ? "HTML View" : "Plain Text"}</span>
              </button>
            )}
          </div>

          {/* Attachments List */}
          {attachments.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {attachments.map((att, idx) => (
                <a
                  key={att.name || idx}
                  href={att.file_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 hover:text-[#032e92] bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded-md border border-gray-200 transition-colors"
                  title={att.file_name}
                >
                  <FontAwesomeIcon icon={faPaperclip} className="text-gray-400 text-[10px]" />
                  <span className="truncate max-w-[140px]">{att.file_name || "Attachment"}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CrmEmailConversations({
  doctype,
  docName,
  contactEmail = "",
  initialConversations = null,
  initialTotal = 0,
  initialHasMore = false,
  onCountChange = null,
  autoFocusComposer = false,
}) {
  const [conversations, setConversations] = useState(initialConversations || []);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(initialConversations === null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // In-app Email Composer state
  const [isComposing, setIsComposing] = useState(autoFocusComposer);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [cc, setCc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [inReplyTo, setInReplyTo] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendFeedback, setSendFeedback] = useState({ type: "", message: "" });
  const [sourceFilter, setSourceFilter] = useState("all");

  const composerRef = useRef(null);
  const subjectInputRef = useRef(null);
  const contentInputRef = useRef(null);
  const pageLength = 20;

  const fetchConversations = useCallback(
    async (targetPage = 1, append = false, sync = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const res = await crmService.getConversations(doctype, docName, targetPage, pageLength, sync);
        const incoming = Array.isArray(res.conversations) ? res.conversations : [];
        const total = typeof res.total_count === "number" ? res.total_count : incoming.length;
        const more = Boolean(res.has_more);

        if (append) {
          setConversations((prev) => [...prev, ...incoming]);
        } else {
          setConversations(incoming);
        }

        setTotalCount(total);
        setHasMore(more);
        setPage(targetPage);

        if (onCountChange) {
          onCountChange(total);
        }
      } catch (err) {
        setError(err.message || "Failed to load email conversations.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [doctype, docName, onCountChange]
  );

  useEffect(() => {
    if (!docName) return;
    if (initialConversations && initialConversations.length > 0 && page === 1) {
      setConversations(initialConversations);
      setTotalCount(initialTotal);
      setHasMore(initialHasMore);
      setLoading(false);
    } else {
      fetchConversations(1, false);
    }
  }, [docName, doctype, fetchConversations, initialConversations, initialHasMore, initialTotal, page]);

  useEffect(() => {
    if (autoFocusComposer) {
      setIsComposing(true);
      setTimeout(() => {
        if (subjectInputRef.current) {
          subjectInputRef.current.focus();
        }
      }, 150);
    }
  }, [autoFocusComposer]);

  const handleOpenComposer = () => {
    setIsComposing(true);
    setInReplyTo(null);
    setSendFeedback({ type: "", message: "" });
    setTimeout(() => {
      if (subjectInputRef.current) {
        subjectInputRef.current.focus();
      }
    }, 100);
  };

  const handleReply = (email) => {
    setIsComposing(true);
    const prevSubj = email.subject || "";
    const cleanSubj = prevSubj.toLowerCase().startsWith("re:") ? prevSubj : `Re: ${prevSubj}`;
    setSubject(cleanSubj);
    setInReplyTo(email.name);
    setSendFeedback({ type: "", message: "" });

    // Scroll to composer
    setTimeout(() => {
      if (composerRef.current) {
        composerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (contentInputRef.current) {
        contentInputRef.current.focus();
      }
    }, 100);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      setSendFeedback({ type: "error", message: "Subject and message body are required." });
      return;
    }

    if (!contactEmail) {
      setSendFeedback({
        type: "error",
        message: `This ${doctype} does not have a registered email address.`,
      });
      return;
    }

    setSendingEmail(true);
    setSendFeedback({ type: "", message: "" });

    try {
      await crmService.sendEmail({
        doctype,
        name: docName,
        subject: subject.trim(),
        content: content.trim(),
        cc: cc.trim() || undefined,
        in_reply_to: inReplyTo || undefined,
      });

      setSendFeedback({ type: "success", message: "Email sent and recorded successfully!" });
      setSubject("");
      setContent("");
      setCc("");
      setInReplyTo(null);

      // Refresh conversations list to show newly sent communication
      await fetchConversations(1, false);

      setTimeout(() => {
        setIsComposing(false);
        setSendFeedback({ type: "", message: "" });
      }, 1800);
    } catch (err) {
      setSendFeedback({
        type: "error",
        message: err.message || "Failed to send email. Check SMTP configuration.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchConversations(page + 1, true);
  };

  const handleRefresh = () => {
    fetchConversations(1, false, true);
  };

  const availableSources = Array.from(new Set(conversations.map((c) => c.origin_label).filter(Boolean)));
  const displayedConversations =
    sourceFilter === "all"
      ? conversations
      : conversations.filter((c) => c.origin_label === sourceFilter);

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-100 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#032e92]" />
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Email Communications
          </h3>
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {totalCount} {totalCount === 1 ? "email" : "emails"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#032e92] px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Check mailbox for new replies and refresh conversation"
          >
            <FontAwesomeIcon icon={faArrowsRotate} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{loading ? "Checking..." : "Refresh"}</span>
          </button>

          {!isComposing && (
            <button
              type="button"
              onClick={handleOpenComposer}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white px-3.5 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[11px]" />
              <span>Compose Email</span>
            </button>
          )}
        </div>
      </div>

      {/* IN-APP EMAIL COMPOSER */}
      {isComposing && (
        <div
          ref={composerRef}
          className="rounded-3xl border border-blue-200/90 bg-gradient-to-b from-[#f9fbff] to-white p-5 shadow-xs space-y-4 transition-all"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-100/70 text-[#032e92] flex items-center justify-center text-xs font-bold">
                <FontAwesomeIcon icon={inReplyTo ? faReply : faEnvelope} />
              </span>
              <div>
                <h4 className="text-xs font-bold text-gray-900">
                  {inReplyTo ? "Reply to Email Thread" : "Compose New Email"}
                </h4>
                <p className="text-[11px] text-gray-500">
                  Dispatches via official company mailbox and automatically links to this {doctype}.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsComposing(false);
                setInReplyTo(null);
                setSendFeedback({ type: "", message: "" });
              }}
              className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Close Composer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-3.5 text-xs">
            {/* Recipient Field */}
            <div className="flex items-center gap-2">
              <span className="w-14 text-gray-500 font-semibold text-right shrink-0">To:</span>
              <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-800 font-mono text-[11px] flex items-center justify-between">
                <span>{contactEmail || <span className="text-red-500 italic">No email address on record</span>}</span>
                {!showCc && (
                  <button
                    type="button"
                    onClick={() => setShowCc(true)}
                    className="text-[10px] font-bold text-[#032e92] hover:underline cursor-pointer"
                  >
                    + Cc
                  </button>
                )}
              </div>
            </div>

            {/* Optional Cc Field */}
            {showCc && (
              <div className="flex items-center gap-2">
                <span className="w-14 text-gray-500 font-semibold text-right shrink-0">Cc:</span>
                <input
                  type="text"
                  placeholder="Optional comma-separated email addresses..."
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92]"
                />
              </div>
            )}

            {/* Subject Field */}
            <div className="flex items-center gap-2">
              <span className="w-14 text-gray-500 font-semibold text-right shrink-0">Subject:</span>
              <input
                ref={subjectInputRef}
                type="text"
                placeholder="Subject of the email..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92]"
              />
            </div>

            {/* Message Body Field */}
            <div className="space-y-1">
              <textarea
                ref={contentInputRef}
                rows={6}
                placeholder="Type your email message here... HTML and line breaks will be formatted cleanly."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-2xl p-3.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] leading-relaxed resize-y"
              />
            </div>

            {/* Feedback Message */}
            {sendFeedback.message && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  sendFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <FontAwesomeIcon
                  icon={sendFeedback.type === "success" ? faCheckCircle : faTriangleExclamation}
                  className="shrink-0 text-sm"
                />
                <span className="font-medium">{sendFeedback.message}</span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsComposing(false);
                  setInReplyTo(null);
                  setSendFeedback({ type: "", message: "" });
                }}
                disabled={sendingEmail}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={sendingEmail || !subject.trim() || !content.trim() || !contactEmail}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingEmail ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span>Sending Email...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-sm mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Error loading email conversations</p>
              <p className="text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fetchConversations(page, false)}
            className="text-xs font-bold underline hover:no-underline text-red-700 shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State (Initial) */}
      {loading && (
        <div className="space-y-3 py-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-gray-200/70 bg-white animate-pulse space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="space-y-1.5 pt-2">
                <div className="h-2.5 bg-gray-100 rounded w-full" />
                <div className="h-2.5 bg-gray-100 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && conversations.length === 0 && (
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-gray-200 bg-[#fafbfe]">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#032e92] flex items-center justify-center text-lg mb-3">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <h4 className="text-xs font-bold text-gray-800">No email conversations yet</h4>
          <p className="text-[11px] text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            Incoming emails from {contactEmail ? <span className="font-semibold text-gray-700">{contactEmail}</span> : "this contact"} and
            outgoing transactional emails sent via KNAPS CRM will automatically be linked and shown here.
          </p>

          {!isComposing && (
            <button
              type="button"
              onClick={handleOpenComposer}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-[11px]" />
              <span>Send First Email</span>
            </button>
          )}
        </div>
      )}

      {/* Source Filter if multiple sources present */}
      {!loading && conversations.length > 0 && availableSources.length > 1 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1 pb-1">
          <span className="text-[11px] font-semibold text-gray-400 mr-1">Filter Source:</span>
          <button
            type="button"
            onClick={() => setSourceFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              sourceFilter === "all"
                ? "bg-[#032e92] text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            All Sources ({conversations.length})
          </button>
          {availableSources.map((src) => {
            const count = conversations.filter((c) => c.origin_label === src).length;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setSourceFilter(src)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  sourceFilter === src
                    ? "bg-[#032e92] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {src} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Conversation List */}
      {!loading && displayedConversations.length > 0 && (
        <div className="space-y-3.5">
          {displayedConversations.map((email) => (
            <EmailCard
              key={email.name || email.communication_date + email.subject}
              email={email}
              onReply={handleReply}
            />
          ))}
        </div>
      )}

      {/* Pagination: Load More */}
      {!loading && hasMore && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[#032e92]" />
                <span>Loading more emails...</span>
              </>
            ) : (
              <>
                <span>Load More Conversations</span>
                <span className="text-[11px] font-normal text-gray-400">
                  ({conversations.length} of {totalCount})
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
