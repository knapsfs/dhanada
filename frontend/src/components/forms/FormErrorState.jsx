import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faEnvelope,
  faPhone,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";

export default function FormErrorState({
  title = "Form Link Expired or Invalid",
  message = "This secure form link is either invalid, has expired, or has already been used.",
  onRetry,
}) {
  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
        <FontAwesomeIcon icon={faTriangleExclamation} />
      </div>

      <div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{message}</p>
      </div>

      <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 text-left text-xs space-y-2">
        <span className="font-bold text-gray-800 block text-[11px] uppercase tracking-wide">
          Need Assistance?
        </span>
        <p className="text-gray-600 leading-relaxed text-[11px]">
          Please contact your dedicated KNAPS Advisor or customer desk to request a fresh, secure
          form link:
        </p>
        <div className="pt-1 flex flex-col gap-1 text-gray-800 font-semibold text-[11px]">
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-[#032e92]" />
            <span>support@knaps.app</span>
          </span>
          <span className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} className="text-[#032e92]" />
            <span>+91 87997 83956</span>
          </span>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowRotateRight} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
