import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faIdCard, faEnvelope, faPhone, faCalendarAlt, faMapMarkerAlt, faBriefcase, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function PersonalDetailsSection({
  data = {},
  onChange,
  errors = {},
  prefill = {},
}) {
  const handleChange = (field, value) => {
    onChange && onChange(field, value);
  };

  const isPrefilled = (field) => Boolean(prefill[field] && prefill[field] === data[field]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-[#032e92] text-sm" />
            <span>Section A: Personal & KYC Details</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Please review and verify your identity and contact information.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>Information marked with * is mandatory</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-800">
              Full Name (as per PAN Card) <span className="text-red-500">*</span>
            </label>
            {isPrefilled("full_name") && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Prefilled
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              value={data.full_name || ""}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.full_name
                  ? "border-red-400 focus:ring-red-200 text-red-950"
                  : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
              }`}
            />
          </div>
          {errors.full_name && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.full_name}</p>
          )}
        </div>

        {/* PAN Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-800">
              Permanent Account Number (PAN) <span className="text-red-500">*</span>
            </label>
            {isPrefilled("pan") && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Prefilled
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              maxLength={10}
              value={data.pan || ""}
              onChange={(e) => handleChange("pan", e.target.value.toUpperCase().trim())}
              placeholder="ABCDE1234F"
              className={`w-full text-xs font-bold tracking-wider uppercase px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.pan
                  ? "border-red-400 focus:ring-red-200 text-red-950"
                  : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
              }`}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">10-character alphanumeric PAN</p>
          {errors.pan && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.pan}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-800">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            {isPrefilled("dob") && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Prefilled
              </span>
            )}
          </div>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={data.dob || ""}
            onChange={(e) => handleChange("dob", e.target.value)}
            className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.dob
                ? "border-red-400 focus:ring-red-200 text-red-950"
                : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
            }`}
          />
          {errors.dob && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.dob}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-800">
              Email Address <span className="text-red-500">*</span>
            </label>
            {isPrefilled("email") && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Prefilled
              </span>
            )}
          </div>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value.toLowerCase().trim())}
            placeholder="name@example.com"
            className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-red-400 focus:ring-red-200 text-red-950"
                : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
            }`}
          />
          {errors.email && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.email}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-800">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            {isPrefilled("mobile_no") && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Prefilled
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="px-3 py-2.5 text-xs font-bold bg-gray-100 text-gray-600 border border-r-0 border-gray-300 rounded-l-xl">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              value={data.mobile_no || ""}
              onChange={(e) => handleChange("mobile_no", e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
              className={`w-full text-xs font-semibold px-3.5 py-2.5 rounded-r-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.mobile_no
                  ? "border-red-400 focus:ring-red-200 text-red-950"
                  : "border-gray-300 focus:border-[#032e92] focus:ring-blue-100 text-gray-900"
              }`}
            />
          </div>
          {errors.mobile_no && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.mobile_no}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={data.gender || ""}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-blue-100 text-gray-900"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Place of Birth (City) */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Place of Birth (City) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.place_of_birth || ""}
            onChange={(e) => handleChange("place_of_birth", e.target.value)}
            placeholder="e.g. Mumbai"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-blue-100 text-gray-900"
          />
          {errors.place_of_birth && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.place_of_birth}</p>
          )}
        </div>

        {/* Occupation */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Occupation <span className="text-red-500">*</span>
          </label>
          <select
            value={data.occupation || ""}
            onChange={(e) => handleChange("occupation", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-blue-100 text-gray-900"
          >
            <option value="">Select Occupation</option>
            <option value="Salaried">Salaried (Private / Govt)</option>
            <option value="Business / Self-Employed">Business / Self-Employed</option>
            <option value="Professional (Doctor, CA, Lawyer, etc.)">Professional</option>
            <option value="Retired">Retired</option>
            <option value="Homemaker">Homemaker</option>
            <option value="Student">Student</option>
            <option value="Others">Others</option>
          </select>
          {errors.occupation && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.occupation}</p>
          )}
        </div>

        {/* Address Details */}
        <div className="sm:col-span-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Residential Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={data.address || data.address_line1 || ""}
            onChange={(e) => {
              handleChange("address", e.target.value);
              handleChange("address_line1", e.target.value);
            }}
            placeholder="Flat/House No, Building, Street, Area"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-blue-100 text-gray-900"
          />
          {errors.address && (
            <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.address}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="e.g. Pune"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-blue-100 text-gray-900"
          />
        </div>

        {/* State */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="e.g. Maharashtra"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-blue-100 text-gray-900"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength={6}
            value={data.pincode || ""}
            onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ""))}
            placeholder="411001"
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#032e92] focus:ring-2 focus:ring-blue-100 text-gray-900"
          />
        </div>

        {/* Country */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-1.5">Country</label>
          <input
            type="text"
            value={data.country || "India"}
            onChange={(e) => handleChange("country", e.target.value)}
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-700"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
