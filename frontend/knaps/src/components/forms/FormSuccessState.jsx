import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faShieldHalved,
  faPrint,
  faEnvelope,
  faPhone,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function FormSuccessState({
  result = {},
  workflowType = "combined_onboarding",
}) {
  const isProfilerIncluded = workflowType !== "client_onboarding";

  const getProfileBadgeStyle = (profile) => {
    switch (profile) {
      case "Aggressive":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "Moderate":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Conservative":
      default:
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-10 text-center space-y-6">
        {/* Animated Checkmark Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
          <FontAwesomeIcon icon={faCircleCheck} />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Submission Completed Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Thank you for completing your information with KNAPS. Your records have been encrypted
            and securely stored in our CRM.
          </p>
        </div>

        {/* RISK PROFILE RESULT CARD (IF RISK PROFILER WAS SUBMITTED) */}
        {isProfilerIncluded && result.risk_profile && (
          <div className="bg-slate-50 border border-gray-200/90 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#032e92] flex items-center gap-1.5">
                <FontAwesomeIcon icon={faShieldHalved} />
                <span>Calculated Risk Assessment Result</span>
              </span>
              <span
                className={`text-xs font-black px-3 py-1 rounded-full border ${getProfileBadgeStyle(
                  result.risk_profile
                )}`}
              >
                {result.risk_profile} Investor
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">{result.score || 0}</span>
              <span className="text-xs font-bold text-gray-400">/ 50 Score Points</span>
            </div>

            {result.description && (
              <p className="text-xs text-gray-600 leading-relaxed bg-white p-3.5 rounded-xl border border-gray-100">
                {result.description}
              </p>
            )}
          </div>
        )}

        {/* NEXT STEPS */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 text-left space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#032e92]">
            What Happens Next?
          </h3>
          <ul className="text-xs text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-[#032e92] mt-0.5 text-xs" />
              <span>
                Our compliance team will verify your KYC and bank details against official depository
                records.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-[#032e92] mt-0.5 text-xs" />
              <span>
                Your dedicated KNAPS Wealth Advisor will contact you to review your tailored investment
                strategy.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FontAwesomeIcon icon={faCheck} className="text-[#032e92] mt-0.5 text-xs" />
              <span>
                You will receive a confirmation email with your investor summary and next milestones.
              </span>
            </li>
          </ul>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <FontAwesomeIcon icon={faPrint} />
            <span>Print or Save as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
