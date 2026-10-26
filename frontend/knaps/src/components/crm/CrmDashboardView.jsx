import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faUserPlus, faUserCheck, faChartPie, faListCheck,
  faRotateRight, faPlus, faArrowRight, faCommentDots, faClock,
  faPhone, faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

export default function CrmDashboardView({
  metrics = {},
  leads = [],
  tasks = [],
  renewals = [],
  onSelectLead,
  onNewLead,
  onNewTask,
  onNavigateTab
}) {
  const recentLeads = leads.slice(0, 5);
  const openTasks = tasks.filter((t) => t.status === 'Open' || t.status === 'In Progress').slice(0, 4);
  const upcomingRenewals = renewals.filter((r) => r.status === 'Upcoming').slice(0, 4);

  const kpis = [
    { label: 'Total Leads', value: metrics.total_leads ?? 0, icon: faUsers, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', tab: 'leads' },
    { label: 'New Leads', value: metrics.new_leads ?? 0, icon: faUserPlus, color: 'text-[#032e92]', bg: 'bg-[#eef5ff]', border: 'border-blue-200', tab: 'leads' },
    { label: 'Interested', value: metrics.interested_leads ?? 0, icon: faChartPie, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', tab: 'leads' },
    { label: 'Converted Clients', value: metrics.converted_leads ?? 0, icon: faUserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', tab: 'clients' },
    { label: 'Total Clients', value: metrics.total_clients ?? 0, icon: faShieldHalved, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', tab: 'clients' },
    { label: 'Open Tasks', value: metrics.open_tasks ?? 0, icon: faListCheck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', tab: 'tasks' },
    { label: 'Upcoming Renewals', value: metrics.upcoming_renewals ?? 0, icon: faRotateRight, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', tab: 'renewals' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            onClick={() => onNavigateTab && onNavigateTab(kpi.tab)}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white border ${kpi.border} shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider truncate">
                {kpi.label}
              </span>
              <div className={`w-7 h-7 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center text-xs group-hover:scale-110 transition-transform`}>
                <FontAwesomeIcon icon={kpi.icon} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#032e92] transition-colors">
              {kpi.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-[#f8fafc] rounded-2xl p-4 border border-gray-200/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Quick Actions:</span>
          <button
            onClick={() => onNewLead && onNewLead('New')}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#032e92] hover:bg-blue-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            <span>Create Lead</span>
          </button>
          <button
            onClick={() => onNewTask && onNewTask()}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
            <span>Create Task</span>
          </button>
        </div>

        <button
          onClick={() => onNavigateTab && onNavigateTab('leads', 'kanban')}
          className="text-xs font-bold text-[#032e92] hover:underline flex items-center gap-1 cursor-pointer ml-auto"
        >
          <span>Open Lead Pipeline (Kanban)</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
        </button>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (60%): Recent Inquiries */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">Recent Inquiries & Leads</h3>
              <p className="text-xs text-gray-400 font-medium">Newest prospects entering the CRM</p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('leads')}
              className="text-xs font-bold text-[#032e92] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {recentLeads.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400">
                No recent leads available.
              </div>
            ) : (
              recentLeads.map((lead) => {
                const cleanPhone = lead.mobile_no ? lead.mobile_no.replace(/\D/g, '') : '';
                const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                return (
                  <div
                    key={lead.name}
                    onClick={() => onSelectLead && onSelectLead(lead.name)}
                    className="p-4 hover:bg-blue-50/40 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#032e92] transition-colors truncate">
                          {lead.lead_name}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#032e92] border border-blue-100">
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 truncate">
                        <span>{lead.product_interest || 'General'}</span>
                        <span>•</span>
                        <span>{lead.mobile_no || 'No Phone'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {cleanPhone && (
                        <button
                          type="button"
                          onClick={() => onSelectLead && onSelectLead(lead.name)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors text-[11px] font-bold cursor-pointer"
                          title="Open Lead WhatsApp Conversations"
                        >
                          WhatsApp
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectLead && onSelectLead(lead.name)}
                        className="px-3 py-1 rounded-lg bg-blue-50 text-[#032e92] hover:bg-[#032e92] hover:text-white transition-colors text-xs font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (40%): Action Center */}
        <div className="lg:col-span-5 space-y-6">
          {/* Open Tasks Widget */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faListCheck} className="text-[#032e92] text-xs" />
                <h3 className="text-xs font-bold text-gray-900">Upcoming Follow-up Tasks</h3>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('tasks')}
                className="text-xs font-bold text-[#032e92] hover:underline cursor-pointer"
              >
                View
              </button>
            </div>

            <div className="p-3 divide-y divide-gray-100">
              {openTasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  No pending follow-ups. Great job!
                </div>
              ) : (
                openTasks.map((t) => (
                  <div key={t.name} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-gray-900 truncate">{t.title}</h5>
                      <span className="text-[10px] text-gray-400 font-medium">Due: {t.due_date} ({t.activity_type})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 shrink-0">
                      {t.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Renewals Widget */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faRotateRight} className="text-[#032e92] text-xs" />
                <h3 className="text-xs font-bold text-gray-900">Approaching Renewals</h3>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('renewals')}
                className="text-xs font-bold text-[#032e92] hover:underline cursor-pointer"
              >
                View
              </button>
            </div>

            <div className="p-3 divide-y divide-gray-100">
              {upcomingRenewals.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  No upcoming renewals for this period.
                </div>
              ) : (
                upcomingRenewals.map((r) => (
                  <div key={r.name} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-gray-900 truncate">{r.client_name || r.client}</h5>
                      <span className="text-[10px] text-gray-400 font-medium">{r.product_name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#032e92] shrink-0">
                      {r.renewal_date}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
