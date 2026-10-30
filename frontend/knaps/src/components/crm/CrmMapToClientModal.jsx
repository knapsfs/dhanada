import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faLink,
  faMagnifyingGlass,
  faSpinner,
  faUserCheck,
  faCheckCircle,
  faTriangleExclamation,
  faPhone,
  faEnvelope,
  faIdCard,
  faShieldHalved,
  faArrowUpRightFromSquare,
  faBuilding,
  faUser,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { crmService } from "../../services/crmService";

export default function CrmMapToClientModal({
  isOpen,
  onClose,
  leadData,
  onMapped,
  onOpenClientProfile,
}) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedClients, setSuggestedClients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successResult, setSuccessResult] = useState(null);

  useEffect(() => {
    if (!isOpen || !leadData?.name) return;
    setSearchQuery("");
    setSelectedClient(null);
    setConfirming(false);
    setError("");
    setSuccessResult(null);
    loadSuggestions("");
  }, [isOpen, leadData?.name]);

  const loadSuggestions = async (q = "") => {
    if (!leadData?.name) return;
    setLoading(true);
    setError("");
    try {
      const res = await crmService.searchClientsForMapping(leadData.name, q);
      setSuggestedClients(res.suggested || []);
      setSearchResults(res.results || []);
    } catch (err) {
      setError(err.message || "Failed to search clients.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2 || val.trim().length === 0) {
      loadSuggestions(val.trim());
    }
  };

  const handleSelectClient = (client) => {
    if (client.is_current) {
      setError("This lead is already mapped to this client.");
      return;
    }
    setError("");
    setSelectedClient(client);
    setConfirming(true);
  };

  const handleConfirmMapping = async () => {
    if (!selectedClient || !leadData?.name) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await crmService.mapLeadToClient(leadData.name, selectedClient.name);
      setSuccessResult({
        client_id: selectedClient.name,
        client_name: selectedClient.client_name,
        message: res.message || "Lead mapped successfully!",
      });
      if (onMapped) {
        onMapped({
          ...leadData,
          client: selectedClient.name,
          client_name: selectedClient.client_name,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to map lead to client.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => (!submitting ? onClose() : null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/60 to-slate-50/40">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-[#032e92]/10 text-[#032e92] flex items-center justify-center text-base">
                <FontAwesomeIcon icon={faLink} />
              </span>
              <div>
                <h3 className="text-base font-bold text-gray-900">Map to Existing Client</h3>
                <p className="text-xs text-gray-500">
                  Link <span className="font-semibold text-gray-800">{leadData?.lead_name}</span>{" "}
                  ({leadData?.product_interest || "General Opportunity"}) to an existing client profile
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={submitting}
              className="w-8 h-8 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Success State */}
            {successResult ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shadow-inner">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900">Successfully Mapped!</h4>
                  <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                    Lead <span className="font-semibold text-gray-800">{leadData?.lead_name}</span> is
                    now linked to client{" "}
                    <span className="font-semibold text-gray-800">{successResult.client_name}</span> (
                    {successResult.client_id}).
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Lead conversations remain isolated to this lead while being aggregated on the client’s profile.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-center gap-3">
                  {onOpenClientProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenClientProfile(successResult.client_id);
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                    >
                      <span>Open Client Profile</span>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
                  >
                    Stay on Lead
                  </button>
                </div>
              </div>
            ) : confirming && selectedClient ? (
              /* Confirmation Screen */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Confirm Client Mapping</p>
                    <p className="text-amber-800 leading-relaxed">
                      You are about to map this opportunity (
                      <strong>{leadData?.product_interest || "Opportunity"}</strong>) to{" "}
                      <strong>{selectedClient.client_name}</strong> ({selectedClient.name}).
                    </p>
                    <p className="text-amber-700 text-[11px] leading-relaxed">
                      • The lead's opportunity details and interaction timeline will remain independent.
                      <br />
                      • The client's existing identity, KYC, and portfolio data will NOT be overwritten.
                      <br />• Conversations will be aggregated on the client profile with clear attribution.
                    </p>
                  </div>
                </div>

                {/* Target Client Summary Card */}
                <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#032e92] text-white flex items-center justify-center text-xs">
                        <FontAwesomeIcon
                          icon={selectedClient.client_type === "Organization" ? faBuilding : faUser}
                        />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{selectedClient.client_name}</h4>
                        <p className="text-[11px] text-gray-500 font-mono">{selectedClient.name}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {selectedClient.kyc_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-100 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-400">Mobile: </span>
                      <span className="font-medium text-gray-800">{selectedClient.mobile_no || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email: </span>
                      <span className="font-medium text-gray-800">{selectedClient.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">PAN: </span>
                      <span className="font-mono font-medium text-gray-800">
                        {selectedClient.pan || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk Profile: </span>
                      <span className="font-medium text-gray-800">
                        {selectedClient.risk_profile || "Not Assessed"}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirming(false);
                      setSelectedClient(null);
                    }}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
                  >
                    Back to Search
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmMapping}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                        <span>Mapping Lead...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                        <span>Confirm & Map</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Search & Candidate Selection View */
              <div className="space-y-5">
                {/* Search Bar */}
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by Client Name, Phone, Email, PAN, or Client ID..."
                    className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                  />
                  {loading && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin text-xs"
                    />
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Section A: Suggested Matches */}
                {suggestedClients.length > 0 && !searchQuery.trim() && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span>Suggested Matches ({suggestedClients.length})</span>
                      </h4>
                      <span className="text-[11px] text-gray-400">
                        Based on Lead phone, email, or name
                      </span>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {suggestedClients.map((client) => (
                        <ClientCandidateCard
                          key={client.name}
                          client={client}
                          onSelect={handleSelectClient}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Section B: Search Results */}
                {searchQuery.trim() && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Search Results ({searchResults.length})
                    </h4>

                    {searchResults.length === 0 && !loading ? (
                      <div className="py-8 text-center text-xs text-gray-500">
                        No matching clients found for "{searchQuery}".
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {searchResults.map((client) => (
                          <ClientCandidateCard
                            key={client.name}
                            client={client}
                            onSelect={handleSelectClient}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State when no query and no suggestions */}
                {!loading && suggestedClients.length === 0 && !searchQuery.trim() && (
                  <div className="py-8 text-center text-xs text-gray-500 space-y-1">
                    <p className="font-semibold text-gray-700">No automatic matches found</p>
                    <p className="text-gray-400">
                      Use the search bar above to look up existing clients by name, phone, email, or PAN.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Notice */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>
              Linking maintains a single client identity while preserving distinct lead pipelines.
            </span>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ClientCandidateCard({ client, onSelect }) {
  const isCurrent = Boolean(client.is_current);

  return (
    <div
      onClick={() => (!isCurrent ? onSelect(client) : null)}
      className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isCurrent
          ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
          : "bg-white border-gray-200 hover:border-[#032e92]/50 hover:bg-blue-50/30 cursor-pointer shadow-2xs hover:shadow-xs"
      }`}
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-xs text-gray-900 truncate">{client.client_name}</span>
          <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
            {client.name}
          </span>
          {client.match_reason && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              {client.match_reason}
            </span>
          )}
          {isCurrent && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Currently Linked
            </span>
          )}
        </div>

        <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[11px] text-gray-600">
          {client.mobile_no && (
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-[10px]" />
              <span>{client.mobile_no}</span>
            </span>
          )}
          {client.email && (
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 text-[10px]" />
              <span className="truncate max-w-[160px]">{client.email}</span>
            </span>
          )}
          {client.pan && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-slate-100 px-1.5 py-0.2 rounded text-slate-700">
              <FontAwesomeIcon icon={faIdCard} className="text-slate-400 text-[9px]" />
              <span>PAN: {client.pan}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-0.5">
          <span>KYC: <strong className="text-gray-700">{client.kyc_status}</strong></span>
          <span>•</span>
          <span>Risk: <strong className="text-gray-700">{client.risk_profile}</strong></span>
          {client.linked_leads_count > 0 && (
            <>
              <span>•</span>
              <span className="text-[#032e92] font-semibold">
                {client.linked_leads_count} other lead{client.linked_leads_count > 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 self-end sm:self-center">
        {isCurrent ? (
          <span className="text-[11px] text-gray-400 font-semibold px-3 py-1.5">Already Mapped</span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(client);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white transition-colors cursor-pointer shadow-2xs"
          >
            Select & Map
          </button>
        )}
      </div>
    </div>
  );
}
