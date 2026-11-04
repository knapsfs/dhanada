import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faPhone, faEnvelope, faPaperPlane, faUserCheck,
  faCommentDots, faListCheck, faSpinner,
  faCheckCircle, faCircleExclamation, faTriangleExclamation,
  faClock, faFloppyDisk, faUser, faTrash, faCopy, faCheck,
  faLocationDot, faCoins, faFileLines, faPlus, faXmark, faComments,
  faLink, faArrowUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons";
import CrmSelect from "./CrmSelect";
import { crmService } from "../../services/crmService";
import { getContactStatus, formatContactDate } from "../../utils/crmContactUtils";

const STATUS_COLORS = {
  New: "bg-blue-50 text-[#032e92] border-blue-200",
  Interested: "bg-amber-50 text-amber-700 border-amber-200",
  Nurturing: "bg-purple-50 text-purple-700 border-purple-200",
  Converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Not Interested": "bg-gray-100 text-gray-700 border-gray-300",
  Junk: "bg-red-50 text-red-700 border-red-200",
};

export default function CrmLeadDetailView({
  leadName,
  onBack,
  onLeadUpdated,
  onDeleteLead,
  onLogInteraction,
  onNewTask,
  onNavigateToClient,
  refreshKey = 0,
}) {
  const [leadData, setLeadData] = useState(null);
  const [sendFormModalOpen, setSendFormModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [conversationsTotal, setConversationsTotal] = useState(0);
  const [conversationsHasMore, setConversationsHasMore] = useState(false);
  const [whatsappMessages, setWhatsappMessages] = useState([]);
  const [whatsappTotal, setWhatsappTotal] = useState(0);
  const [whatsappHasMore, setWhatsappHasMore] = useState(false);
  const [focusEmailComposer, setFocusEmailComposer] = useState(false);
  const [focusWhatsAppComposer, setFocusWhatsAppComposer] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, emails, whatsapp, timeline, tasks
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [remarkText, setRemarkText] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const activityHubRef = useRef(null);

  useEffect(() => {
    if (!leadName) return;
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadName, refreshKey]);

  const isWelcomeSent = leadData?.welcome_email_status === "Sent";

  const loadDetails = async (preserveFeedback = false) => {
    setLoading(true);
    if (!preserveFeedback) {
      setFeedback({ type: "", message: "" });
    }
    try {
      const res = await crmService.getLeadDetails(leadName);
      setLeadData(res.lead);
      setInteractions(res.interactions || []);
      setTasks(res.tasks || []);
      setConversations(res.conversations || []);
      setConversationsTotal(res.conversations_total || (res.conversations || []).length);
      setConversationsHasMore(Boolean(res.conversations_has_more));
      setWhatsappMessages(res.whatsapp_messages || []);
      setWhatsappTotal(res.whatsapp_total || (res.whatsapp_messages || []).length);
      setWhatsappHasMore(Boolean(res.whatsapp_has_more));
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to load lead details." });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!leadData || leadData.status === newStatus) return;
    setActionLoading("status");
    try {
      const updated = await crmService.updateLeadStatus(leadData.name, newStatus);
      setLeadData(updated);
      if (onLeadUpdated) onLeadUpdated(updated);
      setFeedback({ type: "success", message: `Lead status updated to ${newStatus}` });
      await loadDetails(true);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to update status." });
    } finally {
      setActionLoading("");
    }
  };

  const handleSendWelcome = async () => {
    if (isWelcomeSent) {
      setFeedback({ type: "info", message: "Welcome email has already been sent to this lead." });
      return;
    }
    setActionLoading("welcome");
    try {
      await crmService.sendWelcomeEmail(leadData.name);
      setFeedback({ type: "success", message: "Welcome email queued successfully!" });
      await loadDetails(true);
      if (onLeadUpdated) {
        onLeadUpdated({ ...leadData, welcome_email_status: "Sent" });
      }
    } catch (err) {
      if (
        err.status === 409 ||
        (err.message && (
          err.message.toLowerCase().includes("already been sent") ||
          err.message.toLowerCase().includes("duplicate")
        ))
      ) {
        setFeedback({ type: "info", message: "Welcome email has already been sent to this lead." });
      } else {
        setFeedback({ type: "error", message: err.message || "Failed to send welcome email." });
      }
      await loadDetails(true);
    } finally {
      setActionLoading("");
    }
  };

  const handleSendProfiler = async () => {
    if (actionLoading) return;
    setActionLoading("profiler");
    try {
      await crmService.sendRiskProfiler(leadData.name);
      setFeedback({ type: "success", message: "Risk Profiler link sent successfully!" });
      await loadDetails(true);
      if (onLeadUpdated) {
        onLeadUpdated({ ...leadData, risk_profiler_status: "Sent" });
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to send Risk Profiler link." });
      await loadDetails(true);
    } finally {
      setActionLoading("");
    }
  };

  const handleSendOnboarding = async () => {
    setActionLoading("onboarding");
    try {
      await crmService.sendOnboardingAndProfiler(leadData.name);
      setFeedback({ type: "success", message: "Onboarding & Risk Profiler links sent!" });
      await loadDetails(true);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to send onboarding links." });
    } finally {
      setActionLoading("");
    }
  };

  const handleConvertClient = async () => {
    if (!window.confirm(`Convert ${leadData?.lead_name || "this lead"} into a formal KNAPS Client?`)) return;
    setActionLoading("convert");
    try {
      const res = await crmService.convertToClient(leadData.name);
      setFeedback({ type: "success", message: `Lead successfully converted to Client ${res.client_id || ""}!` });
      await loadDetails(true);
      if (onLeadUpdated) onLeadUpdated({ ...leadData, status: "Converted" });
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to convert lead." });
    } finally {
      setActionLoading("");
    }
  };

  const handleSaveRemark = async (e) => {
    e?.preventDefault();
    if (!remarkText.trim()) {
      setFeedback({ type: "error", message: "Remark text cannot be empty." });
      return;
    }
    setSavingRemark(true);
    try {
      const res = await crmService.saveContactRemark("Lead", leadData.name, remarkText.trim());
      setFeedback({ type: "success", message: "Latest remark and contact timestamp saved successfully!" });
      setRemarkText("");
      const updatedLead = {
        ...leadData,
        latest_remark: res.latest_remark,
        last_contacted_by: res.last_contacted_by,
        last_contacted_on: res.last_contacted_on,
        days_since_contact: res.days_since_contact,
        is_contact_overdue: res.is_contact_overdue,
      };
      setLeadData(updatedLead);
      if (onLeadUpdated) onLeadUpdated(updatedLead);
      await loadDetails(true);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to save remark." });
    } finally {
      setSavingRemark(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!leadData) return;
    setIsDeleting(true);
    try {
      await crmService.deleteLead(leadData.name);
      setIsDeleteModalOpen(false);
      if (onDeleteLead) {
        onDeleteLead(leadData.name);
      }
      if (onBack) {
        onBack();
      }
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to delete lead." });
      setIsDeleting(false);
    }
  };

  const handleCopyText = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleTaskStatusToggle = async (taskName, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Open" : "Completed";
    try {
      await crmService.updateTaskStatus(taskName, newStatus);
      await loadDetails(true);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to update task." });
    }
  };

  const cleanPhone = leadData?.mobile_no ? leadData.mobile_no.replace(/\D/g, "") : "";
  const associatedClient = leadData?.client || leadData?.converted_client || null;

  const contactInfo = getContactStatus(
    leadData?.last_contacted_on,
    leadData?.days_since_contact,
    leadData?.is_contact_overdue
  );

  const handleOpenEmailSection = () => {
    setActiveTab("emails");
    setFocusEmailComposer((prev) => !prev);
    setTimeout(() => {
      if (activityHubRef.current) {
        activityHubRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  const handleOpenWhatsAppSection = () => {
    setActiveTab("whatsapp");
    setFocusWhatsAppComposer((prev) => !prev);
    setTimeout(() => {
      if (activityHubRef.current) {
        activityHubRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  if (loading && !leadData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-[#032e92]" />
          <p className="text-sm font-medium text-gray-500">Loading lead details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Navigation & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#032e92] hover:border-[#032e92]/40 hover:bg-blue-50/50 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span>Back to Leads</span>
          </button>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Monospace Lead ID badge */}
          <span className="font-mono text-xs font-bold text-gray-500 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-1.5">
            <span>{leadData?.name || leadName}</span>
            <button
              type="button"
              onClick={() => handleCopyText(leadData?.name || leadName, "leadId")}
              className="text-gray-400 hover:text-[#032e92] transition-colors cursor-pointer"
              title="Copy ID"
            >
              <FontAwesomeIcon icon={copiedField === "leadId" ? faCheck : faCopy} className="text-[10px]" />
            </button>
          </span>

          {/* Stage Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Stage:</span>
            <CrmSelect
              value={leadData?.status || "New"}
              disabled={actionLoading === "status"}
              onChange={(val) => handleStatusChange(val)}
              options={["New", "Interested", "Nurturing", "Converted", "Not Interested", "Junk"]}
              size="sm"
              className="w-36"
            />
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct Phone Link */}
          {cleanPhone && (
            <a
              href={`tel:${cleanPhone}`}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#032e92] hover:border-[#032e92] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Call Lead"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs text-blue-600" />
              <span className="hidden md:inline">Call</span>
            </a>
          )}

          {/* Delete Lead Button */}
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-xs shadow-2xs cursor-pointer"
            title="Delete Lead"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      {/* Notifications / Feedback Bar */}
      {feedback.message && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs ${feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : feedback.type === "info"
                ? "bg-blue-50 text-blue-800 border border-blue-200"
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
            className="text-gray-400 hover:text-gray-700 cursor-pointer text-xs"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {/* Hero Lead Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Name & Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[leadData?.status] || "bg-gray-100 text-gray-700"}`}>
                {leadData?.status || "New"}
              </span>
              {leadData?.source && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  Source: {leadData.source}
                </span>
              )}
              {leadData?.product_interest && (
                <span className="text-xs font-semibold text-[#032e92] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {leadData.product_interest}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {leadData?.lead_name || "Lead Details"}
            </h1>

            <p className="text-xs text-gray-500 font-medium flex items-center gap-4 flex-wrap">
              <span>Created on {leadData?.creation ? new Date(leadData.creation).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
              <span>•</span>
              <span>City: <strong className="text-gray-700">{leadData?.city || "Not Specified"}</strong></span>
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            {/* Contact Status */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Contact Health</span>
              <div className="mt-1">
                {contactInfo.isOverdue ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-xs" />
                    <span>Overdue ({contactInfo.days}d)</span>
                  </span>
                ) : contactInfo.status === "never_contacted" ? (
                  <span className="text-xs font-medium text-gray-500">No contact yet</span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700">{contactInfo.label}</span>
                )}
              </div>
            </div>

            {/* Risk Profile */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Risk Profile</span>
              <p className="text-xs font-bold text-gray-900 mt-1 truncate">
                {leadData?.risk_profile || "Pending Profiler"}
              </p>
            </div>

            {/* Total Touchpoints */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Touchpoints</span>
              <p className="text-xs font-bold text-gray-900 mt-1">
                {interactions.length} {interactions.length === 1 ? "interaction" : "interactions"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Multi-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Main Activity, Remarks & History (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Contact Health & Latest Remark */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faCommentDots} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Contact Health & Latest Remark</h3>
                  <p className="text-[11px] text-gray-400">Track all communication and maintain advisor compliance</p>
                </div>
              </div>

              {/* Overdue Warning Pill */}
              {contactInfo.isOverdue ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-xs" />
                  <span>{contactInfo.label}</span>
                </span>
              ) : contactInfo.status === "never_contacted" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-gray-100 text-gray-600">
                  <span>{contactInfo.label}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-xs" />
                  <span>{contactInfo.label}</span>
                </span>
              )}
            </div>

            {/* Overdue Warning Alert Box */}
            {contactInfo.isOverdue && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-sm mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Follow-up Overdue Warning</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    This lead has not been contacted in {contactInfo.days} days. Please record an interaction remark below to reset the contact timer.
                  </p>
                </div>
              </div>
            )}

            {/* Current Recorded Remark */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-gray-200/80 text-xs">
              {leadData?.latest_remark ? (
                <div className="space-y-3">
                  <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap text-sm italic">
                    "{leadData.latest_remark}"
                  </p>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-3 text-[11px] text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 text-[10px]" />
                      <span>Contacted by: <strong className="text-gray-800">{leadData.last_contacted_by || "Advisor"}</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faClock} className="text-gray-400 text-[10px]" />
                      <span>{formatContactDate(leadData.last_contacted_on)}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic py-2">
                  No contact remark recorded yet. Enter a remark below to record contact and reset the compliance timer.
                </p>
              )}
            </div>

            {/* New Remark Input Form */}
            <form onSubmit={handleSaveRemark} className="space-y-3 pt-1">
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Record New Contact Remark
              </label>
              <textarea
                rows={3}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter latest conversation notes, client discussion, investment interest, or follow-up outcome..."
                className="w-full text-xs p-3.5 rounded-2xl border border-gray-200 bg-[#fbfcfd] focus:bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-[#032e92]/20 transition-all resize-none shadow-2xs"
              />

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {["Connected on Call", "WhatsApp Shared", "Meeting Scheduled", "Requested Proposal"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRemarkText((prev) => (prev ? `${prev} - ${chip}` : chip))}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={savingRemark || !remarkText.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {savingRemark ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                      <span>Saving Remark...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />
                      <span>Save Remark</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Card: Activity Hub (Overview, Interactions, Tasks) */}
          <div ref={activityHubRef} className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden scroll-mt-6">
            {/* Tabs Header */}
            <div className="flex items-center px-6 border-b border-gray-200 bg-[#fcfdfe] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer shrink-0 ${activeTab === "overview"
                    ? "border-[#032e92] text-[#032e92]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
              >
                Overview & Activity
              </button>


              <button
                type="button"
                onClick={() => setActiveTab("timeline")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${activeTab === "timeline"
                    ? "border-[#032e92] text-[#032e92]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
              >
                <span>Interactions Timeline</span>
                <span className="w-5 h-5 rounded-full bg-blue-50 text-[#032e92] text-[10px] flex items-center justify-center font-bold">
                  {interactions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tasks")}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${activeTab === "tasks"
                    ? "border-[#032e92] text-[#032e92]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
              >
                <span>Tasks & Follow-ups</span>
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 text-[10px] flex items-center justify-center font-bold">
                  {tasks.length}
                </span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Two Column Grid for Tasks & Recent Touchpoints */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Next Steps / Pending Tasks */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-gray-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faListCheck} className="text-[#032e92]" />
                          <span>Pending Tasks</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onNewTask && onNewTask(leadData)}
                          className="text-[11px] font-bold text-[#032e92] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                          <span>Add Task</span>
                        </button>
                      </div>

                      {tasks.length === 0 ? (
                        <p className="text-xs text-gray-400 italic py-4 text-center">No open tasks for this lead.</p>
                      ) : (
                        <div className="space-y-2">
                          {tasks.slice(0, 3).map((t) => (
                            <div key={t.name} className="p-2.5 bg-white rounded-xl border border-gray-200/80 shadow-2xs text-xs space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-gray-900 truncate">{t.title}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                                  {t.priority}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-400 flex items-center justify-between">
                                <span>Due: {t.due_date}</span>
                                <span>{t.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Touchpoints Preview */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-gray-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faCommentDots} className="text-[#032e92]" />
                          <span>Recent Touchpoints</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onLogInteraction && onLogInteraction(leadData)}
                          className="text-[11px] font-bold text-[#032e92] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                          <span>Log Touchpoint</span>
                        </button>
                      </div>

                      {interactions.length === 0 ? (
                        <p className="text-xs text-gray-400 italic py-4 text-center">No touchpoints recorded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {interactions.slice(0, 3).map((int) => (
                            <div key={int.name} className="p-2.5 bg-white rounded-xl border border-gray-200/80 shadow-2xs text-xs space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-gray-900 truncate">{int.summary}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#032e92]">
                                  {int.interaction_type}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400">
                                {new Date(int.interaction_date).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lifecycle Milestones */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Client Lifecycle Milestones
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200/70">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Welcome Email</span>
                        <span className="font-bold text-gray-900 text-xs mt-1 block">
                          {leadData?.welcome_email_status || "Not Sent"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200/70">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Risk Profiler</span>
                        <span className="font-bold text-gray-900 text-xs mt-1 block">
                          {leadData?.risk_profiler_status || "Not Initiated"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200/70">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">KYC & Onboarding</span>
                        <span className="font-bold text-gray-900 text-xs mt-1 block">
                          {leadData?.onboarding_status || "Not Initiated"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIONS TIMELINE */}
              {activeTab === "timeline" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Complete Touchpoint History</h4>
                      <p className="text-[11px] text-gray-400">Chronological history of calls, meetings, emails, and client discussions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLogInteraction && onLogInteraction(leadData)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <FontAwesomeIcon icon={faCommentDots} />
                      <span>Log New Touchpoint</span>
                    </button>
                  </div>

                  {interactions.length === 0 ? (
                    <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                      <FontAwesomeIcon icon={faCommentDots} className="text-3xl text-gray-300" />
                      <p className="text-xs font-bold text-gray-700">No interactions recorded yet</p>
                      <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                        Click "Log New Touchpoint" to record your calls, discussions, or meeting notes with this lead.
                      </p>
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-blue-100 ml-4 space-y-6 py-2">
                      {interactions.map((int) => (
                        <div key={int.name} className="relative pl-7">
                          {/* Timeline Node */}
                          <div className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#032e92] border-2 border-white shadow-xs" />

                          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2 hover:border-[#032e92]/30 transition-colors">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <span className="text-xs font-bold text-gray-900">{int.summary}</span>
                              <span className="text-[11px] font-semibold text-gray-400">
                                {new Date(int.interaction_date).toLocaleString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#032e92] font-bold">
                                {int.interaction_type}
                              </span>
                              <span className="text-gray-400 font-medium">Logged by {int.logged_by || "Advisor"}</span>
                            </div>

                            {int.details && (
                              <p className="text-xs text-gray-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-gray-100 whitespace-pre-wrap">
                                {int.details}
                              </p>
                            )}

                            {int.outcome && (
                              <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg font-medium inline-block">
                                Outcome: <strong>{int.outcome}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TASKS */}
              {activeTab === "tasks" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Associated Follow-up Tasks</h4>
                      <p className="text-[11px] text-gray-400">Scheduled reminders, document collections, and client action items</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNewTask && onNewTask(leadData)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <FontAwesomeIcon icon={faListCheck} />
                      <span>Add Follow-up Task</span>
                    </button>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                      <FontAwesomeIcon icon={faListCheck} className="text-3xl text-gray-300" />
                      <p className="text-xs font-bold text-gray-700">No open tasks for this lead</p>
                      <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                        Add reminders for callbacks, document collection, KYC submission, or portfolio reviews.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((t) => {
                        const isCompleted = t.status === "Completed";
                        return (
                          <div
                            key={t.name}
                            className={`p-4 rounded-2xl border transition-all ${isCompleted
                                ? "bg-gray-50/80 border-gray-200 opacity-60"
                                : "bg-white border-gray-200 shadow-2xs hover:border-[#032e92]/30"
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  type="button"
                                  onClick={() => handleTaskStatusToggle(t.name, t.status)}
                                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${isCompleted
                                      ? "bg-emerald-600 border-emerald-600 text-white"
                                      : "border-gray-300 hover:border-[#032e92] bg-white text-transparent"
                                    }`}
                                  title="Toggle Status"
                                >
                                  <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                </button>
                                <div>
                                  <h5 className={`text-xs font-bold ${isCompleted ? "line-through text-gray-400" : "text-gray-900"}`}>
                                    {t.title}
                                  </h5>
                                  <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 flex-wrap">
                                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                                      {t.priority}
                                    </span>
                                    <span>Due: <strong className="text-gray-700">{t.due_date}</strong></span>
                                    <span>Status: <strong className="text-gray-700">{t.status}</strong></span>
                                  </div>
                                  {t.description && (
                                    <p className="text-xs text-gray-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-gray-100">
                                      {t.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}


            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Detail Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Contact Profile */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-[#032e92]" />
              <span>Contact Profile</span>
            </h4>

            <div className="space-y-3.5 text-xs">
              {/* Mobile */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                  Mobile Number
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm font-mono">
                    {leadData?.mobile_no || "—"}
                  </span>
                  {leadData?.mobile_no && (
                    <button
                      type="button"
                      onClick={() => handleCopyText(leadData.mobile_no, "mobile")}
                      className="text-gray-400 hover:text-[#032e92] transition-colors cursor-pointer text-xs p-1"
                      title="Copy Mobile"
                    >
                      <FontAwesomeIcon icon={copiedField === "mobile" ? faCheck : faCopy} />
                    </button>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                  Email Address
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 truncate">
                    {leadData?.email || "—"}
                  </span>
                  {leadData?.email && (
                    <button
                      type="button"
                      onClick={() => handleCopyText(leadData.email, "email")}
                      className="text-gray-400 hover:text-[#032e92] transition-colors cursor-pointer text-xs p-1 shrink-0"
                      title="Copy Email"
                    >
                      <FontAwesomeIcon icon={copiedField === "email" ? faCheck : faCopy} />
                    </button>
                  )}
                </div>
              </div>

              {/* City / Location */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
                    City / Location
                  </span>
                  <span className="font-semibold text-gray-900">
                    {leadData?.city || "Not Specified"}
                  </span>
                </div>
                <FontAwesomeIcon icon={faLocationDot} className="text-gray-400 text-sm" />
              </div>

              {/* Lead Source */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
                  Lead Acquisition Source
                </span>
                <span className="font-semibold text-gray-900">
                  {leadData?.source || "Direct Form / Portal"}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Investment Goals & Profiler */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faCoins} className="text-amber-500" />
              <span>Investment Goals & Profiler</span>
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
                  Investment Range
                </span>
                <span className="font-bold text-gray-900 text-sm">
                  {leadData?.investment_amount_range || "Not Defined"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">
                  Time Horizon
                </span>
                <span className="font-semibold text-gray-900">
                  {leadData?.investment_horizon || "Not Defined"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Risk Profiler Score
                  </span>
                  <span className="font-bold text-[#032e92]">
                    {leadData?.risk_score ? `${leadData.risk_score} / 50` : "—"}
                  </span>
                </div>
                {leadData?.risk_score ? (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#032e92] h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, Number(leadData.risk_score)))}%` }}
                    />
                  </div>
                ) : null}
                <span className="text-[11px] text-gray-500 font-medium block mt-1.5">
                  Category: <strong className="text-gray-800">{leadData?.risk_profile || "Pending Profiler"}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Card: Advisor Notes */}
          {leadData?.notes && (
            <div className="bg-amber-50/50 rounded-3xl border border-amber-200/70 p-5 sm:p-6 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <FontAwesomeIcon icon={faFileLines} className="text-amber-700" />
                <span>Advisor Private Notes</span>
              </h4>
              <p className="text-xs text-amber-950 leading-relaxed font-normal whitespace-pre-wrap bg-white/70 p-3.5 rounded-2xl border border-amber-200/50">
                {leadData.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-sm shrink-0">
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Delete Lead</h3>
                  <p className="text-xs text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to delete <strong className="text-gray-900 font-semibold">{leadData?.lead_name}</strong> ({leadData?.name})? This will permanently delete the lead record and all touchpoint logs.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      <span>Delete Lead</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
