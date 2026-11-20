import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faShieldHalved, faInfoCircle, faCopy } from "@fortawesome/free-solid-svg-icons";

export default function NomineeDetailsSection({
  data = {},
  onChange,
  clientAddress = "",
  errors = {},
}) {
  const [sameAddress, setSameAddress] = useState(false);

  const handleChange = (field, value) => {
    onChange && onChange(field, value);
  };

  const handleSameAddressToggle = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked && clientAddress) {
      handleChange("nominee_address", clientAddress);
    }
  };

  const isMinor = Boolean(data.is_nominee_minor);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-[#032e92] text-sm" />
            <span>Section B: Nominee Details</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Nomination is mandatory for all investment folios and depository accounts.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>Nominee details ensure seamless estate transfer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nominee Name */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Nominee Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nominee_name || ""}
            onChange={(e) => {
              handleChange("nominee_name", e.target.value);
              if (!data.statement_name) {
                handleChange("statement_name", e.target.value);
              }
            }}
            placeholder="e.g. Priya Sharma"
            className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.nominee_name
                ? "border-red-400 focus:ring-red-200 text-red-950"
                : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
            }`}
          />
          {errors.nominee_name && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.nominee_name}</p>
          )}
        </div>

        {/* Nominee Relationship */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Relationship with Investor <span className="text-red-500">*</span>
          </label>
          <select
            value={data.nominee_relationship || ""}
            onChange={(e) => handleChange("nominee_relationship", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-blue-100 text-gray-900"
          >
            <option value="">Select Relationship</option>
            <option value="Spouse">Spouse</option>
            <option value="Son">Son</option>
            <option value="Daughter">Daughter</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Grandchild">Grandchild</option>
            <option value="Other">Other</option>
          </select>
          {errors.nominee_relationship && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">
              {errors.nominee_relationship}
            </p>
          )}
        </div>

        {/* Nominee DOB */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Nominee Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={data.nominee_dob || ""}
            onChange={(e) => {
              const val = e.target.value;
              handleChange("nominee_dob", val);
              // auto determine minor if < 18 years
              if (val) {
                const dob = new Date(val);
                const now = new Date();
                const age = now.getFullYear() - dob.getFullYear();
                if (age < 18) {
                  handleChange("is_nominee_minor", true);
                }
              }
            }}
            className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.nominee_dob
                ? "border-red-400 focus:ring-red-200 text-red-950"
                : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
            }`}
          />
          {errors.nominee_dob && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.nominee_dob}</p>
          )}
        </div>

        {/* Is Nominee Minor Toggle */}
        <div className="flex flex-col justify-center">
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Is the Nominee a Minor (under 18)?
          </label>
          <div className="flex items-center gap-4 mt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
              <input
                type="radio"
                name="is_nominee_minor"
                checked={isMinor === false}
                onChange={() => handleChange("is_nominee_minor", false)}
                className="w-4 h-4 text-[#032e92] focus:ring-blue-200"
              />
              <span>No (Major)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
              <input
                type="radio"
                name="is_nominee_minor"
                checked={isMinor === true}
                onChange={() => handleChange("is_nominee_minor", true)}
                className="w-4 h-4 text-[#032e92] focus:ring-blue-200"
              />
              <span className="text-amber-800">Yes (Minor)</span>
            </label>
          </div>
        </div>

        {/* CONDITIONAL GUARDIAN SECTION (IF NOMINEE IS MINOR) */}
        {isMinor && (
          <div className="sm:col-span-2 bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-amber-900">
              <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
              <h4 className="text-xs font-extrabold uppercase tracking-wide">
                Guardian Details Required (Nominee is a Minor)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Guardian Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.guardian_name || ""}
                  onChange={(e) => handleChange("guardian_name", e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92]"
                />
                {errors.guardian_name && (
                  <p className="text-[10px] text-red-600 font-semibold mt-1">
                    {errors.guardian_name}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Guardian Relationship <span className="text-red-500">*</span>
                </label>
                <select
                  value={data.guardian_relationship || ""}
                  onChange={(e) => handleChange("guardian_relationship", e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92]"
                >
                  <option value="">Select</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Court Appointed Legal Guardian">Court Appointed Guardian</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Guardian PAN / ID
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={data.guardian_pan || ""}
                  onChange={(e) => handleChange("guardian_pan", e.target.value.toUpperCase())}
                  placeholder="PAN / Identity No"
                  className="w-full text-xs font-bold uppercase px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Nominee ID Type & Number */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Nominee ID Proof Type
          </label>
          <select
            value={data.nominee_id_type || ""}
            onChange={(e) => handleChange("nominee_id_type", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] text-gray-900"
          >
            <option value="">Select ID Type (Optional)</option>
            <option value="PAN">PAN Card</option>
            <option value="Aadhaar">Aadhaar Card (Last 4 Digits)</option>
            <option value="Passport">Passport</option>
            <option value="Voter ID">Voter ID</option>
            <option value="Driving Licence">Driving Licence</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Nominee ID Number
          </label>
          <input
            type="text"
            value={data.nominee_id_number || ""}
            onChange={(e) => handleChange("nominee_id_number", e.target.value)}
            placeholder="ID Number"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] text-gray-900"
          />
        </div>

        {/* Nominee Contact */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Nominee Mobile Number
          </label>
          <input
            type="tel"
            maxLength={10}
            value={data.nominee_mobile || ""}
            onChange={(e) => handleChange("nominee_mobile", e.target.value.replace(/\D/g, ""))}
            placeholder="10-digit mobile number"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] text-gray-900"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Nominee Email Address
          </label>
          <input
            type="email"
            value={data.nominee_email || ""}
            onChange={(e) => handleChange("nominee_email", e.target.value.toLowerCase().trim())}
            placeholder="nominee@example.com"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] text-gray-900"
          />
        </div>

        {/* Nominee Address with "Same as Investor" helper */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <label className="text-xs font-bold text-gray-800">
              Nominee Address <span className="text-red-500">*</span>
            </label>
            {clientAddress && (
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#032e92] cursor-pointer hover:underline">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={handleSameAddressToggle}
                  className="rounded text-[#032e92]"
                />
                <span>Same as my residential address</span>
              </label>
            )}
          </div>
          <textarea
            rows={2}
            value={data.nominee_address || ""}
            onChange={(e) => handleChange("nominee_address", e.target.value)}
            placeholder="Nominee postal address"
            className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.nominee_address
                ? "border-red-400 focus:ring-red-200 text-red-950"
                : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
            }`}
          />
          {errors.nominee_address && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.nominee_address}</p>
          )}
        </div>

        {/* Name to Be Printed on Statement */}
        <div className="sm:col-span-2">
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Name to Be Printed on Statement / Records
          </label>
          <input
            type="text"
            value={data.statement_name || data.nominee_name || ""}
            onChange={(e) => handleChange("statement_name", e.target.value)}
            placeholder="Official name printed on reports"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
