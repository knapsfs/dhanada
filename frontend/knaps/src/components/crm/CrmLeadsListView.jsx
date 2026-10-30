import { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faCommentDots,
  faEye,
  faFilter,
  faPlus,
  faTrash,
  faSpinner,
  faTableColumns,
  faTriangleExclamation,
  faRotateLeft,
  faXmark,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import CrmSelect from "./CrmSelect";
import { crmService } from "../../services/crmService";
import { getContactStatus } from "../../utils/crmContactUtils";

const STATUS_BADGES = {
  New: "bg-blue-50 text-[#032e92] border-blue-200",
  Interested: "bg-amber-50 text-amber-700 border-amber-200",
  Nurturing: "bg-purple-50 text-purple-700 border-purple-200",
  Converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Not Interested": "bg-gray-100 text-gray-700 border-gray-300",
  Junk: "bg-red-50 text-red-700 border-red-200",
};

const BASE_STATUS_OPTIONS = [
  "New",
  "Interested",
  "Nurturing",
  "Converted",
  "Not Interested",
  "Junk",
];

function matchesDateFilter(creationStr, preset, customFrom, customTo) {
  if (!preset || preset === "all") return true;
  if (!creationStr) return false;

  const leadDate = new Date(creationStr);
  if (isNaN(leadDate.getTime())) return true;

  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  if (preset === "today") {
    return leadDate >= todayStart && leadDate <= todayEnd;
  }
  if (preset === "yesterday") {
    const yest = new Date(now);
    yest.setDate(yest.getDate() - 1);
    return leadDate >= startOfDay(yest) && leadDate <= endOfDay(yest);
  }
  if (preset === "last_7_days") {
    const d7 = new Date(now);
    d7.setDate(d7.getDate() - 7);
    return leadDate >= startOfDay(d7) && leadDate <= todayEnd;
  }
  if (preset === "last_30_days") {
    const d30 = new Date(now);
    d30.setDate(d30.getDate() - 30);
    return leadDate >= startOfDay(d30) && leadDate <= todayEnd;
  }
  if (preset === "this_month") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    return leadDate >= monthStart && leadDate <= todayEnd;
  }
  if (preset === "custom") {
    if (customFrom) {
      const fromDate = startOfDay(new Date(customFrom));
      if (!isNaN(fromDate.getTime()) && leadDate < fromDate) return false;
    }
    if (customTo) {
      const toDate = endOfDay(new Date(customTo));
      if (!isNaN(toDate.getTime()) && leadDate > toDate) return false;
    }
    return true;
  }
  return true;
}

