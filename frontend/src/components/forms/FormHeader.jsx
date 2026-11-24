import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faCheck, faLock } from "@fortawesome/free-solid-svg-icons";

export default function FormHeader({
  title,
  subtitle,
  steps = [],
  currentStep = 0,
  onStepClick,
  customerName = "",
}) {
  const progressPercent =
    steps.length > 1 ? Math.round((currentStep / (steps.length - 1)) * 100) : 100;

  return (
    <div className="bg-white border-b border-gray-100 shadow-2xs sticky top-0 z-30">
      {/* Top Brand Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#032e92] to-[#021d63] flex items-center justify-center text-white font-black text-sm tracking-tight shadow-xs">
            K
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-gray-950 block leading-tight">
              KNAPS <span className="text-[#032e92] font-semibold text-xs sm:text-sm">FINANCIAL</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium block">
              AMFI Registered Mutual Fund Distributor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {customerName && (
            <span className="hidden md:inline-block text-xs text-gray-600 bg-slate-50 px-3 py-1 rounded-full border border-gray-200">
              Investor: <strong className="text-gray-900">{customerName}</strong>
            </span>
          )}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <FontAwesomeIcon icon={faLock} className="text-[10px]" />
            <span>256-bit Encrypted</span>
          </div>
        </div>
      </div>

      {/* Title & Step Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-3">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {steps.length > 0 && (
            <span className="text-xs font-bold text-[#032e92] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title || ""}
            </span>
          )}
        </div>

        {/* Multi-step progress bar */}
        {steps.length > 1 && (
          <div className="pt-1 pb-1">
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#032e92] h-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Step Pills for Desktop */}
            <div className="hidden sm:flex items-center justify-between mt-2.5">
              {steps.map((s, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => isCompleted && onStepClick && onStepClick(idx)}
                    disabled={!isCompleted}
                    className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${isCurrent
                        ? "text-[#032e92]"
                        : isCompleted
                          ? "text-emerald-700 hover:text-emerald-800 cursor-pointer"
                          : "text-gray-400 cursor-default"
                      }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isCurrent
                          ? "bg-[#032e92] text-white shadow-xs"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                    >
                      {isCompleted ? <FontAwesomeIcon icon={faCheck} /> : idx + 1}
                    </span>
                    <span className="truncate max-w-[110px]">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
