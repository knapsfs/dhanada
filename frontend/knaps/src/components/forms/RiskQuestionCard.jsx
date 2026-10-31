import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function RiskQuestionCard({
  question,
  selectedOptionText,
  onSelect,
  badge = "Risk Assessment Question",
  note,
  readOnly = false,
  error,
}) {
  if (!question) return null;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all ${
        error
          ? "border-red-300 ring-2 ring-red-100 shadow-xs"
          : "border-gray-200/90 shadow-2xs hover:border-[#032e92]/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#032e92] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100 flex items-center gap-1.5">
          <FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" />
          <span>{badge} (Q{question.id})</span>
        </span>
        {note && (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            {note}
          </span>
        )}
      </div>

      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-4">
        {question.title} <span className="text-red-500">*</span>
      </h3>

      <div className="space-y-2.5">
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionText === option.text;
          return (
            <button
              key={idx}
              type="button"
              disabled={readOnly}
              onClick={() => onSelect && onSelect(option.text, option.score)}
              className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                readOnly
                  ? isSelected
                    ? "border-[#032e92] bg-blue-50/50 cursor-default"
                    : "border-gray-100 opacity-60 cursor-default"
                  : isSelected
                  ? "border-[#032e92] bg-blue-50/70 ring-2 ring-blue-100/70 shadow-2xs cursor-pointer"
                  : "border-gray-200 hover:border-gray-300 hover:bg-slate-50/70 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? "border-[#032e92] bg-[#032e92]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={`text-xs font-semibold leading-relaxed ${
                    isSelected ? "text-[#032e92] font-bold" : "text-gray-700"
                  }`}
                >
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-[11px] text-red-600 font-semibold mt-2">{error}</p>}
    </div>
  );
}
