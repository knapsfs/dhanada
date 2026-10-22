import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faCloudArrowUp,
  faFileCircleCheck,
  faTrashCan,
  faSpinner,
  faCircleCheck,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { formWorkflowService } from "../../services/formWorkflowService";

export default function BankDetailsSection({
  data = {},
  onChange,
  token,
  errors = {},
}) {
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const method = data.bank_entry_method || "Manual";

  const handleChange = (field, value) => {
    onChange && onChange(field, value);
  };

  const handleIfscBlur = async () => {
    const code = (data.bank_ifsc || "").trim().toUpperCase();
    if (!code || code.length !== 11) return;
    setLookupLoading(true);
    try {
      const res = await formWorkflowService.lookupIfsc(code);
      if (res.valid && res.bank) {
        setLookupResult(res);
        handleChange("bank_name", res.bank);
      } else {
        setLookupResult(null);
      }
    } catch {
      setLookupResult(null);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.");
      return;
    }

    setUploadError("");
    setUploading(true);
    try {
      const res = await formWorkflowService.uploadBankProof(token, file);
      handleChange("bank_proof_file", res.file_url);
      handleChange("bank_proof_filename", file.name);
    } catch (err) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    handleChange("bank_proof_file", "");
    handleChange("bank_proof_filename", "");
    setUploadError("");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faBuildingColumns} className="text-[#032e92] text-sm" />
            <span>Section C: Bank Details</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Registered bank account will be used for all investment settlements and redemptions.
          </p>
        </div>
      </div>

      {/* Method Selection Radio Cards */}
      <div>
        <label className="text-xs font-bold text-gray-800 block mb-2">
          How would you like to provide your bank details? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleChange("bank_entry_method", "Manual")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              method === "Manual"
                ? "border-[#032e92] bg-blue-50/60 ring-2 ring-blue-100 shadow-2xs"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                method === "Manual" ? "border-[#032e92] bg-[#032e92]" : "border-gray-300 bg-white"
              }`}
            >
              {method === "Manual" && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div>
              <span className="text-xs font-extrabold text-gray-900 block">
                Method 1 — Enter Bank Details Manually
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 block leading-relaxed">
                Provide your bank name, account number, and verified IFSC code.
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleChange("bank_entry_method", "Upload")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
              method === "Upload"
                ? "border-[#032e92] bg-blue-50/60 ring-2 ring-blue-100 shadow-2xs"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                method === "Upload" ? "border-[#032e92] bg-[#032e92]" : "border-gray-300 bg-white"
              }`}
            >
              {method === "Upload" && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div>
              <span className="text-xs font-extrabold text-gray-900 block">
                Method 2 — Upload Bank Proof Document
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 block leading-relaxed">
                Upload a scanned copy or photo of your cancelled cheque or bank passbook.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* METHOD 1: MANUAL BANK DETAILS */}
      {method === "Manual" && (
        <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-200/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* IFSC Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Bank IFSC Code <span className="text-red-500">*</span>
                </label>
                {lookupLoading && (
                  <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> Verifying IFSC...
                  </span>
                )}
              </div>
              <input
                type="text"
                maxLength={11}
                value={data.bank_ifsc || ""}
                onChange={(e) => handleChange("bank_ifsc", e.target.value.toUpperCase().trim())}
                onBlur={handleIfscBlur}
                placeholder="e.g. HDFC0000001"
                className={`w-full text-xs font-bold tracking-wider uppercase px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.bank_ifsc
                    ? "border-red-400 focus:ring-red-200 text-red-950"
                    : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
                }`}
              />
              {lookupResult && lookupResult.bank && (
                <div className="mt-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600" />
                  <span>
                    Verified: <strong>{lookupResult.bank}</strong> ({lookupResult.branch || "Branch"})
                  </span>
                </div>
              )}
              {errors.bank_ifsc && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.bank_ifsc}</p>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1.5">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.bank_name || ""}
                onChange={(e) => handleChange("bank_name", e.target.value)}
                placeholder="e.g. HDFC Bank"
                className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.bank_name
                    ? "border-red-400 focus:ring-red-200 text-red-950"
                    : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
                }`}
              />
              {errors.bank_name && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.bank_name}</p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1.5">
                Bank Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.bank_account_no || ""}
                onChange={(e) =>
                  handleChange("bank_account_no", e.target.value.replace(/\D/g, ""))
                }
                placeholder="Enter bank account number"
                className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.bank_account_no
                    ? "border-red-400 focus:ring-red-200 text-red-950"
                    : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
                }`}
              />
              {errors.bank_account_no && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">
                  {errors.bank_account_no}
                </p>
              )}
            </div>

            {/* Confirm Account Number */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1.5">
                Confirm Bank Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.confirm_bank_account_no || ""}
                onChange={(e) =>
                  handleChange("confirm_bank_account_no", e.target.value.replace(/\D/g, ""))
                }
                placeholder="Re-enter bank account number"
                className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.confirm_bank_account_no
                    ? "border-red-400 focus:ring-red-200 text-red-950"
                    : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
                }`}
              />
              {errors.confirm_bank_account_no && (
                <p className="text-[11px] text-red-600 font-semibold mt-1">
                  {errors.confirm_bank_account_no}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* METHOD 2: UPLOAD PROOF */}
      {method === "Upload" && (
        <div className="bg-slate-50/60 p-5 rounded-2xl border border-gray-200/80 space-y-4">
          <div className="text-xs text-gray-600 leading-relaxed">
            Please upload a clear scanned copy or high-resolution photo of either your{" "}
            <strong>Cancelled Cheque</strong> (with your printed name) or the{" "}
            <strong>First Page of your Bank Passbook / Recent Statement</strong>.
          </div>

          {!data.bank_proof_file ? (
            <label className="border-2 border-dashed border-gray-300 hover:border-[#032e92] bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-[#032e92]" />
                  <span className="text-xs font-bold text-gray-700">Uploading Bank Document...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#032e92] flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                  </div>
                  <span className="text-xs font-bold text-gray-900 mt-1">
                    Click to browse or drop document here
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Supported formats: PDF, PNG, JPG, JPEG (Max 5MB)
                  </span>
                </div>
              )}
            </label>
          ) : (
            <div className="bg-white border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
                  <FontAwesomeIcon icon={faFileCircleCheck} />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block truncate max-w-xs">
                    {data.bank_proof_filename || "Uploaded Bank Proof Document"}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" />
                    Uploaded successfully
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FontAwesomeIcon icon={faTrashCan} />
                <span>Remove</span>
              </button>
            </div>
          )}

          {uploadError && (
            <p className="text-[11px] text-red-600 font-semibold">{uploadError}</p>
          )}
          {errors.bank_proof_file && (
            <p className="text-[11px] text-red-600 font-semibold">{errors.bank_proof_file}</p>
          )}
        </div>
      )}

      {/* Compliance Notice */}
      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 leading-relaxed">
        <FontAwesomeIcon icon={faInfoCircle} className="text-amber-700 mt-0.5" />
        <span>
          <strong>Verification Notice:</strong> Bank account details and uploaded documents will be
          verified by our compliance operations desk against regulatory depository standards prior
          to transaction execution. Format validation does not constitute final verification.
        </span>
      </div>
    </div>
  );
}
