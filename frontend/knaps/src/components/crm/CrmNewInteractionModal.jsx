import CrmSelect from './CrmSelect';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCommentDots, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { crmService } from '../../services/crmService';

export default function CrmNewInteractionModal({ isOpen, onClose, onLogged, relatedLead = null, relatedClient = null }) {
  const [formData, setFormData] = useState({
    interaction_type: 'Phone Call',
    direction: 'Outbound',
    summary: '',
    details: '',
    outcome: '',
    next_step: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.summary.trim()) {
      setError('Please provide a brief interaction summary.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        related_lead: relatedLead?.name || null,
        related_client: relatedClient?.name || null,
      };
      const interaction = await crmService.logInteraction(payload);
      onLogged && onLogged(interaction);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to log interaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#f8fafc]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#032e92] border border-blue-100 flex items-center justify-center text-sm font-bold shadow-2xs">
                <FontAwesomeIcon icon={faCommentDots} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-tight">Log Interaction</h3>
                <p className="text-xs text-gray-500 font-medium">
                  {relatedLead ? `For Lead: ${relatedLead.lead_name}` : relatedClient ? `For Client: ${relatedClient.client_name}` : 'Record a touchpoint'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Touchpoint Type
                </label>
                <CrmSelect
                  value={formData.interaction_type}
                  onChange={(val) => setFormData({ ...formData, interaction_type: val })}
                  options={[
                    "Phone Call",
                    "WhatsApp",
                    "In-Person Meeting",
                    "Video Consultation",
                    "Email",
                    "Internal Note",
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Direction
                </label>
                <CrmSelect
                  value={formData.direction}
                  onChange={(val) => setFormData({ ...formData, direction: val })}
                  options={[
                    { value: "Outbound", label: "Outbound (Advisor reached out)" },
                    { value: "Inbound", label: "Inbound (Client reached out)" },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Summary / Headline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Discussed NPS Tier 1 tax planning & SIF allocation"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Detailed Discussion & Notes
              </label>
              <textarea
                rows="3"
                placeholder="Key investor concerns, questions asked, portfolio details mentioned..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Call / Meeting Outcome
                </label>
                <input
                  type="text"
                  placeholder="e.g. Positive, Requested proposal"
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Next Step
                </label>
                <input
                  type="text"
                  placeholder="e.g. Send WhatsApp brochure, Follow up on Monday"
                  value={formData.next_step}
                  onChange={(e) => setFormData({ ...formData, next_step: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-ripple px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#032e92] hover:bg-[#021d63] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    <span>Logging...</span>
                  </>
                ) : (
                  <span>Save Interaction</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}