export default function CrmLeadsListView({
  leads = [],
  onSelectLead,
  selectedStatus,
  onStatusFilterChange,
  searchQuery = "",
  onSearchChange,
  onNewLead,
  onDeleteLead,
  onOpenKanban,
}) {
  const [filters, setFilters] = useState({
    lead: "",
    contact: "",
    product: "All",
    source: "All",
    touchpoints: "All",
    status: selectedStatus || "All",
    createdPreset: "all",
    createdFrom: "",
    createdTo: "",
  });

  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Sync external status change
  useEffect(() => {
    if (selectedStatus !== undefined) {
      setFilters((prev) => {
        if (prev.status === selectedStatus) return prev;
        return { ...prev, status: selectedStatus };
      });
      setCurrentPage(1);
    }
  }, [selectedStatus]);

  // Unique options derived from current leads dataset
  const availableProducts = useMemo(() => {
    const set = new Set();
    leads.forEach((l) => {
      if (l.product_interest && l.product_interest.trim()) {
        set.add(l.product_interest.trim());
      }
    });
    return Array.from(set).sort();
  }, [leads]);

  const availableSources = useMemo(() => {
    const set = new Set();
    leads.forEach((l) => {
      if (l.source && l.source.trim()) {
        set.add(l.source.trim());
      }
    });
    return Array.from(set).sort();
  }, [leads]);

  const availableStatuses = useMemo(() => {
    const set = new Set(BASE_STATUS_OPTIONS);
    leads.forEach((l) => {
      if (l.status && l.status.trim()) {
        set.add(l.status.trim());
      }
    });
    return Array.from(set);
  }, [leads]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    if (key === "status" && onStatusFilterChange) {
      onStatusFilterChange(value);
    }
  };

  const resetAllFilters = () => {
    setFilters({
      lead: "",
      contact: "",
      product: "All",
      source: "All",
      touchpoints: "All",
      status: "All",
      createdPreset: "all",
      createdFrom: "",
      createdTo: "",
    });
    setCurrentPage(1);
    if (onStatusFilterChange) {
      onStatusFilterChange("All");
    }
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.lead.trim()) count++;
    if (filters.contact.trim()) count++;
    if (filters.product !== "All") count++;
    if (filters.source !== "All") count++;
    if (filters.touchpoints !== "All") count++;
    if (filters.status !== "All") count++;
    if (filters.createdPreset !== "all") count++;
    return count;
  }, [filters]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. LEAD filter: name or lead ID
      if (filters.lead.trim()) {
        const q = filters.lead.trim().toLowerCase();
        const nameMatch = lead.lead_name && lead.lead_name.toLowerCase().includes(q);
        const idMatch = lead.name && lead.name.toLowerCase().includes(q);
        if (!nameMatch && !idMatch) return false;
      }

      // 2. CONTACT filter: mobile or email
      if (filters.contact.trim()) {
        const q = filters.contact.trim().toLowerCase();
        const mobileMatch = lead.mobile_no && lead.mobile_no.toLowerCase().includes(q);
        const emailMatch = lead.email && lead.email.toLowerCase().includes(q);
        if (!mobileMatch && !emailMatch) return false;
      }

      // 3. PRODUCT INTEREST filter
      if (filters.product !== "All") {
        if (!lead.product_interest) {
          if (filters.product !== "General") return false;
        } else if (lead.product_interest.toLowerCase() !== filters.product.toLowerCase()) {
          return false;
        }
      }

      // 4. SOURCE filter
      if (filters.source !== "All") {
        if (!lead.source || lead.source.toLowerCase() !== filters.source.toLowerCase()) {
          return false;
        }
      }

      // 5. TOUCHPOINTS filter
      if (filters.touchpoints === "with") {
        if (Number(lead.interaction_count || 0) <= 0) return false;
      } else if (filters.touchpoints === "without") {
        if (Number(lead.interaction_count || 0) > 0) return false;
      }

      // 6. STATUS filter
      if (filters.status !== "All") {
        if (lead.status !== filters.status) return false;
      }

      // 7. CREATED filter
      if (filters.createdPreset !== "all") {
        if (!matchesDateFilter(lead.creation, filters.createdPreset, filters.createdFrom, filters.createdTo)) {
          return false;
        }
      }

      // Optional: global search query passed from navbar
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesGlobal =
          (lead.lead_name && lead.lead_name.toLowerCase().includes(q)) ||
          (lead.mobile_no && lead.mobile_no.toLowerCase().includes(q)) ||
          (lead.email && lead.email.toLowerCase().includes(q)) ||
          (lead.product_interest && lead.product_interest.toLowerCase().includes(q)) ||
          (lead.name && lead.name.toLowerCase().includes(q));
        if (!matchesGlobal) return false;
      }

      return true;
    });
  }, [leads, filters, searchQuery]);

  const totalItems = filteredLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    setIsDeleting(true);
    try {
      await crmService.deleteLead(leadToDelete.name);
      if (onDeleteLead) {
        onDeleteLead(leadToDelete.name);
      }
      setLeadToDelete(null);
    } catch (err) {
      alert(err.message || "Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden flex flex-col relative">
      {/* Top Filter and Search Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Summary & Active Filters */}
        <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">All Leads</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#032e92] border border-blue-200/60">
              {totalItems} {totalItems === 1 ? "lead" : "leads"}
            </span>
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400 text-[10px]" />
              <span>Status:</span>
            </span>
            <CrmSelect
              value={filters.status || "All"}
              onChange={(val) => updateFilter("status", val)}
              options={[
                { value: "All", label: "All" },
                { value: "New", label: "New" },
                { value: "Interested", label: "Interested" },
                { value: "Nurturing", label: "Nurturing" },
                { value: "Converted", label: "Converted" },
                { value: "Not Interested", label: "Not Interested" },
              ]}
              size="sm"
              className="w-44"
            />
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                <FontAwesomeIcon icon={faFilter} className="text-amber-600 text-[10px]" />
                <span>{activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} active</span>
              </span>
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors hover:underline"
                title="Reset all filters"
              >
                <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                <span>Reset All</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Kanban & Add Lead Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {onOpenKanban && (
            <button
              type="button"
              onClick={onOpenKanban}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:bg-gray-50 text-[#032e92] shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
              title="Open Lead Pipeline (Kanban)"
            >
              <FontAwesomeIcon icon={faTableColumns} className="text-[#032e92] text-[11px]" />
              <span>Open Lead Pipeline (Kanban)</span>
            </button>
          )}

          <button
            onClick={() => onNewLead && onNewLead("New")}
            className="btn-ripple px-4 py-1.5 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Column Titles */}
            <tr className="bg-[#f8fafc] text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/80">
              <th className="py-3 px-4 sm:px-6 min-w-[200px]">Lead</th>
              <th className="py-3 px-4 min-w-[170px]">Contact</th>
              <th className="py-3 px-4 min-w-[150px]">Product Interest</th>
              <th className="py-3 px-4 min-w-[130px]">Source</th>
              <th className="py-3 px-4 text-center min-w-[140px]">Touchpoints</th>
              <th className="py-3 px-4 min-w-[140px]">Status</th>
              <th className="py-3 px-4 min-w-[160px]">Created</th>
              <th className="py-3 px-4 sm:px-6 text-right min-w-[110px]">Actions</th>
            </tr>

            {/* Column-wise Filter Row */}
            <tr className="bg-slate-50/90 border-b border-gray-200 text-xs">
              {/* 1. LEAD */}
              <th className="py-2 px-4 sm:px-6 font-normal">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={filters.lead}
                    onChange={(e) => updateFilter("lead", e.target.value)}
                    placeholder="Search name/ID..."
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92]/30 transition-all"
                  />
                  {filters.lead && (
                    <button
                      type="button"
                      onClick={() => updateFilter("lead", "")}
                      className="absolute right-2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                      title="Clear"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )}
                </div>
              </th>

              {/* 2. CONTACT */}
              <th className="py-2 px-4 font-normal">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={filters.contact}
                    onChange={(e) => updateFilter("contact", e.target.value)}
                    placeholder="Mobile / email..."
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92]/30 transition-all"
                  />
                  {filters.contact && (
                    <button
                      type="button"
                      onClick={() => updateFilter("contact", "")}
                      className="absolute right-2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                      title="Clear"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )}
                </div>
              </th>

              {/* 3. PRODUCT INTEREST */}
              <th className="py-2 px-4 font-normal">
                <select
                  value={filters.product}
                  onChange={(e) => updateFilter("product", e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-gray-700 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92]/30 cursor-pointer transition-all"
                >
                  <option value="All">All Products</option>
                  {availableProducts.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </th>

              {/* 4. SOURCE */}
              <th className="py-2 px-4 font-normal">
                <select
                  value={filters.source}
                  onChange={(e) => updateFilter("source", e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-gray-700 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92]/30 cursor-pointer transition-all"
                >
                  <option value="All">All Sources</option>
                  {availableSources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </th>

              {/* 5. TOUCHPOINTS */}
              <th className="py-2 px-4 font-normal">
                <select
                  value={filters.touchpoints}
                  onChange={(e) => updateFilter("touchpoints", e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-gray-700 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92]/30 cursor-pointer transition-all"
                >
                  <option value="All">All</option>
                  <option value="with">With Touchpoints</option>
                  <option value="without">Without Touchpoints</option>
                </select>
              </th>

              {/* 6. STATUS */}
              <th className="py-2 px-4 font-normal">
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-gray-700 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92]/30 cursor-pointer transition-all"
                >
                  <option value="All">All Statuses</option>
                  {availableStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </th>

              {/* 7. CREATED */}
              <th className="py-2 px-4 font-normal">
                <div className="flex flex-col gap-1">
                  <select
                    value={filters.createdPreset}
                    onChange={(e) => updateFilter("createdPreset", e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-gray-700 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92]/30 cursor-pointer transition-all"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="this_month">This Month</option>
                    <option value="custom">Custom Range...</option>
                  </select>
                  {filters.createdPreset === "custom" && (
                    <div className="flex items-center gap-1">
                      <input
                        type="date"
                        value={filters.createdFrom}
                        onChange={(e) => updateFilter("createdFrom", e.target.value)}
                        className="w-1/2 text-[10px] bg-white border border-gray-200 rounded p-1 text-gray-700 focus:outline-none focus:border-[#032e92]"
                        title="From Date"
                      />
                      <input
                        type="date"
                        value={filters.createdTo}
                        onChange={(e) => updateFilter("createdTo", e.target.value)}
                        className="w-1/2 text-[10px] bg-white border border-gray-200 rounded p-1 text-gray-700 focus:outline-none focus:border-[#032e92]"
                        title="To Date"
                      />
                    </div>
                  )}
                </div>
              </th>

              {/* 8. ACTIONS */}
              <th className="py-2 px-4 sm:px-6 text-right font-normal">
                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                    title="Reset all column filters"
                  >
                    <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                    <span>Reset</span>
                  </button>
                ) : (
                  <span className="text-gray-300 text-xs select-none">—</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {totalItems === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <FontAwesomeIcon icon={faFilter} className="text-sm" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No leads match the selected filters</p>
                    <p className="text-xs text-gray-400">Try adjusting your search criteria or resetting filters</p>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="mt-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#032e92] text-white hover:bg-[#021d63] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <FontAwesomeIcon icon={faRotateLeft} className="text-[10px]" />
                        <span>Reset All Filters</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const cleanPhone = lead.mobile_no ? lead.mobile_no.replace(/\D/g, "") : "";

                return (
                  <tr
                    key={lead.name}
                    onClick={() => onSelectLead && onSelectLead(lead.name)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-gray-900 group-hover:text-[#032e92] transition-colors">
                        {lead.lead_name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-gray-400 font-mono">{lead.name}</span>
                        {(() => {
                          const contactInfo = getContactStatus(
                            lead.last_contacted_on,
                            lead.days_since_contact,
                            lead.is_contact_overdue
                          );
                          if (contactInfo.isOverdue) {
                            return (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                                <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-[9px]" />
                                <span>{contactInfo.label}</span>
                              </span>
                            );
                          }
                          return (
                            <span className="text-[10px] text-gray-400">
                              · {contactInfo.label}
                            </span>
                          );
                        })()}
                      </div>
                      {lead.latest_remark && (
                        <p className="text-[11px] text-gray-600 italic mt-1 line-clamp-1">
                          <span className="font-semibold not-italic text-gray-700">Remark: </span>{lead.latest_remark}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-800">{lead.mobile_no || "—"}</div>
                      <div className="text-[11px] text-gray-400">{lead.email || ""}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-[#032e92] border border-blue-100">
                        {lead.product_interest || "General"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {lead.source || "—"}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full text-[11px]">
                        <FontAwesomeIcon icon={faCommentDots} className="text-blue-600 text-[10px]" />
                        <span>{lead.interaction_count}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGES[lead.status] || "bg-gray-100 text-gray-700"}`}>
                        {lead.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {lead.creation ? new Date(lead.creation).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {cleanPhone && (
                          <a
                            href={`tel:${cleanPhone}`}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#032e92] flex items-center justify-center transition-colors text-xs"
                            title="Call Lead"
                          >
                            <FontAwesomeIcon icon={faPhone} />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectLead && onSelectLead(lead.name)}
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-[#032e92] text-[#032e92] hover:text-white flex items-center justify-center transition-colors text-xs cursor-pointer"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadToDelete(lead)}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center transition-colors text-xs cursor-pointer"
                          title="Delete Lead"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:px-6 sm:py-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-[#f8fafc]/50">
        <div className="flex items-center gap-3 flex-wrap">
          <span>
            Showing <strong className="text-gray-800 font-semibold">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
            <strong className="text-gray-800 font-semibold">{endIndex}</strong> of{" "}
            <strong className="text-gray-800 font-semibold">{totalItems}</strong> leads
          </span>
          <div className="flex items-center gap-1.5 ml-2 border-l border-gray-200 pl-3">
            <span className="text-gray-400 text-[11px]">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs bg-white border border-gray-200 rounded-md py-0.5 px-1.5 text-gray-700 focus:outline-none focus:border-[#032e92]"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
              <span>Prev</span>
            </button>

            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="px-2 py-1 text-gray-400 select-none">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-[28px] h-7 px-2 rounded-md text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer border ${
                    currentPage === p
                      ? "bg-[#032e92] text-white border-[#032e92] shadow-2xs"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              disabled={currentPage === totalPages || totalItems === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium transition-colors"
            >
              <span>Next</span>
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Lead Confirmation Modal */}
      <AnimatePresence>
        {leadToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setLeadToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 text-center overflow-hidden z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />

              <div className="w-13 h-13 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center text-lg mx-auto mb-3.5 shadow-xs">
                <FontAwesomeIcon icon={faTrash} />
              </div>

              <h3 className="text-base font-bold text-gray-900 tracking-tight">
                Delete Lead?
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 mb-6 leading-relaxed">
                Are you sure you want to delete <strong className="text-gray-800 font-semibold">{leadToDelete.lead_name}</strong> ({leadToDelete.name})? This will permanently remove the lead and all its touchpoint history.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setLeadToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="btn-ripple flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isDeleting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Delete Lead</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
