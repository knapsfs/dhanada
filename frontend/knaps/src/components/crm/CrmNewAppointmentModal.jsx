import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faClock,
  faVideo,
  faPhone,
  faBuilding,
  faXmark,
  faSpinner,
  faCheck,
  faUsers,
  faUserTie,
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { crmService } from "../../services/crmService";

import { getIstTodayStr, formatLocalDate } from "../../utils/dateUtils";

export default function CrmNewAppointmentModal({
  isOpen,
  onClose,
  onCreated,
  leads = [],
  preselectedLead = null,
  preselectedDate = null,
}) {
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [meetingType, setMeetingType] = useState("Online");

  // Default date: today in IST or preselected date
  const getInitialDate = () => {
    if (preselectedDate) return formatLocalDate(preselectedDate);
    return getIstTodayStr();
  };

  const [appointmentDate, setAppointmentDate] = useState(getInitialDate());
  const [startTime, setStartTime] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Sync preselected lead or reset
  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess(false);
      if (preselectedLead) {
        setSelectedLeadId(preselectedLead.name || "");
        setCustomerName(preselectedLead.lead_name || "");
        setEmail(preselectedLead.email || "");
        setMobileNumber(preselectedLead.mobile_no || "");
      } else {
        setSelectedLeadId("");
        setCustomerName("");
        setEmail("");
        setMobileNumber("");
      }
      setMeetingNotes("");
      setStartTime("");
      setMeetingType("Online");
      setAppointmentDate(getInitialDate());
    }
  }, [isOpen, preselectedLead, preselectedDate]);

  // Handle lead select dropdown change
  const handleLeadChange = (leadId) => {
    setSelectedLeadId(leadId);
    if (!leadId) return;
    const found = leads.find((l) => l.name === leadId);
    if (found) {
      setCustomerName(found.lead_name || "");
      setEmail(found.email || "");
      setMobileNumber(found.mobile_no || "");
    }
  };

  // Fetch slots whenever date or meetingType changes
  useEffect(() => {
    if (!isOpen || !appointmentDate) return;

    let isMounted = true;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setStartTime("");
      setError("");
      try {
        const res = await crmService.getAvailableSlots(appointmentDate, meetingType);
        if (isMounted) {
          if (res && res.slots) {
            setSlots(res.slots);
          } else {
            setSlots([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Failed to fetch slots:", err);
          setSlots([]);
        }
      } finally {
        if (isMounted) {
          setLoadingSlots(false);
        }
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [isOpen, appointmentDate, meetingType]);

  if (!isOpen) return null;

  const minDate = getIstTodayStr();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Please provide the customer name.");
      return;
    }

    const cleanPhone = mobileNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Please provide a valid 10-digit mobile number.");
      return;
    }

    if (!appointmentDate) {
      setError("Please choose an appointment date.");
      return;
    }

    if (!startTime) {
      setError("Please select an available time slot.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await crmService.createAppointment({
        customer_name: customerName.trim(),
        email: email.trim(),
        mobile_number: cleanPhone,
        appointment_date: appointmentDate,
        start_time: startTime,
        meeting_type: meetingType,
        lead: selectedLeadId || undefined,
        meeting_notes: meetingNotes.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        if (onCreated) {
          onCreated(res?.appointment || res);
        }
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to schedule appointment. The slot may already be reserved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isSubmitting ? onClose : undefined}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#f8fafc] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#032e92] border border-blue-100 flex items-center justify-center text-sm font-bold shadow-2xs">
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  Schedule New Appointment
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Book a meeting directly with a lead or client
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 shrink-0" />
                <span>Appointment scheduled successfully! Syncing calendar...</span>
              </div>
            )}

            {/* Optional Lead Selector */}
            {leads.length > 0 && !preselectedLead && (
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100/80">
                <label className="block text-xs font-bold text-blue-950 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-xs" />
                    Link to Existing Lead (Optional)
                  </span>
                  {selectedLeadId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLeadId("");
                        setCustomerName("");
                        setEmail("");
                        setMobileNumber("");
                      }}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Clear Selection
                    </button>
                  )}
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => handleLeadChange(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92]"
                >
                  <option value="">-- Choose a lead or enter details below --</option>
                  {leads.map((l) => (
                    <option key={l.name} value={l.name}>
                      {l.lead_name || l.name} {l.mobile_no ? `(${l.mobile_no})` : ""}{" "}
                      {l.status ? `• ${l.status}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Customer Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="rajesh@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92]"
              />
            </div>

            {/* Meeting Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Meeting Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Online", label: "Online (Meet/Zoom)", icon: faVideo },
                  { id: "Phone Call", label: "Phone Call", icon: faPhone },
                  { id: "In Person", label: "In Person", icon: faBuilding },
                ].map((type) => {
                  const isSelected = meetingType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setMeetingType(type.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#032e92] text-white border-[#032e92] shadow-xs"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={type.icon}
                        className={`text-sm ${isSelected ? "text-white" : "text-gray-500"}`}
                      />
                      <span className="text-[11px] truncate">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={minDate}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92]"
                />
              </div>

              {/* Slot Grid */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Available Time Slots <span className="text-red-500">*</span>
                  </label>
                  {loadingSlots && (
                    <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                      Loading slots...
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="py-8 flex flex-col items-center justify-center text-gray-400 gap-2 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-lg text-blue-500" />
                    <p className="text-xs">Checking calendar availability...</p>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-500 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                    No available slots for this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-gray-100 rounded-2xl bg-gray-50/40">
                    {slots.map((slot) => {
                      const isSelected = startTime === slot.start_time;
                      const isAvailable = slot.available;
                      return (
                        <button
                          key={slot.start_time}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setStartTime(slot.start_time)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                            isSelected
                              ? "bg-[#032e92] text-white border-[#032e92] shadow-xs"
                              : isAvailable
                              ? "bg-white text-gray-800 border-gray-200 hover:border-blue-400 hover:bg-blue-50/40"
                              : "bg-gray-100/70 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[11px]">{slot.display_label}</span>
                            {isSelected && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                          </div>
                          {!isAvailable && slot.reason && (
                            <span className="text-[9px] text-red-500 font-medium block truncate">
                              {slot.reason}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Notes / Agenda */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Agenda / Discussion Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Portfolio review, Mutual Funds consultation..."
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !startTime || !customerName.trim()}
                className="px-5 py-2 rounded-xl bg-[#032e92] hover:bg-[#021d63] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="text-xs" />
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

