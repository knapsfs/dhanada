import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faUserPlus, faUserCheck, faChartPie, faListCheck,
  faRotateRight, faSearch, faPlus, faArrowsRotate, faArrowRight,
  faShieldHalved, faTableColumns, faList, faCommentDots, faArrowUpRightFromSquare,
  faRightFromBracket, faBuilding, faBars, faXmark, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { crmService } from '../services/crmService';

// CRM Views
import CrmDashboardView from '../components/crm/CrmDashboardView';
import CrmPipelineView from '../components/crm/CrmPipelineView';
import CrmLeadsListView from '../components/crm/CrmLeadsListView';
import CrmClientsView from '../components/crm/CrmClientsView';
import CrmTasksView from '../components/crm/CrmTasksView';
import CrmRenewalsView from '../components/crm/CrmRenewalsView';

// Modals & Drawer
import CrmLeadDetailView from '../components/crm/CrmLeadDetailView';
import CrmNewLeadModal from '../components/crm/CrmNewLeadModal';
import CrmNewInteractionModal from '../components/crm/CrmNewInteractionModal';
import CrmNewTaskModal from '../components/crm/CrmNewTaskModal';
// CrmLoginForm superseded by Frappe native /login

export default function KnapsCrmPortal() {
  const [activeTab, setActiveTab] = useState('pipeline'); // dashboard, pipeline, leads, clients, tasks, renewals
  const [bootstrapData, setBootstrapData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);

  // Modals state
  const [selectedLeadName, setSelectedLeadName] = useState(null);
  const [leadRefreshKey, setLeadRefreshKey] = useState(0);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalTargetLead, setModalTargetLead] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadCrmData();
  }, []);

  const loadCrmData = async () => {
    setLoading(true);
    try {
      const bData = await crmService.getBootstrap();
      if (!bData || !bData.user || bData.user.name === "Guest") {
        setBootstrapData(null);
        setAuthRequired(true);
        window.location.href = "/login?redirect-to=%2Fknaps-crm";
        return;
      }
      setBootstrapData(bData);
      setAuthRequired(false);

      const [lData, cData, tData, rData] = await Promise.all([
        crmService.getLeads().catch(() => []),
        crmService.getClients().catch(() => []),
        crmService.getTasks().catch(() => []),
        crmService.getRenewals().catch(() => []),
      ]);

      setLeads(lData);
      setClients(cData);
      setTasks(tData);
      setRenewals(rData);
    } catch (err) {
      console.warn("CRM Auth/Data load failed:", err);
      setBootstrapData(null);
      setAuthRequired(true);
      window.location.href = "/login?redirect-to=%2Fknaps-crm";
    } finally {
      setLoading(false);
    }
  };

  const triggerLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await crmService.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setLoggingOut(false);
      setIsLogoutModalOpen(false);
      setBootstrapData(null);
      setAuthRequired(true);
      setLeads([]);
      setClients([]);
      setTasks([]);
      setRenewals([]);
      window.location.href = "/login?redirect-to=%2Fknaps-crm";
    }
  };

  const handleLeadCreated = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
    loadCrmData();
  };

  const handleLeadDeleted = (deletedLeadName) => {
    setLeads((prev) => prev.filter((l) => l.name !== deletedLeadName));
    if (selectedLeadName === deletedLeadName) {
      setSelectedLeadName(null);
    }
    loadCrmData();
  };

  const handleLeadUpdated = (updatedLead) => {
    setLeads((prev) => prev.map((l) => (l.name === updatedLead.name ? { ...l, ...updatedLead } : l)));
    loadCrmData();
  };

  const handleClientUpdated = (updatedClient) => {
    setClients((prev) => prev.map((c) => (c.name === updatedClient.name ? { ...c, ...updatedClient } : c)));
    loadCrmData();
  };

  const handleStatusChange = async (leadName, newStatus) => {
    try {
      const updated = await crmService.updateLeadStatus(leadName, newStatus);
      handleLeadUpdated(updated);
    } catch (err) {
      alert(err.message || 'Failed to update lead status');
    }
  };

  const handleTaskToggle = async (taskName, newStatus) => {
    try {
      const updated = await crmService.updateTaskStatus(taskName, newStatus);
      setTasks((prev) => prev.map((t) => (t.name === updated.name ? updated : t)));
      loadCrmData();
    } catch (err) {
      alert(err.message || 'Failed to update task');
    }
  };

  const handleOpenInteractionModal = (lead) => {
    setModalTargetLead(lead);
    setIsInteractionModalOpen(true);
  };

  const handleOpenTaskModal = (lead) => {
    setModalTargetLead(lead);
    setIsTaskModalOpen(true);
  };

  // Pipeline leads: filtered only by search query so all Kanban status columns remain visible
  const pipelineLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter((l) =>
      (l.lead_name && l.lead_name.toLowerCase().includes(q)) ||
      (l.mobile_no && l.mobile_no.includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.product_interest && l.product_interest.toLowerCase().includes(q)) ||
      (l.name && l.name.toLowerCase().includes(q))
    );
  }, [leads, searchQuery]);

  // Filtered Leads based on search and status
  const displayedLeads = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter !== 'All' && l.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (l.lead_name && l.lead_name.toLowerCase().includes(q)) ||
        (l.mobile_no && l.mobile_no.includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.product_interest && l.product_interest.toLowerCase().includes(q)) ||
        (l.name && l.name.toLowerCase().includes(q))
      );
    });
  }, [leads, statusFilter, searchQuery]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: faChartPie },
    { id: 'pipeline', label: 'Lead Pipeline', icon: faTableColumns, badge: leads.filter(l => l.status === 'New').length },
    { id: 'leads', label: 'All Leads', icon: faUsers, badge: leads.length },
    { id: 'clients', label: 'Clients', icon: faUserCheck, badge: clients.length },
    { id: 'tasks', label: 'Tasks & Follow-ups', icon: faListCheck, badge: tasks.filter(t => t.status === 'Open').length },
    { id: 'renewals', label: 'Renewals', icon: faRotateRight, badge: renewals.filter(r => r.status === 'Upcoming').length },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#021d63] text-white">
        <div className="flex flex-col items-center gap-3">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-blue-400" />
          <p className="text-sm font-medium tracking-wide text-blue-200">Loading KNAPS CRM...</p>
        </div>
      </div>
    );
  }

  if (authRequired || !bootstrapData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#021d63] text-white">
        <div className="flex flex-col items-center gap-3">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-blue-400" />
          <p className="text-sm font-medium tracking-wide text-blue-200">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f7fc] font-sans text-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'
          } bg-[#021d63] text-white flex flex-col transition-all duration-300 ease-in-out shrink-0 z-30 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}favicon.svg`}
              alt="KNAPS Logo"
              className="w-9 h-9 object-contain rounded-xl shrink-0"
            />
            {isSidebarOpen && (
              <div className="truncate">
                <span className="font-bold text-sm tracking-wide text-white block leading-tight">KNAPS CRM</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xs"
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faXmark : faBars} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                setActiveTab(item.id);
                setSelectedLeadName(null);
              }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                  ? 'bg-white/15 text-white shadow-xs font-bold'
                  : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <FontAwesomeIcon icon={item.icon} className={`text-sm ${isActive ? 'text-white' : 'text-blue-200/70'}`} />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </div>
                {isSidebarOpen && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-[#032e92]' : 'bg-white/20 text-white'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile & Desk Link */}
        <div className="p-3 border-t border-white/10 space-y-2 bg-black/10">
          <a
            href="/desk"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs shrink-0" />
            {isSidebarOpen && <span className="truncate">Go to Frappe Desk</span>}
          </a>

          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-[#032e92] border border-white/30 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {bootstrapData?.user?.full_name?.charAt(0) || 'A'}
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {bootstrapData?.user?.full_name || 'Advisor'}
                  </p>
                  <p className="text-[10px] text-blue-300 truncate">
                    {bootstrapData?.user?.email || 'admin@example.com'}
                  </p>
                </div>
              )}
            </div>

            {isSidebarOpen ? (
              <button
                type="button"
                onClick={triggerLogoutConfirm}
                title="Logout"
                className="text-white/50 hover:text-white p-1 transition-colors text-xs ml-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            ) : (
              <button
                type="button"
                onClick={triggerLogoutConfirm}
                title="Logout"
                className="text-white/50 hover:text-white p-1 transition-colors text-xs cursor-pointer"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 capitalize whitespace-nowrap">
              {selectedLeadName ? (
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLeadName(null)}
                    className="text-gray-400 hover:text-[#032e92] transition-colors cursor-pointer text-xs"
                    title="Back to list"
                  >
                    {navItems.find((n) => n.id === activeTab)?.label || 'Leads'}
                  </button>
                  <span className="text-gray-300">/</span>
                  <span className="text-[#032e92]">Lead Profile</span>
                </span>
              ) : (
                navItems.find((n) => n.id === activeTab)?.label || 'CRM'
              )}
            </h1>

            {/* Global Search Bar */}
            <div className="relative flex-1 hidden sm:block">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search leads, mobile, email, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadCrmData}
              disabled={loading}
              className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#032e92] hover:bg-gray-100 transition-colors text-xs cursor-pointer"
              title="Refresh CRM Data"
            >
              <FontAwesomeIcon icon={faArrowsRotate} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={triggerLogoutConfirm}
              className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors text-xs cursor-pointer"
              title="Logout from CRM"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </button>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="hidden sm:flex px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <FontAwesomeIcon icon={faListCheck} className="text-gray-500" />
              <span>New Task</span>
            </button>

            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="btn-ripple px-4 py-2 rounded-xl text-xs font-bold bg-[#032e92] hover:bg-[#021d63] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              <span>Create Lead</span>
            </button>
          </div>
        </header>

        {/* View Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {selectedLeadName ? (
            <CrmLeadDetailView
              leadName={selectedLeadName}
              onBack={() => setSelectedLeadName(null)}
              onLeadUpdated={handleLeadUpdated}
              onDeleteLead={handleLeadDeleted}
              onLogInteraction={handleOpenInteractionModal}
              onNewTask={handleOpenTaskModal}
              refreshKey={leadRefreshKey}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <CrmDashboardView
                  metrics={bootstrapData?.metrics || {}}
                  leads={leads}
                  tasks={tasks}
                  renewals={renewals}
                  onSelectLead={(name) => setSelectedLeadName(name)}
                  onNewLead={() => setIsLeadModalOpen(true)}
                  onNewTask={() => setIsTaskModalOpen(true)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'pipeline' && (
                <CrmPipelineView
                  leads={pipelineLeads}
                  onSelectLead={(name) => setSelectedLeadName(name)}
                  onStatusChange={handleStatusChange}
                  onNewLead={() => setIsLeadModalOpen(true)}
                />
              )}

              {activeTab === 'leads' && (
                <CrmLeadsListView
                  leads={displayedLeads}
                  onSelectLead={(name) => setSelectedLeadName(name)}
                  selectedStatus={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onNewLead={() => setIsLeadModalOpen(true)}
                  onDeleteLead={handleLeadDeleted}
                />
              )}

              {activeTab === 'clients' && (
                <CrmClientsView
                  clients={clients}
                  loading={loading}
                  onClientUpdated={handleClientUpdated}
                />
              )}

              {activeTab === 'tasks' && (
                <CrmTasksView
                  tasks={tasks}
                  onToggleComplete={handleTaskToggle}
                  onNewTask={() => setIsTaskModalOpen(true)}
                  loading={loading}
                />
              )}

              {activeTab === 'renewals' && (
                <CrmRenewalsView renewals={renewals} loading={loading} />
              )}
            </>
          )}
        </main>
      </div>

      {/* New Lead Modal */}
      <CrmNewLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onCreated={handleLeadCreated}
        sources={bootstrapData?.sources || []}
        products={bootstrapData?.products || []}
      />

      {/* New Interaction Modal */}
      <CrmNewInteractionModal
        isOpen={isInteractionModalOpen}
        onClose={() => {
          setIsInteractionModalOpen(false);
          setModalTargetLead(null);
        }}
        onLogged={() => {
          loadCrmData();
          setLeadRefreshKey((k) => k + 1);
        }}
        relatedLead={modalTargetLead}
      />

      {/* New Task Modal */}
      <CrmNewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setModalTargetLead(null);
        }}
        onCreated={() => {
          loadCrmData();
          setLeadRefreshKey((k) => k + 1);
        }}
        relatedLead={modalTargetLead}
      />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loggingOut && setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-7 text-center overflow-hidden z-10"
            >
              {/* Top Gradient Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-[#032e92]" />

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center text-xl mx-auto mb-4 shadow-xs">
                <FontAwesomeIcon icon={faRightFromBracket} />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Are you sure you want to log out?
              </h3>
              <p className="text-xs text-gray-500 mt-2 mb-6 leading-relaxed">
                You will need to enter your credentials again to access your CRM leads, client portfolios, and follow-ups.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleConfirmLogout}
                  className="btn-ripple flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loggingOut ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <span>Yes, Log Out</span>
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
