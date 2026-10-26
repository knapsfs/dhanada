import CrmSelect from './CrmSelect';
import CrmSendFormModal from './CrmSendFormModal';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark, faPhone, faEnvelope, faPaperPlane, faUserCheck,
  faCommentDots, faListCheck, faSpinner,
  faShieldHalved, faCheckCircle, faCircleExclamation,
  faTriangleExclamation, faClock, faFloppyDisk, faUser
} from '@fortawesome/free-solid-svg-icons';
import { crmService } from '../../services/crmService';
import { getContactStatus, formatContactDate } from '../../utils/crmContactUtils';

const STATUS_COLORS = {
  New: 'bg-blue-50 text-[#032e92] border-blue-200',
  Interested: 'bg-amber-50 text-amber-700 border-amber-200',
  Nurturing: 'bg-purple-50 text-purple-700 border-purple-200',
  Converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Not Interested': 'bg-gray-100 text-gray-700 border-gray-300',
  Junk: 'bg-red-50 text-red-700 border-red-200',
};

export default function CrmLeadDrawer({ leadName, isOpen, onClose, onLeadUpdated, onLogInteraction, onNewTask }) {
  const [leadData, setLeadData] = useState(null);
  const [sendFormModalOpen, setSendFormModalOpen] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, timeline, tasks
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [remarkText, setRemarkText] = useState('');
  const [savingRemark, setSavingRemark] = useState(false);

  useEffect(() => {
    if (!isOpen || !leadName) return;
    loadDetails();
  }, [isOpen, leadName]);

  const isWelcomeSent = leadData?.welcome_email_status === 'Sent';

  const loadDetails = async (preserveFeedback = false) => {
    setLoading(true);
    if (!preserveFeedback) {
      setFeedback({ type: '', message: '' });
    }
    try {
      const res = await crmService.getLeadDetails(leadName);
      setLeadData(res.lead);
      setInteractions(res.interactions || []);
      setTasks(res.tasks || []);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load lead details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!leadData || leadData.status === newStatus) return;
    setActionLoading('status');
    try {
      const updated = await crmService.updateLeadStatus(leadData.name, newStatus);
      setLeadData(updated);
      onLeadUpdated && onLeadUpdated(updated);
      setFeedback({ type: 'success', message: `Lead status updated to ${newStatus}` });
      await loadDetails(true);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading('');
    }
  };

  const handleSendWelcome = async () => {
    if (isWelcomeSent) {
      setFeedback({ type: 'info', message: 'Welcome email has already been sent to this lead.' });
      return;
    }
    setActionLoading('welcome');
    try {
      await crmService.sendWelcomeEmail(leadData.name);
      setFeedback({ type: 'success', message: 'Welcome email queued successfully!' });
      await loadDetails(true);
      if (onLeadUpdated) {
        onLeadUpdated({ ...leadData, welcome_email_status: 'Sent' });
      }
    } catch (err) {
      if (
        err.status === 409 ||
        (err.message && (
          err.message.toLowerCase().includes('already been sent') ||
          err.message.toLowerCase().includes('duplicate')
        ))
      ) {
        setFeedback({ type: 'info', message: 'Welcome email has already been sent to this lead.' });
      } else {
        setFeedback({ type: 'error', message: err.message || 'Failed to send welcome email.' });
      }
      await loadDetails(true);
    } finally {
      setActionLoading('');
    }
  };

  const handleSendProfiler = async () => {
    if (actionLoading) return;
    setActionLoading('profiler');
    try {
      await crmService.sendRiskProfiler(leadData.name);
      setFeedback({ type: 'success', message: 'Risk Profiler link sent successfully!' });
      await loadDetails(true);
      if (onLeadUpdated) {
        onLeadUpdated({ ...leadData, risk_profiler_status: 'Sent' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to send Risk Profiler link.' });
      await loadDetails(true);
    } finally {
      setActionLoading('');
    }
  };

  const handleSendOnboarding = async () => {
    setActionLoading('onboarding');
    try {
      await crmService.sendOnboardingAndProfiler(leadData.name);
      setFeedback({ type: 'success', message: 'Onboarding & Risk Profiler links sent!' });
      await loadDetails(true);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading('');
    }
  };

  const handleConvertClient = async () => {
    if (!window.confirm(`Convert ${leadData.lead_name} into a formal KNAPS Client?`)) return;
    setActionLoading('convert');
    try {
      const res = await crmService.convertToClient(leadData.name);
      setFeedback({ type: 'success', message: `Lead successfully converted to Client ${res.client_id || ''}!` });
      await loadDetails(true);
      onLeadUpdated && onLeadUpdated({ ...leadData, status: 'Converted' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading('');
    }
  };

  const handleSaveRemark = async (e) => {
    e?.preventDefault();
    if (!remarkText.trim()) {
      setFeedback({ type: 'error', message: 'Remark text cannot be empty.' });
      return;
    }
    setSavingRemark(true);
    try {
      const res = await crmService.saveContactRemark('Lead', leadData.name, remarkText.trim());
      setFeedback({ type: 'success', message: 'Latest remark and contact timestamp saved successfully!' });
      setRemarkText('');
      const updatedLead = {
        ...leadData,
        latest_remark: res.latest_remark,
        last_contacted_by: res.last_contacted_by,
        last_contacted_on: res.last_contacted_on,
        days_since_contact: res.days_since_contact,
        is_contact_overdue: res.is_contact_overdue,
      };
      setLeadData(updatedLead);
      onLeadUpdated && onLeadUpdated(updatedLead);
      await loadDetails(true);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save remark' });
    } finally {
      setSavingRemark(false);
    }
  };

  if (!isOpen) return null;

  const cleanPhone = leadData?.mobile_no ? leadData.mobile_no.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        />

        {/* Slide-over panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="w-screen max-w-xl sm:max-w-2xl bg-white shadow-2xl flex flex-col border-l border-gray-200"
          >
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 bg-[#f8fafc] border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span className="font-mono text-[11px] font-semibold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {leadData?.name || leadName}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_COLORS[leadData?.status] || 'bg-gray-100 text-gray-700'}`}>
                      {leadData?.status || 'Loading...'}
                    </span>
                    {leadData?.source && (
                      <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        via {leadData.source}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    {leadData?.lead_name || 'Lead Details'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    {leadData?.product_interest || 'General Financial Advisory'}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer shrink-0"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-base" />
                </button>
              </div>

              {/* Status Change & Quick Contact Bar */}
              <div className="mt-4 pt-4 border-t border-gray-200/80 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">Stage:</span>
                  <CrmSelect
                    value={leadData?.status || 'New'}
                    disabled={actionLoading === 'status'}
                    onChange={(val) => handleStatusChange(val)}
                    options={['New', 'Interested', 'Nurturing', 'Converted', 'Not Interested', 'Junk']}
                    size="sm"
                    className="w-36"
                  />
                </div>

                {/* Direct Connect Buttons */}
                <div className="flex items-center gap-1.5">
                  {cleanPhone && (
                    <>
                      <a
                        href={`tel:${cleanPhone}`}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#032e92] hover:border-[#032e92] transition-colors text-xs flex items-center gap-1.5 shadow-2xs"
                        title="Call Lead"
                      >
                        <FontAwesomeIcon icon={faPhone} />
                        <span className="hidden sm:inline font-semibold">Call</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          if (onLeadUpdated) onLeadUpdated(leadData);
                        }}
                        className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <span className="font-bold">WhatsApp</span>
                      </button>
                    </>
                  )}
                  {leadData?.email && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onLeadUpdated) onLeadUpdated(leadData);
                      }}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:text-[#032e92] hover:border-[#032e92] transition-colors text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Send Email"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Ribbon */}
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSendWelcome}
                  disabled={actionLoading === 'welcome' || isWelcomeSent}
                  title={isWelcomeSent ? 'Welcome email has already been sent' : 'Send Welcome Email'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 shadow-2xs transition-colors ${
                    isWelcomeSent
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50'
                  }`}
                >
                  {actionLoading === 'welcome' ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                  ) : (
                    <FontAwesomeIcon
                      icon={isWelcomeSent ? faCheckCircle : faPaperPlane}
                      className={isWelcomeSent ? 'text-emerald-600' : 'text-[#032e92]'}
                    />
                  )}
                  <span>{isWelcomeSent ? 'Welcome Sent' : 'Welcome Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSendFormModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-blue-200 text-[#032e92] hover:bg-blue-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Send Risk Profiler, Onboarding, or Combined Form"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-[#032e92]" />
                  <span>Send Form</span>
                </button>

                {leadData?.status !== 'Converted' && (
                  <button
                    type="button"
                    onClick={handleConvertClient}
                    disabled={actionLoading === 'convert'}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-1.5 shadow-2xs cursor-pointer ml-auto disabled:opacity-50"
                  >
                    {actionLoading === 'convert' ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" /> : <FontAwesomeIcon icon={faUserCheck} />}
                    <span>Convert to Client</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notifications / Feedback */}
            {feedback.message && (
              <div
                className={`mx-6 mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : feedback.type === 'info'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : feedback.type === 'warning'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    feedback.type === 'success'
                      ? faCheckCircle
                      : feedback.type === 'warning'
                      ? faTriangleExclamation
                      : faCircleExclamation
                  }
                />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center px-6 border-b border-gray-200 bg-white">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${activeTab === 'overview' ? 'border-[#032e92] text-[#032e92]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'timeline' ? 'border-[#032e92] text-[#032e92]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                <span>Interactions</span>
                <span className="w-5 h-5 rounded-full bg-blue-50 text-[#032e92] text-[10px] flex items-center justify-center font-bold">
                  {interactions.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === 'tasks' ? 'border-[#032e92] text-[#032e92]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                <span>Tasks</span>
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 text-[10px] flex items-center justify-center font-bold">
                  {tasks.length}
                </span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading ? (
                <div className="py-20 text-center">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-[#032e92] mb-3" />
                  <p className="text-xs text-gray-400 font-medium">Loading lead information...</p>
                </div>
              ) : activeTab === 'overview' ? (
                <div className="space-y-6">
                  {/* Latest Contact Remark & Tracking Section */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#032e92]" />
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Latest Contact Remark
                        </h4>
                      </div>
                      {/* Overdue Warning Badge */}
                      {(() => {
                        const contactInfo = getContactStatus(
                          leadData?.last_contacted_on,
                          leadData?.days_since_contact,
                          leadData?.is_contact_overdue
                        );
                        if (contactInfo.isOverdue) {
                          return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                              <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-xs" />
                              <span>{contactInfo.label}</span>
                            </span>
                          );
                        }
                        if (contactInfo.status === 'never_contacted') {
                          return (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                              <span>{contactInfo.label}</span>
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            <span>{contactInfo.label}</span>
                          </span>
                        );
                      })()}
                    </div>

                    {/* Current Remark Display */}
                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-gray-200/80 text-xs">
                      {leadData?.latest_remark ? (
                        <div>
                          <p className="text-gray-900 font-medium leading-relaxed whitespace-pre-wrap">
                            "{leadData.latest_remark}"
                          </p>
                          <div className="mt-3 pt-2.5 border-t border-gray-200 flex items-center justify-between gap-3 text-[11px] text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faUser} className="text-gray-400 text-[10px]" />
                              <span>Contacted by: <strong className="text-gray-700">{leadData.last_contacted_by || 'Unknown'}</strong></span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faClock} className="text-gray-400 text-[10px]" />
                              <span>{formatContactDate(leadData.last_contacted_on)}</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No contact remark recorded yet. Enter a remark below to record contact.</p>
                      )}
                    </div>

                    {/* New Remark Input Form */}
                    <form onSubmit={handleSaveRemark} className="space-y-2.5">
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                        Record New Contact Remark
                      </label>
                      <textarea
                        rows={2}
                        value={remarkText}
                        onChange={(e) => setRemarkText(e.target.value)}
                        placeholder="Enter the latest conversation notes, client discussion, or follow-up outcome..."
                        className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={savingRemark || !remarkText.trim()}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#032e92] hover:bg-[#021d63] text-white flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                        >
                          {savingRemark ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                              <span>Saving Remark...</span>
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />
                              <span>Save Remark</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Key Contacts */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block mb-0.5">Mobile Number</span>
                        <span className="font-semibold text-gray-900">{leadData?.mobile_no || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Email Address</span>
                        <span className="font-semibold text-gray-900">{leadData?.email || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">City / Location</span>
                        <span className="font-semibold text-gray-900">{leadData?.city || 'Not Specified'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Created On</span>
                        <span className="font-semibold text-gray-900">
                          {leadData?.creation ? new Date(leadData.creation).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wealth & Portfolio Objectives */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Investment Goals & Profiler</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block mb-0.5">Investment Range</span>
                        <span className="font-semibold text-gray-900">{leadData?.investment_amount_range || 'Not Defined'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Time Horizon</span>
                        <span className="font-semibold text-gray-900">{leadData?.investment_horizon || 'Not Defined'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Risk Profile</span>
                        <span className="font-semibold text-gray-900">{leadData?.risk_profile || 'Pending Profiler'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-0.5">Risk Score</span>
                        <span className="font-semibold text-gray-900">{leadData?.risk_score ? `${leadData.risk_score} / 100` : '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submission Status Badges */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lifecycle Tracking</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Welcome Email</span>
                        <span className="font-bold text-gray-800 text-xs mt-0.5 block">{leadData?.welcome_email_status || 'Not Sent'}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Risk Profiler</span>
                        <span className="font-bold text-gray-800 text-xs mt-0.5 block">{leadData?.risk_profiler_status || 'Not Initiated'}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">KYC / Onboarding</span>
                        <span className="font-bold text-gray-800 text-xs mt-0.5 block">{leadData?.onboarding_status || 'Not Initiated'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lead Notes */}
                  {leadData?.notes && (
                    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/60">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">Advisor Notes</h4>
                      <p className="text-xs text-amber-900 leading-relaxed font-normal whitespace-pre-wrap">
                        {leadData.notes}
                      </p>
                    </div>
                  )}
                </div>
              ) : activeTab === 'timeline' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Touchpoint Log</span>
                    <button
                      type="button"
                      onClick={() => onLogInteraction && onLogInteraction(leadData)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-[#032e92] hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faCommentDots} />
                      <span>Log New Touchpoint</span>
                    </button>
                  </div>

                  {interactions.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <FontAwesomeIcon icon={faCommentDots} className="text-2xl text-gray-300 mb-2" />
                      <p className="text-xs font-semibold text-gray-600">No interactions recorded yet</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Click above to log your first call or discussion</p>
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-blue-100 ml-3.5 space-y-5 py-2">
                      {interactions.map((int) => (
                        <div key={int.name} className="relative pl-6">
                          <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-[#032e92] border-2 border-white shadow-xs" />
                          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-gray-900">{int.summary}</span>
                              <span className="text-[10px] font-semibold text-gray-400">
                                {new Date(int.interaction_date).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2 text-[10px]">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#032e92] font-semibold">{int.interaction_type}</span>
                              <span className="text-gray-400 font-medium">Logged by {int.logged_by}</span>
                            </div>
                            {int.details && <p className="text-xs text-gray-600 leading-relaxed mb-2">{int.details}</p>}
                            {int.outcome && (
                              <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-medium inline-block">
                                Outcome: {int.outcome}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Associated Tasks</span>
                    <button
                      type="button"
                      onClick={() => onNewTask && onNewTask(leadData)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-[#032e92] hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faListCheck} />
                      <span>Add Follow-up Task</span>
                    </button>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <FontAwesomeIcon icon={faListCheck} className="text-2xl text-gray-300 mb-2" />
                      <p className="text-xs font-semibold text-gray-600">No open tasks for this lead</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Add reminders for callbacks, document collection, or meetings</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {tasks.map((t) => (
                        <div key={t.name} className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs flex items-start justify-between gap-3">
                          <div>
                            <h5 className="text-xs font-bold text-gray-900">{t.title}</h5>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">{t.priority}</span>
                              <span>Due: {t.due_date}</span>
                              <span>Status: {t.status}</span>
                            </div>
                            {t.description && <p className="text-xs text-gray-600 mt-1.5">{t.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <CrmSendFormModal
        isOpen={sendFormModalOpen}
        onClose={() => setSendFormModalOpen(false)}
        record={leadData || {}}
        referenceDoctype="Lead"
        onFormSent={async () => {
          await loadDetails(true);
          if (onLeadUpdated && leadData) {
            onLeadUpdated({ ...leadData });
          }
        }}
      />
    </AnimatePresence>
  );
}
