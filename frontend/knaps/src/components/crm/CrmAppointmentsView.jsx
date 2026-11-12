import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCalendarCheck,
  faCalendarXmark,
  faCalendar,
  faClock,
  faVideo,
  faPhone,
  faBuilding,
  faPlus,
  faSearch,
  faArrowsRotate,
  faEye,
  faPenToSquare,
  faBan,
  faTrash,
  faCheck,
  faFilter,
  faChevronLeft,
  faChevronRight,
  faUserTie,
  faUsers,
  faArrowUpRightFromSquare,
  faSpinner,
  faXmark,
  faCircleCheck,
  faCircleExclamation,
  faTableList,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";
import { crmService } from "../../services/crmService";
import { getIstTodayStr, formatLocalDate, parseLocalDateStr } from "../../utils/dateUtils";

const STATUS_CONFIG = {
  Confirmed: {
    bg: "bg-blue-50 text-[#032e92] border-blue-200",
    dot: "bg-[#032e92]",
    badgeBg: "bg-blue-100 text-blue-800",
  },
  Pending: {
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    badgeBg: "bg-amber-100 text-amber-800",
  },
  Completed: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    badgeBg: "bg-emerald-100 text-emerald-800",
  },
  Cancelled: {
    bg: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    badgeBg: "bg-red-100 text-red-800",
  },
  "No Show": {
    bg: "bg-gray-100 text-gray-700 border-gray-300",
    dot: "bg-gray-400",
    badgeBg: "bg-gray-200 text-gray-800",
  },
};

const MEETING_TYPE_ICONS = {
  Online: { icon: faVideo, label: "Online", color: "text-blue-600 bg-blue-50" },
  "Phone Call": { icon: faPhone, label: "Phone", color: "text-emerald-600 bg-emerald-50" },
  "In Person": { icon: faBuilding, label: "In Person", color: "text-purple-600 bg-purple-50" },
};

