import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faPhone, faEnvelope, faPaperPlane, faUserCheck,
  faCommentDots, faListCheck, faSpinner, faShieldHalved,
  faCheckCircle, faCircleExclamation, faTriangleExclamation,
  faClock, faFloppyDisk, faUser, faCopy, faCheck,
  faLocationDot, faCoins, faFileLines, faPlus, faXmark,
  faPenToSquare, faBuildingColumns, faIdCard, faUserShield,
  faArrowUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons";
import CrmSelect from "./CrmSelect";
import CrmSendFormModal from "./CrmSendFormModal";
import { crmService } from "../../services/crmService";
import { getContactStatus, formatContactDate } from "../../utils/crmContactUtils";

const KYC_COLORS = {
  Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_COLORS = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Dormant: "bg-amber-50 text-amber-700 border-amber-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-300",
};

export default function CrmClientDetailView({
  clientName,
  onBack,
  onClientUpdated,
  onLogInteraction,
  onNewTask,
  refreshKey = 0,
}) {
  const [clientData, setClientData] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("onboarding"); // onboarding, remarks, tasks
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [sendFormModalOpen, setSendFormModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [remarkText, setRemarkText] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  useEffect(() => {
    if (!clientName) return;
    loadDetails();
  }, [clientName, refreshKey]);

  const loadDetails = async (preserveFeedback = false) => {
    setLoading(true);
    if (!preserveFeedback) {
      setFeedback({ type: "", message: "" });
    }
    try {
      const res = await crmService.getClientDetails(clientName);
      setClientData(res.client || {});
      setSubmissionData(res.submission || null);
      setInteractions(res.interactions || []);
      setTasks(res.tasks || []);
      initFormData(res.client || {}, res.submission || {});
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to load client details." });
    } finally {
      setLoading(false);
    }
  };

  const initFormData = (client, sub) => {
    setEditFormData({
      // Personal & KYC
      full_name: sub.full_name || client.client_name || "",
      first_name: sub.first_name || client.first_name || "",
      last_name: sub.last_name || client.last_name || "",
      salutation: sub.salutation || client.salutation || "Mr",
      client_type: sub.client_type || client.client_type || "Individual",
      pan: sub.pan || client.pan || "",
      kyc_status: sub.kyc_status || client.kyc_status || "Pending",
      dob: sub.dob || client.dob || "",
      gender: sub.gender || client.gender || "Male",
      income_slab: sub.income_slab || "Below 5 Lakhs",
      place_of_birth: sub.place_of_birth || "",
      occupation: sub.occupation || "Salaried",

      // Contact
      email: sub.email || client.email || "",
      mobile_no: sub.mobile_no || client.mobile_no || "",
      alternate_mobile_no: sub.alternate_mobile_no || client.alternate_mobile_no || "",

      // Address
      address_line1: sub.address_line1 || client.address_line1 || "",
      address_line2: sub.address_line2 || client.address_line2 || "",
      city: sub.city || client.city || "",
      state: sub.state || client.state || "",
      pincode: sub.pincode || client.pincode || "",
      country: sub.country || client.country || "India",

      // Nominee
      nominee_name: sub.nominee_name || "",
      nominee_relationship: sub.nominee_relationship || "Mother",
      nominee_dob: sub.nominee_dob || "",
      is_nominee_minor: Boolean(sub.is_nominee_minor),
      statement_name: sub.statement_name || "",
      nominee_id_type: sub.nominee_id_type || "PAN",
      nominee_id_number: sub.nominee_id_number || "",
      nominee_mobile: sub.nominee_mobile || "",
      nominee_email: sub.nominee_email || "",
      nominee_address: sub.nominee_address || "",

      // Guardian
      guardian_name: sub.guardian_name || "",
      guardian_relationship: sub.guardian_relationship || "",
      guardian_pan: sub.guardian_pan || "",

      // Bank
      bank_entry_method: sub.bank_entry_method || "Manual",
      bank_name: sub.bank_name || "",
      bank_account_no: sub.bank_account_no || "",
      bank_ifsc: sub.bank_ifsc || "",
      bank_proof_file: sub.bank_proof_file || "",

      // Investment & Risk
      investor_category: sub.investor_category || client.investor_category || "Retail",
      risk_profile: client.risk_profile || "Moderate",
      investment_horizon: sub.investment_horizon || client.investment_horizon || "3-5 years",
      investment_experience: sub.investment_experience || client.investment_experience || "Moderate",
      investment_capacity: sub.investment_capacity || client.investment_capacity || "",
      investment_objectives: sub.investment_objectives || client.investment_objectives || "Capital Growth",
    });
  };

  const handleStartEdit = () => {
    initFormData(clientData || {}, submissionData || {});
    setIsEditing(true);
    setFeedback({ type: "", message: "" });
  };

  const handleCancelEdit = () => {
    initFormData(clientData || {}, submissionData || {});
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDetails = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setFeedback({ type: "", message: "" });

    try {
      const res = await crmService.updateClientOnboardingDetails(clientName, editFormData);
      setClientData(res.client);
      setSubmissionData(res.submission);
      setInteractions(res.interactions || []);
      setTasks(res.tasks || []);
      setIsEditing(false);
      setFeedback({
        type: "success",
        message: "Client onboarding & profile details saved successfully!",
      });
      if (onClientUpdated) {
        onClientUpdated(res.client);
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to save client onboarding details.",
      });
    } finally {
      setSaving(false);
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
      const res = await crmService.saveContactRemark("Client", clientData.name, remarkText.trim());
      setFeedback({ type: "success", message: "Contact remark saved successfully!" });
      setRemarkText("");
      const updatedClient = {
        ...clientData,
        latest_remark: res.latest_remark,
        last_contacted_by: res.last_contacted_by,
        last_contacted_on: res.last_contacted_on,
        days_since_contact: res.days_since_contact,
        is_contact_overdue: res.is_contact_overdue,
      };
      setClientData(updatedClient);
      if (onClientUpdated) onClientUpdated(updatedClient);
      await loadDetails(true);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Failed to save remark." });
    } finally {
      setSavingRemark(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  if (loading && !clientData) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/90 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[400px]">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-[#032e92] mb-3" />
        <p className="text-xs font-semibold text-gray-500">Loading Client Onboarding Details...</p>
      </div>
    );
  }

  const primaryPhone = submissionData?.mobile_no || clientData?.mobile_no || "";
  const cleanPhone = primaryPhone.replace(/\D/g, "");
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const primaryEmail = submissionData?.email || clientData?.email || "";
  const displayName = submissionData?.full_name || clientData?.client_name || "Client Details";
  const panValue = submissionData?.pan || clientData?.pan || "";
  const kycStatus = submissionData?.kyc_status || clientData?.kyc_status || "Pending";
  const clientStatus = clientData?.client_status || "Active";
  const contactInfo = getContactStatus(
    clientData?.last_contacted_on,
    clientData?.days_since_contact,
    clientData?.is_contact_overdue
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#032e92] hover:border-[#032e92] text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Clients</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Communication Actions */}
          {cleanPhone && (
            <>
              <a
                href={`tel:${cleanPhone}`}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#032e92] hover:border-[#032e92] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Call Client"
              >
                <FontAwesomeIcon icon={faPhone} className="text-xs text-blue-600" />
                <span className="hidden md:inline">Call</span>
              </a>
              <a
                href={`https://wa.me/${waPhone}?text=Hello%20${encodeURIComponent(displayName)},%20this%20is%20KNAPS%20Financial%20Advisory.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                title="WhatsApp Client"
              >
                <span className="font-bold">WhatsApp</span>
              </a>
            </>
          )}

          {primaryEmail && (
            <a
              href={`mailto:${primaryEmail}`}
              className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#032e92] hover:border-[#032e92] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Email Client"
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-xs text-amber-600" />
              <span className="hidden md:inline">Email</span>
            </a>
          )}

          {/* Send Form Workflows */}
          <button
            type="button"
            onClick={() => setSendFormModalOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-blue-200 text-[#032e92] hover:bg-blue-50 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            title="Send Form Workflows (Risk Profiler, Onboarding, or Combined)"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-[#032e92] text-xs" />
            <span className="hidden sm:inline">Send Form</span>
          </button>

          {/* Quick Task & Interaction */}
          <button
            type="button"
            onClick={() => onLogInteraction && onLogInteraction({ ...clientData, client_name: displayName })}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            title="Log Interaction"
          >
            <FontAwesomeIcon icon={faCommentDots} className="text-[#032e92] text-xs" />
            <span className="hidden sm:inline">Log Touchpoint</span>
          </button>

          <button
            type="button"
            onClick={() => onNewTask && onNewTask({ ...clientData, client_name: displayName })}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            title="Create Task"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[#032e92] text-xs" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* EDIT BUTTON / SAVE & CANCEL BUTTONS */}
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDetails}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStartEdit}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
              <span>Edit Details</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications / Feedback Bar */}
      {feedback.message && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-2xs ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : feedback.type === "info"
              ? "bg-blue-50 text-blue-800 border border-blue-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={feedback.type === "success" ? faCheckCircle : faCircleExclamation}
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

      {/* Hero Client Banner */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Identity & Basic Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[clientStatus] || "bg-emerald-50 text-emerald-700"}`}>
                {clientStatus}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${KYC_COLORS[kycStatus] || "bg-amber-50 text-amber-700"}`}>
                KYC: {kycStatus}
              </span>
              <span className="text-xs font-semibold text-[#032e92] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                {submissionData?.investor_category || clientData?.investor_category || "Retail"}
              </span>
              {submissionData?.workflow_type && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  Workflow: {submissionData.workflow_type.replace(/_/g, " ")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {displayName}
              </h1>
              <span className="font-mono text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-600 font-bold">
                {clientName}
              </span>
              {submissionData?.name && (
                <span className="font-mono text-xs px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium" title="Linked Onboarding Submission">
                  {submissionData.name}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 font-medium flex items-center gap-4 flex-wrap">
              <span>Client since {clientData?.onboarding_date ? formatContactDate(clientData.onboarding_date) : (clientData?.creation ? new Date(clientData.creation).toLocaleDateString("en-IN") : "—")}</span>
              <span>•</span>
              <span>Linked Lead: <strong className="text-gray-700">{clientData?.lead || submissionData?.lead || "None"}</strong></span>
              <span>•</span>
              <span>Location: <strong className="text-gray-700">{submissionData?.city || clientData?.city || "Not Specified"}, {submissionData?.state || clientData?.state || "India"}</strong></span>
            </p>
          </div>

          {/* Vital Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            {/* Contact Health */}
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
                {clientData?.risk_profile || "Moderate"}
              </p>
            </div>

            {/* Submission Status */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Onboarding Form</span>
              <p className="text-xs font-bold text-[#032e92] mt-1 flex items-center gap-1 truncate">
                <FontAwesomeIcon icon={submissionData ? faCheckCircle : faClock} className={submissionData ? "text-emerald-600" : "text-amber-500"} />
                <span>{submissionData ? submissionData.status || "Submitted" : "No Submission"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("onboarding")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "onboarding"
              ? "border-[#032e92] text-[#032e92]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faIdCard} />
          <span>Client Onboarding Submission Data</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("remarks")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "remarks"
              ? "border-[#032e92] text-[#032e92]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faCommentDots} />
          <span>Touchpoints & Remarks</span>
          <span className="w-5 h-5 rounded-full bg-blue-50 text-[#032e92] text-[10px] flex items-center justify-center font-bold">
            {interactions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tasks")}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "tasks"
              ? "border-[#032e92] text-[#032e92]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <FontAwesomeIcon icon={faListCheck} />
          <span>Client Tasks</span>
          <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 text-[10px] flex items-center justify-center font-bold">
            {tasks.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ONBOARDING SUBMISSION DATA & PROFILE */}
      {activeTab === "onboarding" && (
        <form onSubmit={handleSaveDetails} className="space-y-6">
          {/* Status banner when editing */}
          {isEditing && (
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faPenToSquare} className="text-[#032e92] text-sm" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Editing Client Onboarding Submission</h4>
                  <p className="text-[11px] text-gray-600">Modify any personal, contact, nominee, or bank details below. Changes sync automatically to both the submission record and client profile.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" /> : <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />}
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 1: Personal & KYC Information */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Personal & KYC Information</h3>
                  <p className="text-[11px] text-gray-400">Identity details recorded during onboarding</p>
                </div>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="text-xs font-bold text-[#032e92] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="text-[11px]" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.full_name}
                    onChange={(e) => handleFieldChange("full_name", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-semibold text-gray-900 text-xs"
                    placeholder="Enter full name"
                  />
                ) : (
                  <p className="font-bold text-gray-900 py-1">{displayName}</p>
                )}
              </div>

              {/* PAN */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">PAN Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.pan}
                    onChange={(e) => handleFieldChange("pan", e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-mono font-bold text-gray-900 text-xs uppercase"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                ) : (
                  <div className="flex items-center gap-2 py-1">
                    <span className="font-mono font-bold text-gray-900 tracking-wider">{panValue || "—"}</span>
                    {panValue && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(panValue, "pan")}
                        className="text-gray-400 hover:text-[#032e92] cursor-pointer"
                        title="Copy PAN"
                      >
                        <FontAwesomeIcon icon={copiedField === "pan" ? faCheck : faCopy} className="text-xs" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* KYC Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">KYC Status</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.kyc_status}
                    onChange={(val) => handleFieldChange("kyc_status", val)}
                    options={["Pending", "In Progress", "Verified", "Rejected"]}
                    size="sm"
                  />
                ) : (
                  <div className="py-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${KYC_COLORS[kycStatus] || "bg-amber-50 text-amber-700"}`}>
                      {kycStatus}
                    </span>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editFormData.dob}
                    onChange={(e) => handleFieldChange("dob", e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">
                    {submissionData?.dob || clientData?.dob ? new Date(submissionData?.dob || clientData?.dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Gender</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.gender}
                    onChange={(val) => handleFieldChange("gender", val)}
                    options={["Male", "Female", "Other"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.gender || clientData?.gender || "—"}</p>
                )}
              </div>

              {/* Client Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Client Type</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.client_type}
                    onChange={(val) => handleFieldChange("client_type", val)}
                    options={["Individual", "Corporate", "NRI", "HUF", "Partnership"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.client_type || clientData?.client_type || "Individual"}</p>
                )}
              </div>

              {/* Income Slab */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Income Slab</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.income_slab}
                    onChange={(val) => handleFieldChange("income_slab", val)}
                    options={["Below 5 Lakhs", "5-10 Lakhs", "10-25 Lakhs", "25 Lakhs - 1 Crore", "Above 1 Crore"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.income_slab || "—"}</p>
                )}
              </div>

              {/* Occupation */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Occupation</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.occupation}
                    onChange={(val) => handleFieldChange("occupation", val)}
                    options={["Salaried", "Self-Employed", "Business", "Professional", "Retired", "Student", "Homemaker", "Other"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.occupation || "—"}</p>
                )}
              </div>

              {/* Place of Birth */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Place of Birth</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.place_of_birth}
                    onChange={(e) => handleFieldChange("place_of_birth", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="Enter city / birth place"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.place_of_birth || "—"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Contact Details</h3>
                  <p className="text-[11px] text-gray-400">Communication coordinates verified during onboarding</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* Primary Mobile */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Primary Mobile</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.mobile_no}
                    onChange={(e) => handleFieldChange("mobile_no", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-semibold text-gray-900 text-xs"
                    placeholder="e.g. 9876543210"
                  />
                ) : (
                  <div className="flex items-center gap-2 py-1">
                    <span className="font-bold text-gray-900">{primaryPhone || "—"}</span>
                    {primaryPhone && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(primaryPhone, "phone")}
                        className="text-gray-400 hover:text-[#032e92] cursor-pointer"
                        title="Copy Phone"
                      >
                        <FontAwesomeIcon icon={copiedField === "phone" ? faCheck : faCopy} className="text-xs" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Alternate Mobile */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Alternate Mobile</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.alternate_mobile_no}
                    onChange={(e) => handleFieldChange("alternate_mobile_no", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="Alternate contact number"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.alternate_mobile_no || clientData?.alternate_mobile_no || "—"}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-semibold text-gray-900 text-xs"
                    placeholder="client@example.com"
                  />
                ) : (
                  <div className="flex items-center gap-2 py-1">
                    <span className="font-semibold text-gray-900">{primaryEmail || "—"}</span>
                    {primaryEmail && (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(primaryEmail, "email")}
                        className="text-gray-400 hover:text-[#032e92] cursor-pointer"
                        title="Copy Email"
                      >
                        <FontAwesomeIcon icon={copiedField === "email" ? faCheck : faCopy} className="text-xs" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Address Information */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Residential / Permanent Address</h3>
                  <p className="text-[11px] text-gray-400">Postal and residential address registered during onboarding</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* Address Line 1 */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Address Line 1</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.address_line1}
                    onChange={(e) => handleFieldChange("address_line1", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="House / Flat / Street"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.address_line1 || clientData?.address_line1 || "—"}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Address Line 2</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.address_line2}
                    onChange={(e) => handleFieldChange("address_line2", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="Locality / Landmark"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.address_line2 || clientData?.address_line2 || "—"}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="City"
                  />
                ) : (
                  <p className="font-bold text-gray-900 py-1">{submissionData?.city || clientData?.city || "—"}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.state}
                    onChange={(e) => handleFieldChange("state", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="State"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.state || clientData?.state || "—"}</p>
                )}
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pincode</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.pincode}
                    onChange={(e) => handleFieldChange("pincode", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-mono font-semibold text-gray-900 text-xs"
                    placeholder="Pincode"
                    maxLength={6}
                  />
                ) : (
                  <p className="font-mono font-medium text-gray-900 py-1">{submissionData?.pincode || clientData?.pincode || "—"}</p>
                )}
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.country}
                    onChange={(e) => handleFieldChange("country", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="Country"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.country || clientData?.country || "India"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Nominee & Guardian Details */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faUserShield} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Nominee & Guardian Details</h3>
                  <p className="text-[11px] text-gray-400">Beneficiary nomination submitted during client onboarding</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {/* Nominee Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nominee Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.nominee_name}
                    onChange={(e) => handleFieldChange("nominee_name", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-semibold text-gray-900 text-xs"
                    placeholder="Nominee full name"
                  />
                ) : (
                  <p className="font-bold text-gray-900 py-1">{submissionData?.nominee_name || "—"}</p>
                )}
              </div>

              {/* Relationship */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Relationship</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.nominee_relationship}
                    onChange={(val) => handleFieldChange("nominee_relationship", val)}
                    options={["Mother", "Father", "Spouse", "Child", "Brother", "Sister", "Other"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.nominee_relationship || "—"}</p>
                )}
              </div>

              {/* Nominee DOB */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nominee Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editFormData.nominee_dob}
                    onChange={(e) => handleFieldChange("nominee_dob", e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">
                    {submissionData?.nominee_dob ? new Date(submissionData.nominee_dob).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </p>
                )}
              </div>

              {/* Is Minor Toggle */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Is Nominee Minor?</label>
                {isEditing ? (
                  <label className="inline-flex items-center gap-2 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.is_nominee_minor}
                      onChange={(e) => handleFieldChange("is_nominee_minor", e.target.checked)}
                      className="w-4 h-4 rounded text-[#032e92] border-gray-300 focus:ring-[#032e92]"
                    />
                    <span className="font-semibold text-gray-700">Yes, Nominee is Minor</span>
                  </label>
                ) : (
                  <div className="py-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${submissionData?.is_nominee_minor ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-gray-100 text-gray-600"}`}>
                      {submissionData?.is_nominee_minor ? "Yes (Minor)" : "No (Major)"}
                    </span>
                  </div>
                )}
              </div>

              {/* Statement / Allocation Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Statement / Allocation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.statement_name}
                    onChange={(e) => handleFieldChange("statement_name", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="Statement name or %"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.statement_name || "—"}</p>
                )}
              </div>

              {/* ID Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nominee ID Type</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.nominee_id_type}
                    onChange={(val) => handleFieldChange("nominee_id_type", val)}
                    options={["PAN", "Aadhaar", "Passport", "Voter ID", "Other"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.nominee_id_type || "—"}</p>
                )}
              </div>

              {/* Nominee ID Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nominee ID Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.nominee_id_number}
                    onChange={(e) => handleFieldChange("nominee_id_number", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-mono text-gray-900 text-xs"
                    placeholder="ID number"
                  />
                ) : (
                  <p className="font-mono font-medium text-gray-900 py-1">{submissionData?.nominee_id_number || "—"}</p>
                )}
              </div>

              {/* Nominee Contact Mobile */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nominee Mobile</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.nominee_mobile}
                    onChange={(e) => handleFieldChange("nominee_mobile", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="Mobile number"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.nominee_mobile || "—"}</p>
                )}
              </div>

              {/* Nominee Address */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nominee Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.nominee_address}
                    onChange={(e) => handleFieldChange("nominee_address", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] text-gray-900 text-xs"
                    placeholder="Nominee address"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.nominee_address || "—"}</p>
                )}
              </div>
            </div>

            {/* Guardian Information (Conditional or always editable) */}
            {(isEditing || editFormData.is_nominee_minor || submissionData?.guardian_name) && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                    Guardian Details (Required if Nominee is Minor)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Guardian Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.guardian_name}
                        onChange={(e) => handleFieldChange("guardian_name", e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] text-gray-900 text-xs"
                        placeholder="Guardian full name"
                      />
                    ) : (
                      <p className="font-bold text-gray-900 py-1">{submissionData?.guardian_name || "—"}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Guardian Relationship</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.guardian_relationship}
                        onChange={(e) => handleFieldChange("guardian_relationship", e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] text-gray-900 text-xs"
                        placeholder="e.g. Father, Court Guardian"
                      />
                    ) : (
                      <p className="font-medium text-gray-900 py-1">{submissionData?.guardian_relationship || "—"}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Guardian PAN</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editFormData.guardian_pan}
                        onChange={(e) => handleFieldChange("guardian_pan", e.target.value.toUpperCase())}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] font-mono text-gray-900 text-xs uppercase"
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                    ) : (
                      <p className="font-mono font-medium text-gray-900 py-1">{submissionData?.guardian_pan || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Bank Account Details */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faBuildingColumns} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Bank Account Information</h3>
                  <p className="text-[11px] text-gray-400">Bank mandate provided for payouts & verification</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Bank Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bank Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.bank_name}
                    onChange={(e) => handleFieldChange("bank_name", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-semibold text-gray-900 text-xs"
                    placeholder="e.g. HDFC Bank Ltd"
                  />
                ) : (
                  <p className="font-bold text-gray-900 py-1">{submissionData?.bank_name || "—"}</p>
                )}
              </div>

              {/* Bank Account Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Account Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.bank_account_no}
                    onChange={(e) => handleFieldChange("bank_account_no", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-mono font-bold text-gray-900 text-xs"
                    placeholder="Account Number"
                  />
                ) : (
                  <p className="font-mono font-bold text-gray-900 py-1">{submissionData?.bank_account_no || "—"}</p>
                )}
              </div>

              {/* IFSC Code */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">IFSC Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.bank_ifsc}
                    onChange={(e) => handleFieldChange("bank_ifsc", e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] font-mono font-bold text-gray-900 text-xs uppercase"
                    placeholder="HDFC0001234"
                  />
                ) : (
                  <p className="font-mono font-bold text-gray-900 py-1">{submissionData?.bank_ifsc || "—"}</p>
                )}
              </div>

              {/* Entry Method */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Verification Method</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.bank_entry_method}
                    onChange={(val) => handleFieldChange("bank_entry_method", val)}
                    options={["Manual", "Penny Drop", "Cheque Upload", "Bank Statement"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.bank_entry_method || "Manual"}</p>
                )}
              </div>

              {/* Bank Proof File */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bank Proof Attachment</label>
                {submissionData?.bank_proof_file ? (
                  <div className="py-1 flex items-center gap-2">
                    <a
                      href={submissionData.bank_proof_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#032e92] hover:bg-blue-100 font-semibold transition-colors"
                    >
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                      <span>View Uploaded Bank Proof</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-400 italic py-1">No proof file attached</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 6: Investment & Risk Preferences */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faCoins} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Investment & Risk Preferences</h3>
                  <p className="text-[11px] text-gray-400">Risk profiling and portfolio preferences</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* Risk Profile */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Risk Profile</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.risk_profile}
                    onChange={(val) => handleFieldChange("risk_profile", val)}
                    options={["Conservative", "Moderate", "Aggressive", "Very Aggressive"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-bold text-gray-900 py-1">{clientData?.risk_profile || "Moderate"}</p>
                )}
              </div>

              {/* Investor Category */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Investor Category</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.investor_category}
                    onChange={(val) => handleFieldChange("investor_category", val)}
                    options={["Retail", "HNI", "Corporate", "NRI"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-semibold text-gray-900 py-1">{submissionData?.investor_category || clientData?.investor_category || "Retail"}</p>
                )}
              </div>

              {/* Investment Horizon */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Investment Horizon</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.investment_horizon}
                    onChange={(val) => handleFieldChange("investment_horizon", val)}
                    options={["< 1 year", "1-3 years", "3-5 years", "> 5 years"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.investment_horizon || clientData?.investment_horizon || "3-5 years"}</p>
                )}
              </div>

              {/* Investment Experience */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Investment Experience</label>
                {isEditing ? (
                  <CrmSelect
                    value={editFormData.investment_experience}
                    onChange={(val) => handleFieldChange("investment_experience", val)}
                    options={["Beginner", "Moderate", "Experienced"]}
                    size="sm"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.investment_experience || clientData?.investment_experience || "Moderate"}</p>
                )}
              </div>

              {/* Investment Capacity */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Investment Capacity</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.investment_capacity}
                    onChange={(e) => handleFieldChange("investment_capacity", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] text-gray-900 text-xs"
                    placeholder="e.g. 5-10 Lakhs"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.investment_capacity || clientData?.investment_capacity || "—"}</p>
                )}
              </div>

              {/* Objectives */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Investment Objectives</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFormData.investment_objectives}
                    onChange={(e) => handleFieldChange("investment_objectives", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-[#032e92] text-gray-900 text-xs"
                    placeholder="e.g. Capital Growth"
                  />
                ) : (
                  <p className="font-medium text-gray-900 py-1">{submissionData?.investment_objectives || clientData?.investment_objectives || "Capital Growth"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 7: Submission Metadata & Audit */}
          {submissionData && (
            <div className="bg-slate-50 rounded-3xl border border-gray-200/70 p-5 sm:p-6 text-xs text-gray-500">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faFileLines} className="text-gray-400" />
                <span>Onboarding Submission System Audit</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Submission Record</span>
                  <span className="font-mono font-bold text-gray-800">{submissionData.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Submitted On</span>
                  <span className="font-medium text-gray-800">
                    {submissionData.submitted_on ? new Date(submissionData.submitted_on).toLocaleString("en-IN") : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Client Link</span>
                  <span className="font-mono font-medium text-gray-800">{clientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Submission IP</span>
                  <span className="font-mono text-gray-600">{submissionData.ip_address || "127.0.0.1"}</span>
                </div>
              </div>
            </div>
          )}
        </form>
      )}

      {/* TAB 2: TOUCHPOINTS & REMARKS */}
      {activeTab === "remarks" && (
        <div className="space-y-6">
          {/* Contact Health & Record Remark Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faCommentDots} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Contact Health & Latest Remark</h3>
                  <p className="text-[11px] text-gray-400">Track client touchpoints and maintain advisor compliance</p>
                </div>
              </div>

              {contactInfo.isOverdue ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
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

            {/* Current Latest Remark Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-gray-200/80 text-xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Current Latest Remark
              </span>
              {clientData?.latest_remark ? (
                <div>
                  <p className="text-gray-900 font-medium leading-relaxed whitespace-pre-wrap">
                    "{clientData.latest_remark}"
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-gray-200/80 flex items-center justify-between gap-3 text-[11px] text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 text-[10px]" />
                      <span>Contacted by: <strong className="text-gray-700">{clientData.last_contacted_by || "Unknown"}</strong></span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faClock} className="text-gray-400 text-[10px]" />
                      <span>{formatContactDate(clientData.last_contacted_on)}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 italic">No contact remark recorded yet for this client.</p>
              )}
            </div>

            {/* Record New Remark Form */}
            <form onSubmit={handleSaveRemark} className="space-y-3 pt-2">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                Record New Contact Remark
              </label>
              <textarea
                rows={3}
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                placeholder="Enter client portfolio review notes, periodic review call, or discussion summary..."
                className="w-full text-xs p-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="submit"
                  disabled={savingRemark || !remarkText.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
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

          {/* Interactions Timeline */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faCommentDots} className="text-[#032e92]" />
                <span>Interactions Timeline ({interactions.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => onLogInteraction && onLogInteraction({ ...clientData, client_name: displayName })}
                className="text-xs font-bold text-[#032e92] hover:underline cursor-pointer flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                <span>Log New Interaction</span>
              </button>
            </div>

            {interactions.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-6 text-center">No interactions logged yet for this client.</p>
            ) : (
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {interactions.map((int) => (
                  <div key={int.name} className="relative group">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#032e92] ring-4 ring-white" />
                    <div className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-2xl border border-gray-200/70 text-xs transition-colors space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold text-gray-900 text-sm">{int.summary || "Client Touchpoint"}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                            {int.interaction_type || "Note"}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(int.interaction_date).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                      {int.details && (
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{int.details}</p>
                      )}
                      <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-100 flex items-center justify-between">
                        <span>Logged by: {int.logged_by || "Advisor"}</span>
                        {int.outcome && <span>Outcome: <strong className="text-gray-600">{int.outcome}</strong></span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT TASKS */}
      {activeTab === "tasks" && (
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faListCheck} className="text-[#032e92]" />
              <span>Client Tasks & Follow-ups ({tasks.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => onNewTask && onNewTask({ ...clientData, client_name: displayName })}
              className="text-xs font-bold text-[#032e92] hover:underline cursor-pointer flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              <span>Create Task</span>
            </button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-xs text-gray-400 italic py-8 text-center">No open tasks for this client.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((t) => (
                <div key={t.name} className="p-4 bg-slate-50/80 rounded-2xl border border-gray-200/80 text-xs space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-gray-900 text-sm">{t.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.priority === "High" ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  {t.description && <p className="text-gray-600">{t.description}</p>}
                  <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1">
                    <span>Due: <strong>{t.due_date || "—"}</strong> {t.due_time ? `at ${t.due_time}` : ""}</span>
                    <span>Status: <strong className="text-gray-700">{t.status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Send Form Modal */}
      <CrmSendFormModal
        isOpen={sendFormModalOpen}
        onClose={() => setSendFormModalOpen(false)}
        record={{ ...clientData, client_name: displayName }}
        referenceDoctype="Client"
        onFormSent={() => {
          setFeedback({
            type: "success",
            message: `Form workflow link generated for ${displayName}`,
          });
        }}
      />
    </div>
  );
}
