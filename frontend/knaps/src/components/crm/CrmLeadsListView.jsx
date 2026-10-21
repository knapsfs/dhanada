import CrmSelect from "./CrmSelect";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone, faEnvelope, faCommentDots, faEye, faFilter,
  faSearch, faPlus, faArrowsRotate, faTrash, faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { crmService } from "../../services/crmService";

const STATUS_BADGES = {
  New: "bg-blue-50 text-[#032e92] border-blue-200",
  Interested: "bg-amber-50 text-amber-700 border-amber-200",
  Nurturing: "bg-purple-50 text-purple-700 border-purple-200",
  Converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Not Interested": "bg-gray-100 text-gray-700 border-gray-300",
  Junk: "bg-red-50 text-red-700 border-red-200",
};

export default function CrmLeadsListView({
  leads = [],
  onSelectLead,
  selectedStatus,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  onNewLead,
  onDeleteLead,
}) {
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredLeads = leads.filter((l) => {
    if (selectedProduct !== "All" && l.product_interest !== selectedProduct) return false;
    return true;
  });

  const uniqueProducts = Array.from(new Set(leads.map((l) => l.product_interest).filter(Boolean)));

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
        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["All", "New", "Interested", "Nurturing", "Converted", "Not Interested"].map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange && onStatusFilterChange(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === st
                  ? "bg-[#032e92] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Product Filter & New Lead Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {uniqueProducts.length > 0 && (
            <CrmSelect
              value={selectedProduct}
              onChange={(val) => setSelectedProduct(val)}
              options={[{ value: "All", label: "All Products" }, ...uniqueProducts.map((p) => ({ value: p, label: p }))]}
              size="sm"
              className="w-44"
            />
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
            <tr className="bg-[#f8fafc] text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/80">
              <th className="py-3 px-4 sm:px-6">Lead</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Product Interest</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4 text-center">Touchpoints</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-400 font-medium">
                  No leads found matching current filter or search criteria.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const cleanPhone = lead.mobile_no ? lead.mobile_no.replace(/\D/g, "") : "";
                const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

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
                      <span className="text-[10px] text-gray-400 font-mono">{lead.name}</span>
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
                          <>
                            <a
                              href={`tel:${cleanPhone}`}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-[#032e92] flex items-center justify-center transition-colors text-xs"
                              title="Call Lead"
                            >
                              <FontAwesomeIcon icon={faPhone} />
                            </a>
                            <a
                              href={`https://wa.me/${waPhone}?text=Hello%20${encodeURIComponent(lead.lead_name || "")},%20this%20is%20KNAPS%20Financial%20Advisory.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors text-[10px] font-bold"
                              title="WhatsApp"
                            >
                              WA
                            </a>
                          </>
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
