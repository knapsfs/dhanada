import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faCoins } from "@fortawesome/free-solid-svg-icons";

export const INCOME_SLABS = [
  "Below 5 Lakhs",
  "5 - 10 Lakhs",
  "10 - 25 Lakhs",
  "25 - 50 Lakhs",
  "50 Lakhs - 1 Crore",
  "Above 1 Crore",
];

export default function FinancialDetailsSection({
  incomeSlab,
  onChange,
  error,
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faWallet} className="text-[#032e92]" />
          <span>Annual Income Slab <span className="text-red-500">*</span></span>
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Select the gross annual income range that applies to you (as per Indian regulatory KYC guidelines).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {INCOME_SLABS.map((slab) => {
          const isSelected = incomeSlab === slab;
          return (
            <button
              key={slab}
              type="button"
              onClick={() => onChange(slab)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "border-[#032e92] bg-blue-50/60 ring-2 ring-blue-100 shadow-2xs"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon
                  icon={faCoins}
                  className={isSelected ? "text-[#032e92]" : "text-gray-400"}
                />
                <span className={`text-xs font-bold ${isSelected ? "text-[#032e92]" : "text-gray-800"}`}>
                  {slab}
                </span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected ? "border-[#032e92] bg-[#032e92]" : "border-gray-300"
                }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="text-[11px] text-red-600 font-semibold">{error}</p>}
    </div>
  );
}
