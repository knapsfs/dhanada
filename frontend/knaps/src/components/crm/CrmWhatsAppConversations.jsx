import { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faComments,
  faClock,
  faCheck,
  faCheckDouble,
  faSpinner,
  faTriangleExclamation,
  faCircleExclamation,
  faCheckCircle,
  faArrowsRotate,
  faXmark,
  faPhone,
  faShieldHalved,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { crmService } from "../../services/crmService";

function MessageBubble({ msg }) {
  const isOutbound = (msg.direction || "").toLowerCase() === "outbound";
  const isTemplate = (msg.message_type || "").toLowerCase() === "template";
  const status = msg.status || "Sent";

  const renderStatusIcon = () => {
    switch (status) {
      case "Read":
        return (
          <span className="text-cyan-300 inline-flex items-center gap-0.5" title="Read by recipient">
            <FontAwesomeIcon icon={faCheckDouble} className="text-[10px]" />
          </span>
        );
      case "Delivered":
        return (
          <span className="text-gray-300 inline-flex items-center gap-0.5" title="Delivered to recipient">
            <FontAwesomeIcon icon={faCheckDouble} className="text-[10px]" />
          </span>
        );
      case "Sent":
        return (
          <span className="text-gray-300 inline-flex items-center gap-0.5" title="Sent by server">
            <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
          </span>
        );
      case "Queued":
        return (
          <span className="text-amber-300 inline-flex items-center gap-1" title="Queued in KNAPS CRM">
            <FontAwesomeIcon icon={faClock} className="text-[9px]" />
            <span className="text-[9px] uppercase font-bold tracking-wider">Queued</span>
          </span>
        );
      case "Failed":
        return (
          <span className="text-red-300 inline-flex items-center gap-1" title={msg.error_message || "Message delivery failed"}>
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[10px]" />
            <span className="text-[9px] uppercase font-bold tracking-wider">Failed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex w-full ${isOutbound ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-2xs transition-all relative ${
          isOutbound
            ? "bg-[#032e92] text-white rounded-br-xs"
            : "bg-white text-gray-900 border border-gray-200/90 rounded-bl-xs"
        }`}
      >
        {/* Template Header Badge */}
        {isTemplate && (
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase mb-1.5 ${
              isOutbound
                ? "bg-blue-900/60 text-blue-200 border border-blue-400/30"
                : "bg-purple-50 text-purple-700 border border-purple-200"
            }`}
          >
            <FontAwesomeIcon icon={faFileLines} className="text-[9px]" />
            <span>Template · {msg.template_name || "Official"}</span>
          </div>
        )}

        {/* Origin Label Badge (e.g., MPS Lead, SIF Lead, Client Direct) */}
        {msg.origin_label && (
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider mb-1.5 ${
              isTemplate ? "ml-1.5" : ""
            } ${
              isOutbound
                ? "bg-blue-950/60 text-blue-200 border border-blue-400/30"
                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
            }`}
          >
            <span>{msg.origin_label}</span>
          </div>
        )}

        {/* Message Body */}
        <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words">
          {msg.content || ""}
        </p>

        {/* Bottom Metadata: Timestamp & Status */}
        <div
          className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
            isOutbound ? "text-blue-200/90" : "text-gray-400"
          }`}
        >
          <span>{msg.sent_at_formatted || msg.creation || ""}</span>
          {isOutbound && renderStatusIcon()}
        </div>

        {/* Failed reason hint if present */}
        {status === "Failed" && msg.error_message && (
          <div className="mt-1.5 pt-1.5 border-t border-red-400/30 text-[10px] text-red-200">
            {msg.error_message}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CrmWhatsAppConversations({
  doctype,
  docName,
  recipientPhone = "",
  contactName = "",
  initialMessages = null,
  initialTotal = 0,
  initialHasMore = false,
  onCountChange = null,
  autoFocusComposer = false,
}) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(initialMessages === null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  // WhatsApp Session & Provider Metadata
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [providerConfigured, setProviderConfigured] = useState(true);
  const [phoneToUse, setPhoneToUse] = useState(recipientPhone);

  // Composer State
  const [messageText, setMessageText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateParamValues, setTemplateParamValues] = useState({});
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const messagesEndRef = useRef(null);
  const composerInputRef = useRef(null);
  const pageLength = 50;

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  const fetchConversations = useCallback(
    async (targetPage = 1, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError("");

      try {
        const res = await crmService.getWhatsAppConversations(doctype, docName, targetPage, pageLength);
        const incoming = Array.isArray(res.messages) ? res.messages : [];
        const total = typeof res.total_count === "number" ? res.total_count : incoming.length;
        const more = Boolean(res.has_more);

        if (append) {
          // Prepend older messages
          setMessages((prev) => [...incoming, ...prev]);
        } else {
          setMessages(incoming);
          setTimeout(() => scrollToBottom("auto"), 100);
        }

        setTotalCount(total);
        setHasMore(more);
        setPage(targetPage);
        setIsSessionActive(Boolean(res.is_session_active));
        setSessionExpiresAt(res.session_expires_at);
        if (Array.isArray(res.templates) && res.templates.length > 0) {
          setTemplates(res.templates);
        }
        if (typeof res.provider_configured === "boolean") {
          setProviderConfigured(res.provider_configured);
        }
        if (res.recipient_phone) {
          setPhoneToUse(res.recipient_phone);
        }

        if (onCountChange) {
          onCountChange(total);
        }
      } catch (err) {
        setError(err.message || "Failed to load WhatsApp conversations.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [doctype, docName, onCountChange]
  );

  useEffect(() => {
    if (!docName) return;
    fetchConversations(1, false);
  }, [docName, doctype, fetchConversations]);

  // Handle auto-focusing composer when triggered from parent view
  useEffect(() => {
    if (autoFocusComposer) {
      setTimeout(() => {
        if (composerInputRef.current) {
          composerInputRef.current.focus();
        }
      }, 200);
    }
  }, [autoFocusComposer]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    if (!phoneToUse) {
      setFeedback({
        type: "error",
        message: `This ${doctype} does not have a registered mobile number.`,
      });
      return;
    }

    setSending(true);
    setFeedback({ type: "", message: "" });

    try {
      const res = await crmService.sendWhatsAppMessage({
        doctype,
        name: docName,
        message: messageText.trim(),
      });

      setMessageText("");
      const warning = res.warning;
      if (warning) {
        setFeedback({
          type: "warning",
          message: warning,
        });
      } else {
        setFeedback({
          type: "success",
          message: "WhatsApp message dispatched successfully!",
        });
      }

      await fetchConversations(1, false);
      setTimeout(() => scrollToBottom("smooth"), 150);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to send WhatsApp message.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendTemplate = async (templateObj) => {
    if (!phoneToUse) {
      setFeedback({
        type: "error",
        message: `This ${doctype} does not have a registered mobile number.`,
      });
      return;
    }

    setSending(true);
    setFeedback({ type: "", message: "" });

    try {
      const paramsList = (templateObj.params || []).map(
        (paramName) => templateParamValues[paramName] || ""
      );

      const res = await crmService.sendWhatsAppMessage({
        doctype,
        name: docName,
        template_name: templateObj.name,
        template_params: paramsList,
      });

      setIsTemplateModalOpen(false);
      setSelectedTemplate("");
      setTemplateParamValues({});

      if (res.warning) {
        setFeedback({
          type: "warning",
          message: res.warning,
        });
      } else {
        setFeedback({
          type: "success",
          message: `Template "${templateObj.label || templateObj.name}" dispatched!`,
        });
      }

      await fetchConversations(1, false);
      setTimeout(() => scrollToBottom("smooth"), 150);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to send WhatsApp template message.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleOpenTemplatePicker = (tplName = "") => {
    const tpl = templates.find((t) => t.name === tplName) || templates[0];
    if (tpl) {
      setSelectedTemplate(tpl.name);
      // Pre-fill Customer Name param if available
      const initialParams = {};
      (tpl.params || []).forEach((p) => {
        if (p.toLowerCase().includes("customer") || p.toLowerCase().includes("client") || p.toLowerCase().includes("name")) {
          initialParams[p] = contactName || "";
        } else {
          initialParams[p] = "";
        }
      });
      setTemplateParamValues(initialParams);
    }
    setIsTemplateModalOpen(true);
  };

  const currentTemplateObj = templates.find((t) => t.name === selectedTemplate);

  const availableSources = Array.from(new Set(messages.map((m) => m.origin_label).filter(Boolean)));
  const displayedMessages =
    sourceFilter === "all" ? messages : messages.filter((m) => m.origin_label === sourceFilter);

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-gray-100 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            WhatsApp Communications
          </h3>
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {totalCount} {totalCount === 1 ? "message" : "messages"}
          </span>

          {phoneToUse && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <FontAwesomeIcon icon={faPhone} className="text-[9px] text-emerald-600" />
              <span>+{phoneToUse}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 24-Hour Session Status Badge */}
          {isSessionActive ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
              title={`Customer service session open until ${sessionExpiresAt || "24 hours"}`}
            >
              <FontAwesomeIcon icon={faClock} className="text-[9px]" />
              <span>24h Session Open</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
              title="Outside 24-hour service window. Meta requires approved WhatsApp templates."
            >
              <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" />
              <span>Template Window</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => fetchConversations(1, false)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#032e92] px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh WhatsApp messages"
          >
            <FontAwesomeIcon icon={faArrowsRotate} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenTemplatePicker()}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <FontAwesomeIcon icon={faFileLines} className="text-[11px]" />
            <span>Templates</span>
          </button>
        </div>
      </div>

      {/* Source Filter if multiple sources present */}
      {!loading && messages.length > 0 && availableSources.length > 1 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1 pb-1">
          <span className="text-[11px] font-semibold text-gray-400 mr-1">Filter Source:</span>
          <button
            type="button"
            onClick={() => setSourceFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              sourceFilter === "all"
                ? "bg-emerald-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            All Sources ({messages.length})
          </button>
          {availableSources.map((src) => {
            const count = messages.filter((m) => m.origin_label === src).length;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setSourceFilter(src)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  sourceFilter === src
                    ? "bg-emerald-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {src} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Provider Advisory if not yet configured with Meta Graph API */}
      {!providerConfigured && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">WhatsApp API Integration Ready: </span>
            Meta WhatsApp Cloud API credentials (<code className="font-mono text-[11px] bg-amber-100/80 px-1 py-0.5 rounded">phone_number_id</code> and <code className="font-mono text-[11px] bg-amber-100/80 px-1 py-0.5 rounded">whatsapp_access_token</code>) can be registered in <strong className="font-semibold">Dhanada Settings</strong>. Outbound messages sent from KNAPS CRM are safely tracked and queued in the CRM.
          </div>
        </div>
      )}

      {/* Feedback Alerts */}
      {feedback.message && (
        <div
          className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : feedback.type === "warning"
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={
                feedback.type === "success"
                  ? faCheckCircle
                  : feedback.type === "warning"
                  ? faTriangleExclamation
                  : faCircleExclamation
              }
            />
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: "", message: "" })}
            className="w-5 h-5 rounded-full hover:bg-black/5 flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 text-red-600" />
          <div className="flex-1">
            <h4 className="font-bold">Error Loading WhatsApp History</h4>
            <p className="mt-0.5 text-red-700">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => fetchConversations(1, false)}
            className="text-xs font-bold text-red-700 underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="rounded-3xl border border-gray-200/90 bg-[#f7f9fc] flex flex-col h-[460px] overflow-hidden shadow-2xs">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-1">
          {/* Loading Initial */}
          {loading && (
            <div className="h-full flex flex-col items-center justify-center py-16 gap-2 text-gray-500">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-emerald-600" />
              <p className="text-xs font-semibold">Loading WhatsApp conversations...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-2xs">
                <FontAwesomeIcon icon={faComments} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">No WhatsApp messages yet</h4>
                <p className="text-[11px] text-gray-500 max-w-sm mx-auto mt-1">
                  Start communicating with {contactName || "this contact"} via integrated WhatsApp. Messages sent here are stored directly in KNAPS CRM.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenTemplatePicker("knaps_welcome")}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  Send Welcome Template
                </button>
              </div>
            </div>
          )}

          {/* Message Bubbles */}
          {!loading && messages.length > 0 && (
            <>
              {hasMore && (
                <div className="text-center py-2">
                  <button
                    type="button"
                    onClick={() => fetchConversations(page + 1, true)}
                    disabled={loadingMore}
                    className="text-[11px] font-semibold text-gray-500 hover:text-emerald-700 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <span className="inline-flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-emerald-600" />
                        <span>Loading older messages...</span>
                      </span>
                    ) : (
                      "Load Older Messages"
                    )}
                  </button>
                </div>
              )}
              {displayedMessages.map((m) => (
                <MessageBubble key={m.name || m.message_id || m.creation} msg={m} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Composer Area */}
        <div className="p-3 bg-white border-t border-gray-200 shrink-0">
          {!isSessionActive && (
            <div className="mb-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faShieldHalved} className="text-amber-600" />
                <span>24h window closed. Use an approved template for best delivery.</span>
              </span>
              <button
                type="button"
                onClick={() => handleOpenTemplatePicker()}
                className="text-[10px] font-bold text-amber-900 underline cursor-pointer hover:text-black"
              >
                Choose Template
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={composerInputRef}
                rows={2}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  phoneToUse
                    ? `Type a message to +${phoneToUse} (Press Enter to send)...`
                    : "No mobile number available for this contact..."
                }
                disabled={sending || !phoneToUse}
                className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors resize-none disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => handleOpenTemplatePicker()}
                className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Send WhatsApp Template"
              >
                <FontAwesomeIcon icon={faFileLines} />
              </button>

              <button
                type="submit"
                disabled={sending || !messageText.trim() || !phoneToUse}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                {sending ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span className="hidden sm:inline">Sending...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* TEMPLATE PICKER MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold">
                  <FontAwesomeIcon icon={faFileLines} />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Approved WhatsApp Templates</h3>
                  <p className="text-[11px] text-gray-400">Compliant with Meta WhatsApp Business policies</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Select Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    const chosen = templates.find((t) => t.name === e.target.value);
                    setSelectedTemplate(e.target.value);
                    if (chosen) {
                      const paramsObj = {};
                      (chosen.params || []).forEach((p) => {
                        if (p.toLowerCase().includes("customer") || p.toLowerCase().includes("client") || p.toLowerCase().includes("name")) {
                          paramsObj[p] = contactName || "";
                        } else {
                          paramsObj[p] = "";
                        }
                      });
                      setTemplateParamValues(paramsObj);
                    }
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.name} value={tpl.name}>
                      {tpl.label} ({tpl.category})
                    </option>
                  ))}
                </select>
              </div>

              {currentTemplateObj && (
                <>
                  {/* Parameter Inputs */}
                  {Array.isArray(currentTemplateObj.params) && currentTemplateObj.params.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Template Parameters
                      </label>
                      {currentTemplateObj.params.map((param) => (
                        <div key={param}>
                          <span className="text-[10px] text-gray-500 font-semibold">{param}</span>
                          <input
                            type="text"
                            value={templateParamValues[param] || ""}
                            onChange={(e) =>
                              setTemplateParamValues({
                                ...templateParamValues,
                                [param]: e.target.value,
                              })
                            }
                            placeholder={`Enter ${param}...`}
                            className="w-full text-xs p-2 rounded-lg border border-gray-200 focus:outline-hidden focus:border-emerald-600"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Template Preview */}
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Preview
                    </span>
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-gray-800 leading-relaxed font-sans">
                      {(() => {
                        let text = currentTemplateObj.body_template || "";
                        (currentTemplateObj.params || []).forEach((p, idx) => {
                          const val = templateParamValues[p] || `{${p}}`;
                          text = text.replace(`{${idx}}`, val);
                        });
                        return text;
                      })()}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sending || !currentTemplateObj || !phoneToUse}
                onClick={() => handleSendTemplate(currentTemplateObj)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
                    <span>Send Template</span>
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
