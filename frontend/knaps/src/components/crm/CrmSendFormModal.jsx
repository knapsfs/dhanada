import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faShieldHalved,
  faAddressCard,
  faLayerGroup,
  faLink,
  faCopy,
  faCheck,
  faPaperPlane,
  faExternalLinkAlt,
  faSpinner,
  faEnvelope,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { crmService } from "../../services/crmService";

export default function CrmSendFormModal({
  isOpen,
  onClose,
  record = {},
  referenceDoctype = "Lead", // "Lead" or "Client"
  onFormSent,
}) {
  const [selectedWorkflow, setSelectedWorkflow] = useState("combined_onboarding");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [generating, setGenerating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [customEmailMessage, setCustomEmailMessage] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  if (!isOpen) return null;

  const recipientName =
    record.lead_name ||
    record.client_name ||
    `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
    "Customer";
  const recipientEmail = record.email || "";
  const recipientPhone = record.mobile_no || "";

  const workflows = [
    {
      id: "risk_profiler",
      title: "Risk Profiler Only",
      subtitle: "5-question assessment to determine investor risk profile and score.",
      icon: faShieldHalved,
      badge: "Questionnaire Only",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "client_onboarding",
      title: "Client Onboarding Only",
      subtitle: "Personal KYC, nominee with minor/guardian logic, and bank details.",
      icon: faAddressCard,
      badge: "Onboarding Only",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "combined_onboarding",
      title: "Combined Risk Profiler + Onboarding",
      subtitle: "Single integrated journey weaving risk questions directly into personal & financial steps.",
      icon: faLayerGroup,
      badge: "Recommended",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  const handleGenerateLink = async () => {
    setGenerating(true);
    setFeedback({ type: "", message: "" });
    try {
      const res = await crmService.generateFormLink(
        referenceDoctype,
        record.name,
        selectedWorkflow,
        expiresInDays
      );
      setGeneratedResult(res);
      setFeedback({
        type: "success",
        message: "Secure token and form link generated successfully!",
      });
      if (onFormSent) {
        onFormSent(res);
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to generate form link.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedResult?.form_url) return;
    navigator.clipboard.writeText(generatedResult.form_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = async () => {
    if (!generatedResult?.token) return;
    setSendingEmail(true);
    setFeedback({ type: "", message: "" });
    try {
      await crmService.sendFormEmail(generatedResult.token, customEmailMessage);
      setFeedback({
        type: "success",
        message: `Form link successfully emailed to ${recipientEmail}!`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to dispatch email.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!generatedResult?.form_url) return "#";
    const text = encodeURIComponent(
      `Hello ${recipientName},\n\nPlease complete your ${
        selectedWorkflow === "risk_profiler"
          ? "Risk Profiler"
          : selectedWorkflow === "client_onboarding"
          ? "Client Onboarding"
          : "Client Onboarding & Risk Profiler"
      } form with KNAPS using this secure link:\n${generatedResult.form_url}\n\nRegards,\nTeam KNAPS`
    );
    const phone = recipientPhone.replace(/\D/g, "");
    return `https://api.whatsapp.com/send?phone=${phone.startsWith("91") ? phone : "91" + phone}&text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-sm font-bold">
              <FontAwesomeIcon icon={faLink} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 leading-tight">
                Send Form Workflow
              </h3>
              <p className="text-[11px] text-gray-500">
                To: <strong className="text-gray-800">{recipientName}</strong> ({referenceDoctype})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-5">
          {/* Feedback banner */}
          {feedback.message && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <FontAwesomeIcon icon={feedback.type === "success" ? faCheck : faXmark} />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Workflow Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold text-gray-800 uppercase tracking-wide block">
              1. Select Form Workflow
            </label>
            <div className="space-y-2">
              {workflows.map((wf) => {
                const isSelected = selectedWorkflow === wf.id;
                return (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => {
                      setSelectedWorkflow(wf.id);
                      setGeneratedResult(null);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? "border-[#032e92] bg-blue-50/70 ring-2 ring-blue-100/70 shadow-2xs"
                        : "border-gray-200 hover:border-gray-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-[#032e92] bg-[#032e92]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                          <FontAwesomeIcon icon={wf.icon} className="text-[#032e92] text-xs" />
                          <span>{wf.title}</span>
                        </span>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${wf.badgeColor}`}
                        >
                          {wf.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        {wf.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expiration setting */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-gray-100 text-xs">
            <span className="font-semibold text-gray-700">Link Validity Duration:</span>
            <select
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(Number(e.target.value))}
              disabled={Boolean(generatedResult)}
              className="text-xs font-bold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-300"
            >
              <option value={3}>3 Days</option>
              <option value={7}>7 Days (Standard)</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>

          {/* Generate Button or Result Display */}
          {!generatedResult ? (
            <button
              type="button"
              onClick={handleGenerateLink}
              disabled={generating}
              className="w-full py-3 rounded-xl text-xs font-extrabold bg-[#032e92] hover:bg-[#021d63] text-white shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {generating ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Generating Secure Link...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLink} />
                  <span>Generate Customer Form Link</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              {/* Form URL Box */}
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
                  Secure Customer Link (Expiring Token)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedResult.form_url}
                    className="flex-1 text-xs font-mono px-3 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      copied
                        ? "bg-emerald-600 text-white"
                        : "bg-[#032e92] text-white hover:bg-[#021d63]"
                    }`}
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Share Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl text-xs font-bold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-2 border border-[#25D366]/30 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                  <span>Share via WhatsApp</span>
                </a>

                <a
                  href={generatedResult.form_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 border border-gray-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  <span>Open Form Preview</span>
                </a>
              </div>

              {/* Email Send Section */}
              {recipientEmail && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faEnvelope} className="text-[#032e92]" />
                      <span>Email to: {recipientEmail}</span>
                    </span>
                  </div>

                  <input
                    type="text"
                    value={customEmailMessage}
                    onChange={(e) => setCustomEmailMessage(e.target.value)}
                    placeholder="Optional personal message in email..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 bg-white"
                  />

                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                    className="w-full py-2 rounded-lg text-xs font-bold bg-white hover:bg-blue-50 text-[#032e92] border border-[#032e92]/30 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {sendingEmail ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        <span>Sending Email...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        <span>Send Link via Email</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
