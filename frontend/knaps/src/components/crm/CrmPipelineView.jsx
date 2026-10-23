import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone, faEllipsisVertical, faCommentDots, faCalendarAlt,
  faPlus, faCheckCircle, faArrowsRotate, faTriangleExclamation, faTableColumns, faList
} from '@fortawesome/free-solid-svg-icons';
import { getContactStatus } from '../../utils/crmContactUtils';

const STAGES = [
  { id: 'New', label: 'New Inquiries', color: 'bg-blue-500', headerBg: 'bg-blue-50/80 text-blue-900 border-blue-200' },
  { id: 'Interested', label: 'Interested / Qualified', color: 'bg-amber-500', headerBg: 'bg-amber-50/80 text-amber-900 border-amber-200' },
  { id: 'Nurturing', label: 'Nurturing / In Follow-up', color: 'bg-purple-500', headerBg: 'bg-purple-50/80 text-purple-900 border-purple-200' },
  { id: 'Converted', label: 'Converted to Client', color: 'bg-emerald-500', headerBg: 'bg-emerald-50/80 text-emerald-900 border-emerald-200' },
  { id: 'Not Interested', label: 'Not Interested / Lost', color: 'bg-gray-400', headerBg: 'bg-gray-100 text-gray-800 border-gray-200' },
];

export default function CrmPipelineView({
  leads = [],
  onSelectLead,
  onStatusChange,
  onNewLead,
  onToggleView,
}) {
  const [activeMenuLead, setActiveMenuLead] = useState(null);

  const getLeadsByStage = (stageId) => {
    return leads.filter((l) => l.status === stageId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Header / View Switcher Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3.5 sm:p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#032e92] flex items-center justify-center text-xs">
            <FontAwesomeIcon icon={faTableColumns} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 leading-tight">Lead Pipeline (Kanban)</h3>
            <p className="text-[11px] text-gray-400 font-medium">Stage-by-stage visual lead management</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {onToggleView && (
            <button
              type="button"
              onClick={() => onToggleView("list")}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
              title="Switch to Table / List View"
            >
              <FontAwesomeIcon icon={faList} className="text-gray-500 text-[11px]" />
              <span>Table View</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNewLead && onNewLead("New")}
            className="btn-ripple px-4 py-1.5 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex-1 overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1280px] h-full items-start">
          {STAGES.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);

            return (
              <div
                key={stage.id}
                className="w-80 shrink-0 bg-[#f8fafc] rounded-2xl border border-gray-200/80 flex flex-col max-h-[calc(100vh-210px)]"
              >
                {/* Column Header */}
                <div className={`p-3.5 rounded-t-2xl border-b ${stage.headerBg} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                    <h3 className="text-xs font-bold tracking-tight">{stage.label}</h3>
                    <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/90 shadow-2xs">
                      {stageLeads.length}
                    </span>
                  </div>

                  <button
                    onClick={() => onNewLead && onNewLead(stage.id)}
                    className="w-6 h-6 rounded-lg bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center text-xs transition-colors shadow-2xs cursor-pointer"
                    title={`Add new lead to ${stage.label}`}
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                  </button>
                </div>

                {/* Cards List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      No leads in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const cleanPhone = lead.mobile_no ? lead.mobile_no.replace(/\D/g, '') : '';
                      const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                      return (
                        <motion.div
                          key={lead.name}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => onSelectLead && onSelectLead(lead.name)}
                          className="bg-white rounded-xl p-3.5 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-[#032e92]/40 transition-all cursor-pointer relative group"
                        >
                          {/* Card Top Row */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#032e92] transition-colors truncate">
                                {lead.lead_name}
                              </h4>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{lead.name}</p>
                            </div>

                            {/* Stage Switch Dropdown Menu */}
                            <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => setActiveMenuLead(activeMenuLead === lead.name ? null : lead.name)}
                                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center text-xs transition-colors cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </button>

                              {activeMenuLead === lead.name && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-30">
                                  <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1">Move to:</div>
                                  {STAGES.map((s) => (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onClick={() => {
                                        onStatusChange && onStatusChange(lead.name, s.id);
                                        setActiveMenuLead(null);
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors ${lead.status === s.id ? 'text-[#032e92] font-bold' : 'text-gray-700'}`}
                                    >
                                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                                      <span className="truncate">{s.label}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product of Interest Pill */}
                          <div className="mb-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-[#032e92] border border-blue-100/80 truncate max-w-full">
                              {lead.product_interest || 'General Advisory'}
                            </span>
                          </div>

                          {/* Contact Overdue Warning / Status Badge */}
                          {(() => {
                            const contactInfo = getContactStatus(
                              lead.last_contacted_on,
                              lead.days_since_contact,
                              lead.is_contact_overdue
                            );
                            return (
                              <div className="mb-2">
                                {contactInfo.isOverdue ? (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-[10px]" />
                                    <span>{contactInfo.label}</span>
                                  </span>
                                ) : contactInfo.status === 'never_contacted' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500">
                                    <span>{contactInfo.label}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50/70 text-blue-700">
                                    <span>{contactInfo.label}</span>
                                  </span>
                                )}
                              </div>
                            );
                          })()}

                          {/* Latest Remark Preview if any */}
                          {lead.latest_remark && (
                            <div className="mb-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2 text-[11px] text-gray-700 leading-snug">
                              <span className="font-bold text-gray-500 block text-[9px] uppercase tracking-wider mb-0.5">Latest Remark</span>
                              <p className="line-clamp-2 italic text-gray-800 font-medium">"{lead.latest_remark}"</p>
                            </div>
                          )}

                          {/* Notes Preview if any */}
                          {lead.notes && (
                            <p className="text-[11px] text-gray-500 line-clamp-2 mb-2 leading-relaxed bg-gray-50/80 p-2 rounded-lg">
                              {lead.notes}
                            </p>
                          )}

                          {/* Card Footer: Quick Actions & Date */}
                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 text-[11px] text-gray-400">
                            <span>
                              {lead.creation ? new Date(lead.creation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                            </span>

                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {lead.interaction_count > 0 && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mr-1">
                                  <FontAwesomeIcon icon={faCommentDots} className="text-[10px] text-blue-600" />
                                  <span>{lead.interaction_count}</span>
                                </span>
                              )}

                              {cleanPhone && (
                                <>
                                  <a
                                    href={`tel:${cleanPhone}`}
                                    className="w-6 h-6 rounded-md bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-[#032e92] flex items-center justify-center transition-colors"
                                    title="Call Lead"
                                  >
                                    <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                                  </a>
                                  <a
                                    href={`https://wa.me/${waPhone}?text=Hello%20${encodeURIComponent(lead.lead_name || '')},%20this%20is%20KNAPS%20Financial%20Advisory.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-6 h-6 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors font-bold text-[10px]"
                                    title="WhatsApp Chat"
                                  >
                                    WA
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