export default function CrmAppointmentsView({
  onSelectLead,
  onNewAppointment,
  refreshTrigger = 0,
}) {
  // View toggle: 'calendar' or 'list'
  const [activeSubView, setActiveSubView] = useState("calendar"); // 'calendar' or 'list'
  const [calendarViewMode, setCalendarViewMode] = useState("month"); // 'month', 'week', 'day'
  const [currentDate, setCurrentDate] = useState(() => parseLocalDateStr(getIstTodayStr()));

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    today_date: getIstTodayStr(),
  });

  // Table & Listing State
  const [appointments, setAppointments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [presetFilter, setPresetFilter] = useState("all"); // 'all', 'today', 'upcoming', 'past', 'custom'
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Modals & Drawers
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Reschedule Interactive State
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState("");
  const [loadingRescheduleSlots, setLoadingRescheduleSlots] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  // 1. Load Stats
  const loadStats = useCallback(async () => {
    try {
      const data = await crmService.getAppointmentStats();
      if (data) setStats(data);
    } catch (err) {
      console.warn("Failed to load appointment stats:", err);
    }
  }, []);

  // 2. Load Appointments List
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const isCalendar = activeSubView === "calendar";
      const params = {
        page: isCalendar ? 1 : page,
        page_size: isCalendar ? 100 : pageSize,
        search: searchQuery.trim(),
        status: statusFilter !== "All" ? statusFilter : undefined,
        meeting_type: typeFilter !== "All" ? typeFilter : undefined,
        filter_preset: presetFilter,
        from_date: presetFilter === "custom" ? customFrom : undefined,
        to_date: presetFilter === "custom" ? customTo : undefined,
      };

      const res = await crmService.getAppointments(params);
      const list =
        res?.appointments ||
        res?.message?.appointments ||
        (Array.isArray(res) ? res : []);
      const total =
        res?.total !== undefined
          ? res.total
          : res?.message?.total !== undefined
            ? res.message.total
            : list.length;

      setAppointments(list);
      setTotalCount(total);
    } catch (err) {
      console.warn("Failed to load appointments:", err);
      setAppointments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter, typeFilter, presetFilter, customFrom, customTo, activeSubView]);

  useEffect(() => {
    loadStats();
    loadAppointments();
  }, [loadStats, loadAppointments, refreshTrigger]);

  // Handle Search Debounce
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };

  // 3. Export to CSV
  const handleExportCsv = () => {
    if (!appointments || appointments.length === 0) {
      alert("No appointments available to export.");
      return;
    }

    const headers = [
      "Appointment ID",
      "Customer Name",
      "Email",
      "Mobile",
      "Lead",
      "Date",
      "Start Time",
      "End Time",
      "Meeting Type",
      "Status",
      "Assigned To",
      "Created From",
    ];

    const rows = appointments.map((a) => [
      `"${a.name}"`,
      `"${a.customer_name || ""}"`,
      `"${a.email || ""}"`,
      `"${a.mobile_number || ""}"`,
      `"${a.lead || ""}"`,
      `"${a.appointment_date || ""}"`,
      `"${a.start_time || ""}"`,
      `"${a.end_time || ""}"`,
      `"${a.meeting_type || ""}"`,
      `"${a.status || ""}"`,
      `"${a.assigned_to || ""}"`,
      `"${a.created_from || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KNAPS_Appointments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Quick Status Update
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await crmService.updateAppointmentStatus(appointmentId, newStatus);
      loadStats();
      loadAppointments();
      if (selectedAppointment && selectedAppointment.name === appointmentId) {
        setSelectedAppointment((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || "Failed to update appointment status.");
    }
  };

  // 5. Cancel Appointment
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setIsSubmittingAction(true);
    try {
      await crmService.cancelAppointment(cancelTarget.name, cancellationReason);
      setCancelTarget(null);
      setCancellationReason("");
      loadStats();
      loadAppointments();
    } catch (err) {
      alert(err.message || "Failed to cancel appointment.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // 6. Reschedule Slots Loader
  useEffect(() => {
    if (!rescheduleTarget || !rescheduleDate) {
      setRescheduleSlots([]);
      setSelectedRescheduleSlot("");
      setRescheduleError("");
      return;
    }

    let isMounted = true;
    async function loadSlots() {
      setLoadingRescheduleSlots(true);
      setRescheduleError("");
      setSelectedRescheduleSlot("");
      try {
        const res = await crmService.getAvailableSlots(rescheduleDate);
        if (isMounted) {
          const result = res.message || res;
          if (result.success && Array.isArray(result.slots)) {
            setRescheduleSlots(result.slots);
            const open = result.slots.filter((s) => s.available);
            if (open.length === 0) {
              setRescheduleError("No available slots on this date. Please pick another date.");
            }
          } else {
            setRescheduleSlots([]);
            setRescheduleError(result.message || "Unable to load slots.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setRescheduleSlots([]);
          setRescheduleError("Failed to fetch available slots.");
        }
      } finally {
        if (isMounted) {
          setLoadingRescheduleSlots(false);
        }
      }
    }

    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [rescheduleTarget, rescheduleDate]);

  // 7. Confirm Reschedule
  const handleConfirmReschedule = async () => {
    if (!rescheduleTarget || !rescheduleDate || !selectedRescheduleSlot) {
      alert("Please select both a date and an available time slot.");
      return;
    }

    setIsSubmittingAction(true);
    try {
      await crmService.rescheduleAppointment(
        rescheduleTarget.name,
        rescheduleDate,
        selectedRescheduleSlot,
        cancellationReason
      );
      setRescheduleTarget(null);
      setRescheduleDate("");
      setSelectedRescheduleSlot("");
      setCancellationReason("");
      loadStats();
      loadAppointments();
    } catch (err) {
      alert(err.message || "Failed to reschedule appointment.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // -------------------------------------------------------------
  // CALENDAR CALCULATION HELPERS
  // -------------------------------------------------------------
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayIndex = firstDay.getDay(); // 0 is Sunday
    const totalDays = lastDay.getDate();

    const days = [];

    // Pad previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Pad next month days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const dayIndex = curr.getDay();
    const sunday = new Date(curr);
    sunday.setDate(curr.getDate() - dayIndex);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  const appointmentsByDate = useMemo(() => {
    const map = {};
    (appointments || []).forEach((apt) => {
      if (!apt || !apt.appointment_date) return;
      const d = String(apt.appointment_date).trim().split(" ")[0].split("T")[0];
      if (!d) return;
      if (!map[d]) map[d] = [];
      map[d].push(apt);
    });
    return map;
  }, [appointments]);

  const handlePrevDate = () => {
    setCurrentDate((prev) => {
      if (calendarViewMode === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      } else if (calendarViewMode === "week") {
        const d = new Date(prev);
        d.setDate(d.getDate() - 7);
        return d;
      } else {
        const d = new Date(prev);
        d.setDate(d.getDate() - 1);
        return d;
      }
    });
  };

  const handleNextDate = () => {
    setCurrentDate((prev) => {
      if (calendarViewMode === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      } else if (calendarViewMode === "week") {
        const d = new Date(prev);
        d.setDate(d.getDate() + 7);
        return d;
      } else {
        const d = new Date(prev);
        d.setDate(d.getDate() + 1);
        return d;
      }
    });
  };

  const handleToday = () => {
    setCurrentDate(parseLocalDateStr(stats?.today_date || getIstTodayStr()));
  };

  return (
    <div className="space-y-5">
      {/* 1. TOP HEADER & PRIMARY ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-sm font-bold border border-blue-100">
              <FontAwesomeIcon icon={faCalendarDays} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Appointments
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Manage scheduled investor consultations, meeting slots, and calendars
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Subview Toggle */}
          <div className="bg-[#f1f5f9] p-0.5 rounded-xl flex items-center border border-gray-200/80">
            <button
              type="button"
              onClick={() => setActiveSubView("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeSubView === "calendar"
                ? "bg-white text-[#032e92] shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <FontAwesomeIcon icon={faCalendar} className="text-[11px]" />
              <span>Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubView("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeSubView === "list"
                ? "bg-white text-[#032e92] shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <FontAwesomeIcon icon={faTableList} className="text-[11px]" />
              <span>Table List</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              loadStats();
              loadAppointments();
            }}
            disabled={loading}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-[#032e92] hover:bg-gray-50 transition-colors text-xs cursor-pointer shadow-2xs"
            title="Refresh appointments"
          >
            <FontAwesomeIcon icon={faArrowsRotate} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={() => onNewAppointment && onNewAppointment()}
            className="btn-ripple px-3.5 py-2 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            <span>Create Appointment</span>
          </button>
        </div>
      </div>

      {/* 2. STATISTIC KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          {
            label: "Total Appointments",
            value: stats.total,
            icon: faCalendarDays,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
          },
          {
            label: "Today's Meetings",
            value: stats.today,
            icon: faClock,
            color: "text-[#032e92]",
            bg: "bg-[#eef5ff]",
            border: "border-blue-200",
          },
          {
            label: "Upcoming",
            value: stats.upcoming,
            icon: faCalendarCheck,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: faCircleCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
          },
          {
            label: "Cancelled",
            value: stats.cancelled,
            icon: faCalendarXmark,
            color: "text-rose-600",
            bg: "bg-rose-50",
            border: "border-rose-100",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white border ${item.border} shadow-2xs hover:shadow-md transition-all group`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                {item.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center text-xs group-hover:scale-110 transition-transform`}
              >
                <FontAwesomeIcon icon={item.icon} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#032e92] transition-colors">
              {item.value ?? 0}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. CALENDAR VIEW SECTION */}
      {activeSubView === "calendar" && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
          {/* Calendar Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevDate}
                  className="p-1.5 w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center text-xs cursor-pointer"
                  title="Previous"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  type="button"
                  onClick={handleNextDate}
                  className="p-1.5 w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center text-xs cursor-pointer"
                  title="Next"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>

              {/* <button
                type="button"
                onClick={handleToday}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Today
              </button> */}

              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                {currentDate.toLocaleString("default", { month: "long" })}{" "}
                <span className="text-[#032e92]">{currentDate.getFullYear()}</span>
              </h3>
            </div>

            {/* View Mode (Month / Week / Day) */}
            <div className="bg-[#f1f5f9] p-0.5 rounded-xl flex items-center border border-gray-200/80 self-start sm:self-auto">
              {["month", "week", "day"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCalendarViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${calendarViewMode === mode
                    ? "bg-white text-[#032e92] shadow-2xs"
                    : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Grid (Month View) */}
          {calendarViewMode === "month" && (
            <div>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-px mb-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {calendarDays.map((cell, idx) => {
                  const dateStr = formatLocalDate(cell.date);
                  const dayApts = appointmentsByDate[dateStr] || [];
                  const istToday = stats?.today_date || getIstTodayStr();
                  const isToday = istToday === dateStr;

                  return (
                    <div
                      key={idx}
                      className={`min-h-[90px] sm:min-h-[115px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between transition-all group ${cell.isCurrentMonth
                        ? isToday
                          ? "bg-blue-50/50 border-[#032e92]/40 ring-1 ring-[#032e92]/20"
                          : "bg-white border-gray-200/80 hover:border-gray-300"
                        : "bg-gray-50/60 border-gray-100 text-gray-400"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${isToday
                              ? "bg-[#032e92] text-white"
                              : cell.isCurrentMonth
                                ? "text-gray-800"
                                : "text-gray-400"
                              }`}
                          >
                            {cell.date.getDate()}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNewAppointment && onNewAppointment(dateStr);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 hover:text-[#032e92] transition-opacity p-0.5 cursor-pointer"
                            title={`Schedule appointment for ${dateStr}`}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                        {dayApts.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-[#032e92] rounded-full">
                            {dayApts.length}
                          </span>
                        )}
                      </div>

                      {/* Appointments List for Day */}
                      <div className="space-y-1 overflow-y-auto max-h-16 flex-1 pr-0.5">
                        {dayApts.slice(0, 3).map((apt) => {
                          const statusStyle = STATUS_CONFIG[apt.status] || STATUS_CONFIG.Confirmed;
                          return (
                            <div
                              key={apt.name}
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setIsDetailDrawerOpen(true);
                              }}
                              className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold border truncate cursor-pointer transition-transform hover:scale-[1.02] ${statusStyle.bg}`}
                              title={`${apt.start_time} - ${apt.customer_name} (${apt.status})`}
                            >
                              <span className="font-bold mr-1">{apt.display_start || apt.start_time}</span>
                              <span>{apt.customer_name}</span>
                            </div>
                          );
                        })}
                        {dayApts.length > 3 && (
                          <div className="text-[9px] font-bold text-gray-500 pl-1">
                            +{dayApts.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Week View */}
          {calendarViewMode === "week" && (
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
              {weekDays.map((d, idx) => {
                const dateStr = formatLocalDate(d);
                const dayApts = appointmentsByDate[dateStr] || [];
                const istToday = stats?.today_date || getIstTodayStr();
                const isToday = istToday === dateStr;
                return (
                  <div
                    key={idx}
                    className={`min-h-[140px] p-2.5 rounded-xl border flex flex-col justify-between transition-all ${isToday
                      ? "bg-blue-50/50 border-[#032e92]/40 ring-1 ring-[#032e92]/20"
                      : "bg-white border-gray-200/80"
                      }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 mb-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${isToday ? "bg-[#032e92] text-white" : "text-gray-800"
                          }`}
                      >
                        {d.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1.5 overflow-y-auto flex-1">
                      {dayApts.length === 0 ? (
                        <p className="text-[10px] text-gray-400 italic text-center pt-4">No meetings</p>
                      ) : (
                        dayApts.map((apt) => {
                          const statusStyle = STATUS_CONFIG[apt.status] || STATUS_CONFIG.Confirmed;
                          return (
                            <div
                              key={apt.name}
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setIsDetailDrawerOpen(true);
                              }}
                              className={`p-1.5 rounded-lg text-[10px] font-semibold border cursor-pointer hover:shadow-xs transition-transform hover:scale-[1.02] ${statusStyle.bg}`}
                            >
                              <div className="font-bold truncate">{apt.display_start || apt.start_time}</div>
                              <div className="truncate">{apt.customer_name}</div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Day View */}
          {calendarViewMode === "day" && (
            <div className="space-y-3">
              {(() => {
                const dateStr = formatLocalDate(currentDate);
                const dayApts = appointmentsByDate[dateStr] || [];
                if (dayApts.length === 0) {
                  return (
                    <div className="py-12 text-center text-xs text-gray-500 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                      No appointments scheduled for {currentDate.toLocaleDateString("en-IN", { dateStyle: "full" })}.
                    </div>
                  );
                }
                return (
                  <div className="space-y-2">
                    {dayApts.map((apt) => {
                      const statusStyle = STATUS_CONFIG[apt.status] || STATUS_CONFIG.Confirmed;
                      const typeConfig = MEETING_TYPE_ICONS[apt.meeting_type] || MEETING_TYPE_ICONS.Online;
                      return (
                        <div
                          key={apt.name}
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-xs transition-all flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-xs font-bold text-gray-900 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                              {apt.display_time || apt.start_time}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{apt.customer_name}</p>
                              <p className="text-[11px] text-gray-500">{apt.mobile_number} • {apt.email || "No email"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${typeConfig.color}`}>
                              <FontAwesomeIcon icon={typeConfig.icon} />
                              <span>{apt.meeting_type}</span>
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle.bg}`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* 4. COMPREHENSIVE APPOINTMENT LISTING TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
        {/* Table Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              />
              <input
                type="text"
                placeholder="Search by customer, mobile, email, or Lead ID..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Preset Date Filter */}
              <select
                value={presetFilter}
                onChange={(e) => {
                  setPresetFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-[#f8fafc] text-xs font-semibold text-gray-700 outline-none focus:border-[#032e92] cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="custom">Custom Range</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-[#f8fafc] text-xs font-semibold text-gray-700 outline-none focus:border-[#032e92] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>

              {/* Meeting Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-[#f8fafc] text-xs font-semibold text-gray-700 outline-none focus:border-[#032e92] cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Online">Online</option>
                <option value="Phone Call">Phone Call</option>
                <option value="In Person">In Person</option>
              </select>
            </div>
          </div>

          {/* Custom Date Inputs if selected */}
          {presetFilter === "custom" && (
            <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
              <span className="font-semibold text-gray-600">From:</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => {
                  setCustomFrom(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
              />
              <span className="font-semibold text-gray-600">To:</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => {
                  setCustomTo(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
              />
            </div>
          )}
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#f8fafc] border-b border-gray-200/90 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Appointment ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Linked Lead</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl text-[#032e92] mb-2" />
                    <p className="font-medium text-xs">Loading appointments...</p>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 text-xl mx-auto mb-2">
                      <FontAwesomeIcon icon={faCalendarDays} />
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">No Appointments Found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      No appointments match the current filters or date range.
                    </p>
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => {
                  const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.Confirmed;
                  const typeInfo = MEETING_TYPE_ICONS[apt.meeting_type] || MEETING_TYPE_ICONS.Online;

                  return (
                    <tr
                      key={apt.name}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setIsDetailDrawerOpen(true);
                      }}
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#032e92] whitespace-nowrap">
                        {apt.name}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 whitespace-nowrap">
                        {apt.customer_name}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        <div className="space-y-0.5">
                          {apt.mobile_number && (
                            <p className="font-medium text-gray-800">{apt.mobile_number}</p>
                          )}
                          {apt.email && (
                            <p className="text-[11px] text-gray-400 truncate max-w-[150px]">{apt.email}</p>
                          )}
                        </div>
                      </td>

                      {/* Linked Lead */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {apt.lead ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectLead) onSelectLead(apt.lead);
                            }}
                            className="text-[#032e92] hover:underline font-bold flex items-center gap-1 text-xs"
                            title="Open Lead Profile"
                          >
                            <span>{apt.lead}</span>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-900">{apt.appointment_date}</p>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {apt.display_time || `${apt.start_time} - ${apt.end_time}`}
                          </p>
                        </div>
                      </td>

                      {/* Meeting Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${typeInfo.color}`}
                        >
                          <FontAwesomeIcon icon={typeInfo.icon} />
                          <span>{apt.meeting_type}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          <span>{apt.status}</span>
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-600 text-xs">
                        {apt.assigned_to ? (
                          <span className="font-medium">{apt.assigned_to}</span>
                        ) : (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsDetailDrawerOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#032e92] hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>

                          {/* Reschedule */}
                          {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                            <button
                              type="button"
                              onClick={() => {
                                setRescheduleTarget(apt);
                                setRescheduleDate(apt.appointment_date);
                              }}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Reschedule Appointment"
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                          )}

                          {/* Complete */}
                          {apt.status !== "Completed" && apt.status !== "Cancelled" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(apt.name, "Completed")}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Mark as Completed"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                          )}

                          {/* Cancel */}
                          {apt.status !== "Cancelled" && apt.status !== "Completed" && (
                            <button
                              type="button"
                              onClick={() => setCancelTarget(apt)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Cancel Appointment"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div>
            Showing <span className="font-bold text-gray-800">{appointments.length}</span> of{" "}
            <span className="font-bold text-gray-800">{totalCount}</span> appointments
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-2 font-bold text-gray-700">Page {page}</span>
            <button
              type="button"
              disabled={page * pageSize >= totalCount}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 5. APPOINTMENT DETAILS DRAWER / MODAL */}
      <AnimatePresence>
        {isDetailDrawerOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/60 to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#032e92] text-white flex items-center justify-center text-sm font-bold">
                    <FontAwesomeIcon icon={faCalendarDays} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Appointment Details
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      {selectedAppointment.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-xs transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* Status Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <span className="font-bold text-gray-500 uppercase tracking-wider text-[11px]">
                    Current Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[selectedAppointment.status]?.bg || "bg-gray-100"
                      }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>

                {/* Key Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#f8fafc] border border-gray-100">
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Customer Name</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedAppointment.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Meeting Type</p>
                    <p className="text-sm font-bold text-[#032e92] mt-0.5">{selectedAppointment.meeting_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Mobile Number</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedAppointment.mobile_number || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Email Address</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5 truncate">{selectedAppointment.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Appointment Date</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedAppointment.appointment_date}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Time Slot</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">
                      {selectedAppointment.display_time || `${selectedAppointment.start_time} - ${selectedAppointment.end_time}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Linked Lead</p>
                    {selectedAppointment.lead ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsDetailDrawerOpen(false);
                          if (onSelectLead) onSelectLead(selectedAppointment.lead);
                        }}
                        className="text-xs font-bold text-[#032e92] hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                      >
                        <span>{selectedAppointment.lead}</span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                      </button>
                    ) : (
                      <p className="text-xs text-gray-400 mt-0.5">Not linked</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase font-bold">Created From</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedAppointment.created_from || "Website"}</p>
                  </div>
                </div>

                {/* Meeting Link */}
                {selectedAppointment.meeting_link && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-[10px] font-bold text-[#032e92] uppercase">Meeting Link</p>
                    <a
                      href={selectedAppointment.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-700 underline truncate block mt-0.5 font-medium"
                    >
                      {selectedAppointment.meeting_link}
                    </a>
                  </div>
                )}

                {/* Meeting Notes */}
                {selectedAppointment.meeting_notes && (
                  <div>
                    <p className="text-gray-500 font-bold uppercase text-[10px] mb-1">Meeting Notes</p>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-xs whitespace-pre-wrap leading-relaxed">
                      {selectedAppointment.meeting_notes}
                    </div>
                  </div>
                )}

                {/* Cancellation Reason */}
                {selectedAppointment.cancellation_reason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <p className="text-[10px] font-bold uppercase mb-0.5">Cancellation Reason</p>
                    <p className="text-xs">{selectedAppointment.cancellation_reason}</p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-2 bg-gray-50/50">
                <div className="flex items-center gap-1.5">
                  {selectedAppointment.status !== "Completed" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAppointment.name, "Completed")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-2xs"
                    >
                      Mark Completed
                    </button>
                  )}
                  {selectedAppointment.status !== "No Show" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAppointment.name, "No Show")}
                      className="px-3 py-1.5 rounded-xl bg-gray-600 text-white font-bold text-xs hover:bg-gray-700 transition-colors shadow-2xs"
                    >
                      No Show
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {selectedAppointment.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => {
                        setRescheduleTarget(selectedAppointment);
                        setRescheduleDate(selectedAppointment.appointment_date);
                        setIsDetailDrawerOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 font-bold text-xs hover:bg-amber-100 transition-colors"
                    >
                      Reschedule
                    </button>
                  )}
                  {selectedAppointment.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => {
                        setCancelTarget(selectedAppointment);
                        setIsDetailDrawerOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-red-300 bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. RESCHEDULE MODAL */}
      <AnimatePresence>
        {rescheduleTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-xs">
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Reschedule Appointment</h3>
                    <p className="text-[11px] text-gray-400">{rescheduleTarget.customer_name} ({rescheduleTarget.name})</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center text-xs"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              {/* New Date Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Select New Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  min={stats?.today_date || getIstTodayStr()}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium outline-none focus:border-[#032e92]"
                />
              </div>

              {/* Slots */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Select New Time Slot <span className="text-red-500">*</span>
                  </label>
                  {loadingRescheduleSlots && (
                    <span className="text-[10px] text-blue-600 flex items-center gap-1 font-medium">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      Checking slots...
                    </span>
                  )}
                </div>

                {rescheduleError && (
                  <p className="p-2 text-xs bg-amber-50 border border-amber-200 rounded-lg text-amber-700 mb-2">
                    {rescheduleError}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {rescheduleSlots.map((slot) => {
                    const isSelected = selectedRescheduleSlot === slot.start_time;
                    const isAvail = slot.available;
                    return (
                      <button
                        key={slot.start_time}
                        type="button"
                        disabled={!isAvail}
                        onClick={() => setSelectedRescheduleSlot(slot.start_time)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center ${isSelected
                          ? "bg-[#032e92] text-white border-[#032e92] font-bold"
                          : isAvail
                            ? "bg-white border-gray-200 text-gray-800 hover:border-[#032e92] hover:text-[#032e92]"
                            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through"
                          }`}
                      >
                        <span>{slot.display_label}</span>
                        {!isAvail && (
                          <span className="text-[9px] no-underline font-normal text-gray-400">
                            {slot.unavailable_reason || "Booked"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Reason */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Reschedule Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Client requested evening slot"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#032e92]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingAction || !selectedRescheduleSlot}
                  onClick={handleConfirmReschedule}
                  className="px-5 py-2 rounded-xl bg-[#032e92] text-white text-xs font-bold hover:bg-[#021d63] disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmittingAction ? "Rescheduling..." : "Save New Slot"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. CANCEL CONFIRMATION MODAL */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-base shrink-0">
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Cancel Appointment?</h3>
                  <p className="text-xs text-gray-500">
                    Are you sure you want to cancel appointment <span className="font-mono font-bold text-gray-800">{cancelTarget.name}</span> for {cancelTarget.customer_name}?
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Cancellation Reason (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Investor not reachable, requested postponement"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-red-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  disabled={isSubmittingAction}
                  onClick={handleConfirmCancel}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmittingAction ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

