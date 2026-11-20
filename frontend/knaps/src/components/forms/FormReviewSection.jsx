import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPenToSquare,
  faUser,
  faUsers,
  faBuildingColumns,
  faShieldHalved,
  faTriangleExclamation,
  faLock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export default function FormReviewSection({
  personalData = {},
  riskAnswers = {},
  riskQuestions = [],
  nomineeData = {},
  bankData = {},
  workflowType = "combined_onboarding",
  onJumpToStep,
  onSubmit,
  submitting = false,
  missingErrors = [],
}) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [consentError, setConsentError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setConsentError("Please review and accept the declaration to submit.");
      return;
    }
    setConsentError("");
    onSubmit && onSubmit();
  };

  const hasPersonal = workflowType !== "risk_profiler";
  const hasRisk = workflowType !== "client_onboarding";
  const hasNominee = workflowType !== "risk_profiler";
  const hasBank = workflowType !== "risk_profiler";

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-[#032e92] text-sm" />
          <span>Section D: Review Your Information & Submit</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Please verify all details carefully before final submission. Click "Edit" on any section
          if you need to make changes.
        </p>
      </div>

      {missingErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-900 space-y-1">
          <div className="flex items-center gap-2 font-bold text-red-800">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>Please complete the following mandatory fields before submitting:</span>
          </div>
          <ul className="list-disc list-inside text-[11px] space-y-0.5 pt-1 text-red-700">
            {missingErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 1. PERSONAL DETAILS SUMMARY */}
      {hasPersonal && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
              <FontAwesomeIcon icon={faUser} className="text-[#032e92]" />
              <span>Personal & KYC Details</span>
            </h3>
            {onJumpToStep && (
              <button
                type="button"
                onClick={() => onJumpToStep("personal")}
                className="text-xs font-bold text-[#032e92] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Full Name</span>
              <span className="font-bold text-gray-900">{personalData.full_name || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">PAN</span>
              <span className="font-bold text-gray-900 tracking-wider uppercase">
                {personalData.pan || "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Date of Birth</span>
              <span className="font-bold text-gray-900">{personalData.dob || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Mobile Number</span>
              <span className="font-bold text-gray-900">{personalData.mobile_no || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Email Address</span>
              <span className="font-bold text-gray-900 truncate block">
                {personalData.email || "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Gender</span>
              <span className="font-bold text-gray-900">{personalData.gender || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Place of Birth</span>
              <span className="font-bold text-gray-900">
                {personalData.place_of_birth || personalData.city || "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Occupation</span>
              <span className="font-bold text-gray-900">{personalData.occupation || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Income Slab</span>
              <span className="font-bold text-gray-900">{personalData.income_slab || "—"}</span>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Address</span>
              <span className="font-bold text-gray-900">
                {personalData.address || personalData.address_line1 || "—"}
                {personalData.city ? `, ${personalData.city}` : ""}
                {personalData.state ? `, ${personalData.state}` : ""}
                {personalData.pincode ? ` - ${personalData.pincode}` : ""}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. RISK ASSESSMENT SUMMARY */}
      {hasRisk && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
              <FontAwesomeIcon icon={faShieldHalved} className="text-[#032e92]" />
              <span>Financial Risk Assessment Answers</span>
            </h3>
            {onJumpToStep && (
              <button
                type="button"
                onClick={() => onJumpToStep("risk")}
                className="text-xs font-bold text-[#032e92] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {riskQuestions.map((q) => {
              const ansText =
                typeof riskAnswers[q.id] === "string"
                  ? riskAnswers[q.id]
                  : riskAnswers[q.id]?.selectedOptionText || "Not answered";
              return (
                <div key={q.id} className="p-2.5 rounded-xl bg-slate-50 flex items-start justify-between gap-3">
                  <span className="text-gray-600 font-medium text-[11px] leading-snug">
                    Q{q.id}. {q.title}
                  </span>
                  <span className="font-bold text-gray-900 text-right text-[11px] shrink-0">
                    {ansText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. NOMINEE DETAILS SUMMARY */}
      {hasNominee && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
              <FontAwesomeIcon icon={faUsers} className="text-[#032e92]" />
              <span>Nominee Details</span>
            </h3>
            {onJumpToStep && (
              <button
                type="button"
                onClick={() => onJumpToStep("nominee")}
                className="text-xs font-bold text-[#032e92] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Nominee Name</span>
              <span className="font-bold text-gray-900">{nomineeData.nominee_name || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Relationship</span>
              <span className="font-bold text-gray-900">
                {nomineeData.nominee_relationship || "—"}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Date of Birth</span>
              <span className="font-bold text-gray-900">{nomineeData.nominee_dob || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Is Minor</span>
              <span className="font-bold text-gray-900">
                {nomineeData.is_nominee_minor ? "Yes (Minor)" : "No (Major)"}
              </span>
            </div>
            {nomineeData.is_nominee_minor && (
              <>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Guardian Name
                  </span>
                  <span className="font-bold text-gray-900">
                    {nomineeData.guardian_name || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Guardian Relation
                  </span>
                  <span className="font-bold text-gray-900">
                    {nomineeData.guardian_relationship || "—"}
                  </span>
                </div>
              </>
            )}
            <div className="col-span-2 sm:col-span-3">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">
                Nominee Address
              </span>
              <span className="font-bold text-gray-900">
                {nomineeData.nominee_address || "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. BANK DETAILS SUMMARY */}
      {hasBank && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="text-xs font-extrabold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
              <FontAwesomeIcon icon={faBuildingColumns} className="text-[#032e92]" />
              <span>Bank Details</span>
            </h3>
            {onJumpToStep && (
              <button
                type="button"
                onClick={() => onJumpToStep("bank")}
                className="text-xs font-bold text-[#032e92] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Entry Method</span>
              <span className="font-bold text-gray-900">
                {bankData.bank_entry_method === "Upload" ? "Upload Bank Proof" : "Manual Entry"}
              </span>
            </div>
            {bankData.bank_entry_method === "Upload" ? (
              <div className="col-span-2">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">
                  Uploaded Document
                </span>
                <span className="font-bold text-emerald-700">
                  {bankData.bank_proof_filename || "Bank Cheque / Passbook Uploaded"}
                </span>
              </div>
            ) : (
              <>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Bank Name</span>
                  <span className="font-bold text-gray-900">{bankData.bank_name || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">IFSC Code</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {bankData.bank_ifsc || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">
                    Account Number
                  </span>
                  <span className="font-bold text-gray-900">
                    {bankData.bank_account_no
                      ? `•••• •••• ${bankData.bank_account_no.slice(-4)}`
                      : "—"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CONSENT & DECLARATION */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              if (e.target.checked) setConsentError("");
            }}
            className="w-4 h-4 text-[#032e92] rounded mt-0.5"
          />
          <div className="text-xs text-gray-800 leading-relaxed">
            <strong className="block text-gray-950 font-bold mb-0.5">
              Investor Declaration & Electronic Consent
            </strong>
            I hereby declare that all information furnished above is complete, correct, and true to
            the best of my knowledge. I authorize KNAPS and its AMFI-registered partners to process
            my investment profile, KYC records, nomination details, and bank account in accordance
            with SEBI and AMFI regulations.
          </div>
        </label>
        {consentError && (
          <p className="text-[11px] text-red-600 font-semibold">{consentError}</p>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-2 flex items-center justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-extrabold bg-[#032e92] hover:bg-[#021d63] text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Submitting Secure Form...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faLock} className="text-xs" />
              <span>Confirm & Submit Information</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
